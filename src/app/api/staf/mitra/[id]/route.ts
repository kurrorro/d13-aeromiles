import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emailMitra = decodeURIComponent(params.id);
    const { nama_mitra, tanggal_kerja_sama } = await req.json();

    await pool.query(`
      UPDATE MITRA
      SET nama_mitra = $1, tanggal_kerja_sama = $2
      WHERE email_mitra = $3
    `, [nama_mitra, tanggal_kerja_sama, emailMitra]);

    return NextResponse.json({ message: 'Informasi mitra berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emailMitra = decodeURIComponent(params.id);

    const res = await pool.query('SELECT id_penyedia FROM MITRA WHERE email_mitra = $1', [emailMitra]);
    if (res.rows.length === 0) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    const idPenyedia = res.rows[0].id_penyedia;

    await pool.query('DELETE FROM PENYEDIA WHERE id = $1', [idPenyedia]);

    return NextResponse.json({ message: 'Mitra dan data terkait berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
