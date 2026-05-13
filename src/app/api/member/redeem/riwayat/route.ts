import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';

export async function GET() {
  const session = await getServerSession();
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email_member = session.user?.email;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT r.kode_hadiah, h.nama, r.timestamp, h.miles
        FROM REDEEM r
        JOIN HADIAH h ON r.kode_hadiah = h.kode_hadiah
        WHERE r.email_member = $1
        ORDER BY r.timestamp DESC;
      `, [email_member]);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
