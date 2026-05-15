import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'staf') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `
        SELECT 
            p.first_mid_name || ' ' || p.last_name AS nama,
            r.email_member AS email,
            COUNT(r.*) AS jumlah_redeem,
            COALESCE(SUM(h.miles), 0) AS total_miles_diredeemed
        FROM aeromiles.redeem r
        JOIN aeromiles.hadiah h ON r.kode_hadiah = h.kode_hadiah
        JOIN aeromiles.pengguna p ON r.email_member = p.email
        GROUP BY r.email_member, p.first_mid_name, p.last_name
        ORDER BY jumlah_redeem DESC, total_miles_diredeemed DESC
        LIMIT 5;
    `;

    try {
        const result = await pool.query(query);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching top redeem:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
