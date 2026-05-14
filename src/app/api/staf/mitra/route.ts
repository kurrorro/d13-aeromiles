import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await pool.query(`
      SELECT email_mitra, id_penyedia, nama_mitra, tanggal_kerja_sama
      FROM MITRA
      ORDER BY nama_mitra
    `);
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const { email_mitra, nama_mitra, tanggal_kerja_sama } = await req.json();

    await client.query('BEGIN');

    const penyediaRes = await client.query('INSERT INTO PENYEDIA DEFAULT VALUES RETURNING id');
    const idPenyedia = penyediaRes.rows[0].id;

    await client.query(`
      INSERT INTO MITRA (email_mitra, id_penyedia, nama_mitra, tanggal_kerja_sama)
      VALUES ($1, $2, $3, $4)
    `, [email_mitra, idPenyedia, nama_mitra, tanggal_kerja_sama]);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Mitra berhasil didaftarkan', idPenyedia });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
