import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;
  const nomor = decodeURIComponent(id);

  try {
    const query = `
      SELECT nomor, jenis, negara_penerbit, 
             TO_CHAR(tanggal_terbit, 'YYYY-MM-DD') AS tanggal_terbit, 
             TO_CHAR(tanggal_habis, 'YYYY-MM-DD') AS tanggal_habis
      FROM IDENTITAS 
      WHERE nomor = $1 AND email_member = $2
    `;
    const { rows } = await pool.query(query, [nomor, email]);
    if (rows.length === 0) {
        return NextResponse.json({ error: 'Identitas not found' }, { status: 404 });
    }
    return NextResponse.json({ data: rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching identitas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;
  const nomor = decodeURIComponent(id);
  const data = await request.json();

  const { jenis, negara_penerbit, tanggal_terbit, tanggal_habis } = data;

  try {
    const check = await pool.query('SELECT nomor FROM IDENTITAS WHERE nomor = $1 AND email_member = $2', [nomor, email]);
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized to edit this document' }, { status: 403 });
    }

    await pool.query(`
      UPDATE IDENTITAS 
      SET jenis = $1, negara_penerbit = $2, tanggal_terbit = $3, tanggal_habis = $4
      WHERE nomor = $5 AND email_member = $6
    `, [jenis, negara_penerbit, tanggal_terbit, tanggal_habis, nomor, email]);

    return NextResponse.json({ message: 'Update successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating identitas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;
  const nomor = decodeURIComponent(id);

  try {
    const check = await pool.query('SELECT nomor FROM IDENTITAS WHERE nomor = $1 AND email_member = $2', [nomor, email]);
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized to delete this document' }, { status: 403 });
    }

    await pool.query('DELETE FROM IDENTITAS WHERE nomor = $1 AND email_member = $2', [nomor, email]);

    return NextResponse.json({ message: 'Delete successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting identitas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
