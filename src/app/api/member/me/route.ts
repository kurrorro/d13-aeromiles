import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT m.*, p.first_mid_name, p.last_name, p.salutation,
              t.nama as nama_tier,
              (SELECT COUNT(*) FROM claim_missing_miles WHERE email_member = m.email AND status_penerimaan = 'Disetujui') as frekuensi_terbang
       FROM member m
       JOIN pengguna p ON m.email = p.email
       JOIN tier t ON m.id_tier = t.id_tier
       WHERE m.email = $1`,
      [session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = result.rows[0];
    // Ensure numeric values are numbers
    member.total_miles = parseInt(member.total_miles);
    member.award_miles = parseInt(member.award_miles);
    member.frekuensi_terbang = parseInt(member.frekuensi_terbang);


    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}