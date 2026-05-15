import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tipe = searchParams.get('tipe');
  const email = searchParams.get('email');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let query = `
    WITH all_transactions AS (
      SELECT 'Transfer' AS tipe,
             p.first_mid_name || ' ' || p.last_name AS nama_member,
             t.email_member_1 AS email_member,
             -t.jumlah AS miles, t.timestamp,
             t.email_member_1 AS ref_1, t.email_member_2 AS ref_2, t.timestamp AS ref_ts
      FROM TRANSFER t
      JOIN PENGGUNA p ON t.email_member_1 = p.email
      
      UNION ALL
      
      SELECT 'Transfer' AS tipe,
             p.first_mid_name || ' ' || p.last_name AS nama_member,
             t.email_member_2 AS email_member,
             t.jumlah AS miles, t.timestamp,
             t.email_member_1 AS ref_1, t.email_member_2 AS ref_2, t.timestamp AS ref_ts
      FROM TRANSFER t
      JOIN PENGGUNA p ON t.email_member_2 = p.email

      UNION ALL

      SELECT 'Redeem' AS tipe,
             p.first_mid_name || ' ' || p.last_name AS nama_member,
             r.email_member, -h.miles AS miles, r.timestamp,
             r.email_member AS ref_1, r.kode_hadiah AS ref_2, r.timestamp AS ref_ts
      FROM REDEEM r
      JOIN HADIAH h ON r.kode_hadiah = h.kode_hadiah
      JOIN PENGGUNA p ON r.email_member = p.email

      UNION ALL

      SELECT 'Pembelian Package' AS tipe,
             p.first_mid_name || ' ' || p.last_name AS nama_member,
             map.email_member, ap.jumlah_award_miles AS miles, map.timestamp,
             map.email_member AS ref_1, map.id_award_miles_package::text AS ref_2, map.timestamp AS ref_ts
      FROM MEMBER_AWARD_MILES_PACKAGE map
      JOIN AWARD_MILES_PACKAGE ap ON map.id_award_miles_package = ap.id
      JOIN PENGGUNA p ON map.email_member = p.email

      UNION ALL

      SELECT 'Klaim Disetujui' AS tipe,
             p.first_mid_name || ' ' || p.last_name AS nama_member,
             c.email_member, 1000 AS miles, c.timestamp,
             c.email_member AS ref_1, c.flight_number AS ref_2, c.timestamp AS ref_ts
      FROM CLAIM_MISSING_MILES c
      JOIN PENGGUNA p ON c.email_member = p.email
      WHERE c.status_penerimaan = 'Disetujui'
    )
    SELECT * FROM all_transactions
    WHERE 1=1
  `;

  const values: any[] = [];
  let paramIndex = 1;

  if (tipe) {
    query += ` AND tipe = $${paramIndex++}`;
    values.push(tipe);
  }
  if (email) {
    query += ` AND email_member ILIKE $${paramIndex++}`;
    values.push(`%${email}%`);
  }
  if (startDate) {
    query += ` AND timestamp >= $${paramIndex++}`;
    values.push(startDate);
  }
  if (endDate) {
    query += ` AND timestamp <= $${paramIndex++}`;
    values.push(`${endDate} 23:59:59`);
  }

  query += ` ORDER BY timestamp DESC`;

  try {
    const result = await pool.query(query, values);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
