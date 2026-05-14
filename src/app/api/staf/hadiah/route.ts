import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const idPenyedia = searchParams.get('idPenyedia');
  const status = searchParams.get('status');

  try {
    let query = `
      SELECT h.kode_hadiah, h.nama, h.deskripsi, h.miles,
             h.valid_start_date, h.program_end, h.id_penyedia,
             COALESCE(ma.nama_maskapai, mi.nama_mitra) AS nama_penyedia,
             CASE WHEN h.program_end >= CURRENT_DATE THEN 'Aktif' 
                  ELSE 'Tidak Aktif' END AS status
      FROM HADIAH h
      LEFT JOIN MASKAPAI ma ON h.id_penyedia = ma.id_penyedia
      LEFT JOIN MITRA mi ON h.id_penyedia = mi.id_penyedia
      WHERE 1=1
    `;
    const values: any[] = [];

    if (idPenyedia) {
      values.push(idPenyedia);
      query += ` AND h.id_penyedia = $${values.length}`;
    }

    if (status) {
      if (status === 'Aktif') {
        query += ` AND h.program_end >= CURRENT_DATE`;
      } else if (status === 'Tidak Aktif') {
        query += ` AND h.program_end < CURRENT_DATE`;
      }
    }

    query += ` ORDER BY h.kode_hadiah`;

    const res = await pool.query(query, values);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { nama, miles, deskripsi, valid_start_date, program_end, id_penyedia } = await req.json();

    const lastCodeRes = await pool.query(`SELECT kode_hadiah FROM HADIAH ORDER BY kode_hadiah DESC LIMIT 1`);
    let newCode = 'RWD-001';

    if (lastCodeRes.rows.length > 0) {
      const lastCode = lastCodeRes.rows[0].kode_hadiah;
      const lastNum = parseInt(lastCode.split('-')[1]);
      newCode = `RWD-${(lastNum + 1).toString().padStart(3, '0')}`;
    }

    await pool.query(`
      INSERT INTO HADIAH (kode_hadiah, nama, miles, deskripsi, valid_start_date, program_end, id_penyedia)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [newCode, nama, miles, deskripsi, valid_start_date, program_end, id_penyedia]);

    return NextResponse.json({ message: 'Hadiah berhasil ditambahkan', kode: newCode });
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
