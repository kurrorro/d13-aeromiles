import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
      WHERE c.id = $1 AND c.email_member = $2
    `, [params.id, session.user.email]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
    // Check status first
    const statusCheck = await pool.query(
      'SELECT status_penerimaan FROM CLAIM_MISSING_MILES WHERE id = $1 AND email_member = $2',
      [params.id, session.user.email]
    );

    if (statusCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    if (statusCheck.rows[0].status_penerimaan !== 'Menunggu') {
      return NextResponse.json({ error: 'Hanya klaim berstatus Menunggu yang dapat diubah.' }, { status: 400 });
    }

    const res = await pool.query(`
      UPDATE CLAIM_MISSING_MILES SET
        maskapai = $1, bandara_asal = $2, bandara_tujuan = $3, 
        tanggal_penerbangan = $4, flight_number = $5, nomor_tiket = $6, 
        kelas_kabin = $7, pnr = $8
      WHERE id = $9 AND email_member = $10
      RETURNING *
    `, [
      maskapai, bandara_asal, bandara_tujuan, 
      tanggal_penerbangan, flight_number, nomor_tiket, 
      kelas_kabin, pnr, params.id, session.user.email
    ]);

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const statusCheck = await pool.query(
      'SELECT status_penerimaan FROM CLAIM_MISSING_MILES WHERE id = $1 AND email_member = $2',
      [params.id, session.user.email]
    );

    if (statusCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    if (statusCheck.rows[0].status_penerimaan !== 'Menunggu') {
      return NextResponse.json({ error: 'Hanya klaim berstatus Menunggu yang dapat dibatalkan.' }, { status: 400 });
    }

    await pool.query('DELETE FROM CLAIM_MISSING_MILES WHERE id = $1 AND email_member = $2', [params.id, session.user.email]);
    return NextResponse.json({ message: 'Claim cancelled successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
