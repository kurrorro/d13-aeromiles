import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const bandaraRes = await pool.query('SELECT iata_code, nama, kota, negara FROM aeromiles.BANDARA ORDER BY nama');
    const maskapaiRes = await pool.query('SELECT kode_maskapai, nama_maskapai FROM aeromiles.MASKAPAI ORDER BY nama_maskapai');
    
    return NextResponse.json({
      bandara: bandaraRes.rows,
      maskapai: maskapaiRes.rows,
    });
  } catch (error) {
    console.error('Error fetching bandara/maskapai:', error);
    return NextResponse.json({ error: 'Gagal mengambil data bandara dan maskapai' }, { status: 500 });
  }
}
