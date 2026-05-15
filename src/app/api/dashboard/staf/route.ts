import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;

  try {
    const stafInfoRes = await pool.query(`
      SELECT s.id_staf, s.kode_maskapai, m.nama_maskapai,
             p.salutation, p.first_mid_name, p.last_name, p.mobile_number, p.kewarganegaraan, p.tanggal_lahir
      FROM STAF s
      JOIN PENGGUNA p ON s.email = p.email
      JOIN MASKAPAI m ON s.kode_maskapai = m.kode_maskapai
      WHERE s.email = $1
    `, [email]);

    if (stafInfoRes.rows.length === 0) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }
    const profile = stafInfoRes.rows[0];
    const kodeMaskapai = profile.kode_maskapai;

    const waitingRes = await pool.query(`
      SELECT count(*) as count 
      FROM CLAIM_MISSING_MILES 
      WHERE status_penerimaan = 'Menunggu'
    `);

    const statsRes = await pool.query(`
      SELECT 
        SUM(CASE WHEN status_penerimaan = 'Disetujui' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status_penerimaan = 'Ditolak' THEN 1 ELSE 0 END) as rejected_count
      FROM CLAIM_MISSING_MILES 
      WHERE email_staf = $1
    `, [email]);

    const stats = statsRes.rows[0];

    return NextResponse.json({
      profile,
      waiting_count: parseInt(waitingRes.rows[0].count),
      approved_count: parseInt(stats.approved_count || 0),
      rejected_count: parseInt(stats.rejected_count || 0)
    });
  } catch (error) {
    console.error('Staf Dashboard Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
