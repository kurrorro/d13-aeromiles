import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await pool.query(`
      SELECT c.*, m.nama_maskapai, b1.nama as nama_asal, b2.nama as nama_tujuan
      FROM CLAIM_MISSING_MILES c
      JOIN MASKAPAI m ON c.maskapai = m.kode_maskapai
      JOIN BANDARA b1 ON c.bandara_asal = b1.iata_code
      JOIN BANDARA b2 ON c.bandara_tujuan = b2.iata_code
      WHERE c.email_member = $1
      ORDER BY c.timestamp DESC
    `, [session.user.email]);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Fetch Claims Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { 
    maskapai, bandara_asal, bandara_tujuan, 
    tanggal_penerbangan, flight_number, nomor_tiket, 
    kelas_kabin, pnr 
  } = body;

  try {
    // Explicitly target the aeromiles schema to ensure it lands in the right place
    const res = await pool.query(`
      INSERT INTO aeromiles.CLAIM_MISSING_MILES (
        email_member, maskapai, bandara_asal, bandara_tujuan, 
        tanggal_penerbangan, flight_number, nomor_tiket, 
        kelas_kabin, pnr, status_penerimaan, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Menunggu', CURRENT_TIMESTAMP)
      RETURNING *
    `, [
      session.user.email, maskapai, bandara_asal, bandara_tujuan, 
      tanggal_penerbangan, flight_number, nomor_tiket, 
      kelas_kabin, pnr
    ]);

    if (res.rows.length > 0) {
      return NextResponse.json(res.rows[0]);
    } else {
      throw new Error('Gagal menyimpan klaim ke database.');
    }
  } catch (error: any) {
    console.error('Create Claim Error Details:', error);
    const message = error.message || 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
