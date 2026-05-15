import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await pool.query(`
      SELECT r.timestamp, h.nama as nama_hadiah, h.kode_hadiah, h.miles
      FROM aeromiles.REDEEM r
      JOIN aeromiles.HADIAH h ON r.kode_hadiah = h.kode_hadiah
      WHERE r.email_member = $1
      ORDER BY r.timestamp DESC
    `, [session.user.email]);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Fetch Redeem History Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
