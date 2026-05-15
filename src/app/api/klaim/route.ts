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
      FROM aeromiles.CLAIM_MISSING_MILES c
      JOIN aeromiles.MASKAPAI m ON c.maskapai = m.kode_maskapai
      JOIN aeromiles.BANDARA b1 ON c.bandara_asal = b1.iata_code
      JOIN aeromiles.BANDARA b2 ON c.bandara_tujuan = b2.iata_code
      WHERE c.email_member = $1
      ORDER BY c.timestamp DESC
    `, [session.user.email]);

    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data klaim' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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

    const { executeWithNotices } = await import('@/lib/db');
    const res = await executeWithNotices(`
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
      const triggerNotice = res.notices.find(n => n.startsWith('SUKSES:'));
      return NextResponse.json({
        ...res.rows[0],
        message: triggerNotice || 'Klaim berhasil disimpan.'
      });
    } else {
      throw new Error('Gagal menyimpan klaim ke database.');
    }
  } catch (error: any) {
    console.error('Create Claim Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 400 });
  }
}

