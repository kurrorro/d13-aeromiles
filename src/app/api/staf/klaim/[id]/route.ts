import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await pool.query(`
      SELECT c.*, m.nama_maskapai, p.first_mid_name, p.last_name
      FROM CLAIM_MISSING_MILES c
      JOIN MASKAPAI m ON c.maskapai = m.kode_maskapai
      JOIN MEMBER mem ON c.email_member = mem.email
      JOIN PENGGUNA p ON mem.email = p.email
      WHERE c.id = $1
    `, [params.id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    const row = res.rows[0];
    row.nama_member = `${row.first_mid_name} ${row.last_name}`;

    return NextResponse.json(row);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { status } = body;

  if (!['Disetujui', 'Ditolak'].includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
  }

  try {
    const res = await pool.query(`
      UPDATE CLAIM_MISSING_MILES SET
        status_penerimaan = $1,
        email_staf = $2
      WHERE id = $3
      RETURNING *
    `, [status, session.user.email, params.id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Staff Update Claim Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
