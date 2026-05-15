import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await pool.query(`
      SELECT t.*, p1.first_mid_name as nama_1, p2.first_mid_name as nama_2
      FROM aeromiles.TRANSFER t
      JOIN aeromiles.PENGGUNA p1 ON t.email_member_1 = p1.email
      JOIN aeromiles.PENGGUNA p2 ON t.email_member_2 = p2.email
      WHERE t.email_member_1 = $1 OR t.email_member_2 = $1
      ORDER BY t.timestamp DESC
    `, [session.user.email]);

    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
