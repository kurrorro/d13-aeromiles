import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'staf') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const statRes = await pool.query(`
        SELECT 
            (SELECT COALESCE(SUM(award_miles), 0) FROM MEMBER) AS total_miles_beredar,
            (SELECT COALESCE(SUM(h.miles), 0) FROM REDEEM r 
             JOIN HADIAH h ON r.kode_hadiah = h.kode_hadiah
             WHERE DATE_TRUNC('month', r.timestamp) = DATE_TRUNC('month', NOW())) AS redeem_bulan_ini,
            (SELECT COUNT(*) FROM CLAIM_MISSING_MILES 
             WHERE status_penerimaan = 'Disetujui') AS total_klaim_disetujui
    `);


        const top5Res = await pool.query(`SELECT * FROM aeromiles.fn_top5_member_by_miles()`);

        const transactionsRes = await pool.query(`
        SELECT 'Transfer' AS tipe, 
               p.first_mid_name || ' ' || p.last_name AS nama_member,
               t.email_member_1 AS email_member,
               t.jumlah AS miles, t.timestamp,
               'T|' || t.email_member_1 || '|' || t.email_member_2 || '|' || t.timestamp as id
        FROM TRANSFER t JOIN PENGGUNA p ON t.email_member_1 = p.email

        UNION ALL

        SELECT 'Redeem',
               p.first_mid_name || ' ' || p.last_name,
               r.email_member, h.miles * -1, r.timestamp,
               'R|' || r.email_member || '|' || r.kode_hadiah || '|' || r.timestamp
        FROM REDEEM r JOIN HADIAH h ON r.kode_hadiah = h.kode_hadiah
        JOIN PENGGUNA p ON r.email_member = p.email

        UNION ALL

        SELECT 'Pembelian Package',
               p.first_mid_name || ' ' || p.last_name,
               map.email_member, ap.jumlah_award_miles, map.timestamp,
               'P|' || map.email_member || '|' || map.id_award_miles_package || '|' || map.timestamp
        FROM MEMBER_AWARD_MILES_PACKAGE map
        JOIN AWARD_MILES_PACKAGE ap ON map.id_award_miles_package = ap.id
        JOIN PENGGUNA p ON map.email_member = p.email

        UNION ALL

        SELECT 'Klaim Disetujui',
               p.first_mid_name || ' ' || p.last_name,
               c.email_member, 1000, c.timestamp,
               'C|' || c.id
        FROM CLAIM_MISSING_MILES c JOIN PENGGUNA p ON c.email_member = p.email
        WHERE c.status_penerimaan = 'Disetujui'

        ORDER BY timestamp DESC
    `);


        const stats = {
            total_miles_beredar: parseInt(statRes.rows[0].total_miles_beredar),
            redeem_bulan_ini: parseInt(statRes.rows[0].redeem_bulan_ini),
            total_klaim_disetujui: parseInt(statRes.rows[0].total_klaim_disetujui)
        };

        const topMembers = top5Res.rows.map(m => ({
            ...m,
            total_miles: parseInt(m.total_miles)
        }));

        const transactions = transactionsRes.rows.map(t => ({
            ...t,
            miles: parseInt(t.miles)
        }));

        return NextResponse.json({
            stats,
            topMembers,
            transactions
        });
    } catch (error) {

        console.error('Error fetching report data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'staf') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, email_member_1, email_member_2, timestamp: bodyTimestamp } = await req.json();

    try {
        if (id?.startsWith('T|') || (email_member_1 && email_member_2 && bodyTimestamp)) {
            let e1 = email_member_1, e2 = email_member_2, ts = bodyTimestamp;
            if (id?.startsWith('T|')) {
                const parts = id.split('|');
                e1 = parts[1]; e2 = parts[2]; ts = parts[3];
            }
            await pool.query('DELETE FROM TRANSFER WHERE email_member_1 = $1 AND email_member_2 = $2 AND timestamp = $3', [e1, e2, ts]);
        } else if (id?.startsWith('R|')) {
            const [, email, kode, timestamp] = id.split('|');
            await pool.query('DELETE FROM REDEEM WHERE email_member = $1 AND kode_hadiah = $2 AND timestamp = $3', [email, kode, timestamp]);
        } else if (id?.startsWith('P|')) {
            const [, email, pkg_id, timestamp] = id.split('|');
            await pool.query('DELETE FROM MEMBER_AWARD_MILES_PACKAGE WHERE email_member = $1 AND id_award_miles_package = $2 AND timestamp = $3', [email, pkg_id, timestamp]);
        } else if (id?.startsWith('C|')) {
            return NextResponse.json({ error: 'Transaksi Klaim Disetujui tidak dapat dihapus!' }, { status: 400 });
        }


        return NextResponse.json({ message: 'Transaksi berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json({ error: 'Gagal menghapus transaksi' }, { status: 500 });
    }
}
