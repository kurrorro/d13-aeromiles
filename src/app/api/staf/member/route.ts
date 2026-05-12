import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q') || '';
  const tier = searchParams.get('tier') || '';

  try {
    let query = `
      SELECT m.nomor_member, 
             p.salutation || ' ' || p.first_mid_name || ' ' || p.last_name AS nama_lengkap,
             p.salutation, p.first_mid_name, p.last_name,
             p.email, m.id_tier, m.award_miles, m.total_miles, 
             TO_CHAR(m.tanggal_bergabung, 'YYYY-MM-DD') AS tanggal_bergabung
      FROM MEMBER m JOIN PENGGUNA p ON m.email = p.email
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (LOWER(p.first_mid_name) LIKE LOWER($${paramCount}) OR LOWER(p.last_name) LIKE LOWER($${paramCount}) OR LOWER(p.email) LIKE LOWER($${paramCount}) OR LOWER(m.nomor_member) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (tier) {
      query += ` AND m.id_tier = $${paramCount}`;
      params.push(tier);
      paramCount++;
    }

    query += ' ORDER BY m.nomor_member';

    const { rows } = await pool.query(query, params);
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
