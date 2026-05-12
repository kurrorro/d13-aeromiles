import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;

  try {
    const res = await pool.query(`
      SELECT 
        t.*,
        p1.first_mid_name || ' ' || p1.last_name as nama_1,
        p2.first_mid_name || ' ' || p2.last_name as nama_2
      FROM TRANSFER t
      JOIN PENGGUNA p1 ON t.email_member_1 = p1.email
      JOIN PENGGUNA p2 ON t.email_member_2 = p2.email
      WHERE t.email_member_1 = $1 OR t.email_member_2 = $1
      ORDER BY t.timestamp DESC
    `, [email]);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Fetch Transfer History Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
