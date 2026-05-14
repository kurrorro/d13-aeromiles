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
      SELECT id_penyedia, nama_maskapai AS nama, 'Maskapai' AS jenis 
      FROM MASKAPAI
      UNION ALL
      SELECT id_penyedia, nama_mitra AS nama, 'Mitra' AS jenis 
      FROM MITRA
      ORDER BY nama
    `);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
