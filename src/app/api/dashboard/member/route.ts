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
    const profileRes = await pool.query(`
      SELECT 
        p.first_mid_name, p.last_name, p.salutation, p.email, p.mobile_number, p.kewarganegaraan, p.tanggal_lahir,
        m.nomor_member, m.tanggal_bergabung, m.award_miles, m.total_miles,
        t.nama as tier_name
      FROM PENGGUNA p
      JOIN MEMBER m ON p.email = m.email
      JOIN TIER t ON m.id_tier = t.id_tier
      WHERE p.email = $1
    `, [email]);

    if (profileRes.rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const profile = profileRes.rows[0];

    const transactionsRes = await pool.query(`
      (SELECT 'Redeem' as tipe, h.nama as keterangan, r.timestamp, -h.miles as amount
       FROM REDEEM r JOIN HADIAH h ON r.kode_hadiah = h.kode_hadiah
       WHERE email_member = $1)
      UNION ALL
      (SELECT 'Transfer Out' as tipe, 'Ke: ' || email_member_2 as keterangan, timestamp, -jumlah as amount
       FROM TRANSFER WHERE email_member_1 = $1)
      UNION ALL
      (SELECT 'Transfer In' as tipe, 'Dari: ' || email_member_1 as keterangan, timestamp, jumlah as amount
       FROM TRANSFER WHERE email_member_2 = $1)
      UNION ALL
      (SELECT 'Package' as tipe, id_award_miles_package as keterangan, m.timestamp, p.jumlah_award_miles as amount
       FROM MEMBER_AWARD_MILES_PACKAGE m JOIN AWARD_MILES_PACKAGE p ON m.id_award_miles_package = p.id
       WHERE email_member = $1)
      UNION ALL
      (SELECT 'Claim' as tipe, 'Flight: ' || flight_number as keterangan, timestamp, 1000 as amount
       FROM CLAIM_MISSING_MILES WHERE email_member = $1 AND status_penerimaan = 'Disetujui')
      ORDER BY timestamp DESC
      LIMIT 5
    `, [email]);

    return NextResponse.json({
      profile,
      transactions: transactionsRes.rows
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
