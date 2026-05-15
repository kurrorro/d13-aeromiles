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
            t.email_member_1 AS email,
            COUNT(t.*) AS jumlah_transfer,
            COALESCE(SUM(t.jumlah), 0) AS total_miles_ditransfer
        FROM aeromiles.transfer t
        JOIN aeromiles.pengguna p ON t.email_member_1 = p.email
        GROUP BY t.email_member_1, p.first_mid_name, p.last_name
        ORDER BY jumlah_transfer DESC, total_miles_ditransfer DESC
        LIMIT 5;
    `;

    try {
        const result = await pool.query(query);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching top transfer:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
