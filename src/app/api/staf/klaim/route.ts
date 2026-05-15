import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Akses ditolak. Halaman ini hanya untuk Staf.' }, { status: 403 });
  }

  const email_staf = session.user.email;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const maskapaiParam = searchParams.get('maskapai');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const stafRes = await pool.query('SELECT kode_maskapai FROM aeromiles.STAF WHERE email = $1', [email_staf]);
    const myMaskapai = stafRes.rows.length > 0 ? stafRes.rows[0].kode_maskapai : null;

    let query = `
      SELECT c.*, m.nama_maskapai, p.first_mid_name, p.last_name
      FROM aeromiles.CLAIM_MISSING_MILES c
      JOIN aeromiles.MASKAPAI m ON c.maskapai = m.kode_maskapai
      JOIN aeromiles.MEMBER mem ON c.email_member = mem.email
      JOIN aeromiles.PENGGUNA p ON mem.email = p.email
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND c.status_penerimaan = $${params.length}`;
    }
    if (maskapaiParam) {
      params.push(maskapaiParam);
      query += ` AND c.maskapai = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      query += ` AND c.tanggal_penerbangan >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND c.tanggal_penerbangan <= $${params.length}`;
    }

    query += ` ORDER BY c.timestamp DESC`;

    const res = await pool.query(query, params);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Staff Fetch Claims Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
