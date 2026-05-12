import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const airlinesRes = await pool.query('SELECT kode_maskapai, nama_maskapai FROM MASKAPAI ORDER BY nama_maskapai');
    const airportsRes = await pool.query('SELECT iata_code, nama, kota FROM BANDARA ORDER BY nama');

    return NextResponse.json({
      airlines: airlinesRes.rows,
      airports: airportsRes.rows
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
