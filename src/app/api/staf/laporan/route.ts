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
        const { executeWithNotices } = await import('@/lib/db');
        const statRes = await executeWithNotices(`
        SELECT 
            (SELECT COALESCE(SUM(total_miles), 0) FROM aeromiles.MEMBER) AS total_miles_beredar,
            (SELECT COALESCE(SUM(h.miles), 0) FROM aeromiles.REDEEM r 
             JOIN aeromiles.HADIAH h ON r.kode_hadiah = h.kode_hadiah
             WHERE DATE_TRUNC('month', r.timestamp) = DATE_TRUNC('month', NOW())) AS redeem_bulan_ini,
            (SELECT COUNT(*) FROM aeromiles.CLAIM_MISSING_MILES 
             WHERE status_penerimaan = 'Disetujui') AS total_klaim_disetujui
    `);


        const top5Res = await executeWithNotices(`SELECT * FROM aeromiles.get_top_5_members()`);

        const transactionsRes = await executeWithNotices(`
        SELECT 'Transfer' AS tipe, 
               p.first_mid_name || ' ' || p.last_name AS nama_member,
               t.email_member_1 AS email_member,
               t.jumlah AS miles, t.timestamp,
               'T|' || t.email_member_1 || '|' || t.email_member_2 || '|' || t.timestamp::TEXT as id
        FROM aeromiles.TRANSFER t JOIN aeromiles.PENGGUNA p ON t.email_member_1 = p.email
        UNION ALL
        SELECT 'Redeem' AS tipe, 
               p.first_mid_name || ' ' || p.last_name AS nama_member,
               r.email_member,
               h.miles * -1 AS miles, r.timestamp,
               'R|' || r.email_member || '|' || r.kode_hadiah || '|' || r.timestamp::TEXT as id
        FROM aeromiles.REDEEM r 
        JOIN aeromiles.HADIAH h ON r.kode_hadiah = h.kode_hadiah
        JOIN aeromiles.PENGGUNA p ON r.email_member = p.email
        UNION ALL
        SELECT 'Package' AS tipe, 
               p.first_mid_name || ' ' || p.last_name AS nama_member,
               m.email_member,
               a.jumlah_award_miles AS miles, m.timestamp,
               'P|' || m.email_member || '|' || m.id_award_miles_package || '|' || m.timestamp::TEXT as id
        FROM aeromiles.MEMBER_AWARD_MILES_PACKAGE m
        JOIN aeromiles.AWARD_MILES_PACKAGE a ON m.id_award_miles_package = a.id
        JOIN aeromiles.PENGGUNA p ON m.email_member = p.email
        UNION ALL
        SELECT 'Claim' AS tipe, 
               p.first_mid_name || ' ' || p.last_name AS nama_member,
               c.email_member,
               1000 AS miles, c.timestamp,
               'C|' || c.id::TEXT as id
        FROM aeromiles.CLAIM_MISSING_MILES c 
        JOIN aeromiles.PENGGUNA p ON c.email_member = p.email
        WHERE c.status_penerimaan = 'Disetujui'
        ORDER BY timestamp DESC
        LIMIT 50
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

        const top5Notice = top5Res.notices.find(n => n.startsWith('SUKSES:'));

        return NextResponse.json({
            stats,
            topMembers,
            transactions,
            message: top5Notice
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
