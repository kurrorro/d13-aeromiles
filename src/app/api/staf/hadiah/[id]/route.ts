import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET: Single Hadiah Detail
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await pool.query(`SELECT * FROM HADIAH WHERE kode_hadiah = $1`, [params.id]);
    if (res.rows.length === 0) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update Hadiah
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { nama, miles, deskripsi, valid_start_date, program_end, id_penyedia } = await req.json();
    await pool.query(`
      UPDATE HADIAH
      SET nama = $1, miles = $2, deskripsi = $3,
          valid_start_date = $4, program_end = $5, id_penyedia = $6
      WHERE kode_hadiah = $7
    `, [nama, miles, deskripsi, valid_start_date, program_end, id_penyedia, params.id]);

    return NextResponse.json({ message: 'Hadiah berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Hapus Hadiah (Hanya jika sudah expired)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Cek dulu apakah expired
    const checkRes = await pool.query(`SELECT program_end FROM HADIAH WHERE kode_hadiah = $1`, [params.id]);
    if (checkRes.rows.length === 0) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const programEnd = new Date(checkRes.rows[0].program_end);
    if (programEnd >= new Date()) {
      return NextResponse.json({ error: 'Hanya hadiah yang sudah tidak berlaku (expired) yang dapat dihapus.' }, { status: 400 });
    }

    await pool.query(`DELETE FROM HADIAH WHERE kode_hadiah = $1`, [params.id]);
    return NextResponse.json({ message: 'Hadiah berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
