import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;

  try {
    const query = `
      SELECT nomor, jenis, negara_penerbit, 
             TO_CHAR(tanggal_terbit, 'YYYY-MM-DD') AS tanggal_terbit, 
             TO_CHAR(tanggal_habis, 'YYYY-MM-DD') AS tanggal_habis
      FROM IDENTITAS 
      WHERE email_member = $1
      ORDER BY tanggal_terbit DESC
    `;
    const { rows } = await pool.query(query, [email]);
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching identitas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;
  const data = await request.json();

  const { nomor, jenis, negara_penerbit, tanggal_terbit, tanggal_habis } = data;

  try {
    const checkNomor = await pool.query('SELECT nomor FROM IDENTITAS WHERE nomor = $1', [nomor]);
    if (checkNomor.rows.length > 0) {
      return NextResponse.json({ error: 'Nomor dokumen sudah terdaftar di sistem' }, { status: 400 });
    }

    await pool.query(`
      INSERT INTO IDENTITAS (nomor, jenis, negara_penerbit, tanggal_terbit, tanggal_habis, email_member)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [nomor, jenis, negara_penerbit, tanggal_terbit, tanggal_habis, email]);

    return NextResponse.json({ message: 'Identitas berhasil ditambahkan' }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding identitas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
