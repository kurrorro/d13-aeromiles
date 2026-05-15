import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email_member = session.user?.email;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT map.id_award_miles_package, ap.jumlah_award_miles,
               ap.harga_paket, map.timestamp
        FROM MEMBER_AWARD_MILES_PACKAGE map
        JOIN AWARD_MILES_PACKAGE ap ON map.id_award_miles_package = ap.id
        WHERE map.email_member = $1
        ORDER BY map.timestamp DESC;
      `, [email_member]);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
