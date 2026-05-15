import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const query = `
    SELECT
        (SELECT COALESCE(SUM(total_miles), 0) FROM MEMBER) AS total_miles_beredar,
        (SELECT COUNT(*) FROM REDEEM
         WHERE DATE_TRUNC('month', timestamp) = DATE_TRUNC('month', NOW())) AS redeem_bulan_ini,
        (SELECT COUNT(*) FROM CLAIM_MISSING_MILES
         WHERE status_penerimaan = 'Disetujui') AS total_klaim_disetujui;
  `;

  try {
    const result = await pool.query(query);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

