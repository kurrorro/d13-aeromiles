import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/klaim/[id]  — detail satu klaim
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const result = await pool.query(
      `SELECT
         c.id,
         c.email_member,
         c.email_staf,
         c.maskapai,
         mk.nama_maskapai,
         c.bandara_asal,
         c.bandara_tujuan,
         c.tanggal_penerbangan,
         c.flight_number,
         c.nomor_tiket,
         c.kelas_kabin,
         c.pnr,
         c.status_penerimaan,
         c.timestamp
       FROM claim_missing_miles c
       LEFT JOIN maskapai mk ON c.maskapai = mk.kode_maskapai
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Klaim tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('GET /api/klaim/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// PATCH /api/klaim/[id]  — update klaim (member: edit data; staf: update status)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Cek apakah ini update status oleh staf
    if (body.status_penerimaan !== undefined) {
      const result = await pool.query(
        `UPDATE claim_missing_miles
         SET status_penerimaan = $1, email_staf = $2
         WHERE id = $3 AND status_penerimaan = 'Menunggu'
         RETURNING id`,
        [body.status_penerimaan, session.user.email, id]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Klaim tidak ditemukan atau sudah diproses' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    // Update data klaim oleh member (hanya yang Menunggu milik sendiri)
    const {
      maskapai, bandara_asal, bandara_tujuan,
      tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr,
    } = body;

    const result = await pool.query(
      `UPDATE claim_missing_miles
       SET maskapai = $1, bandara_asal = $2, bandara_tujuan = $3,
           tanggal_penerbangan = $4, flight_number = $5, nomor_tiket = $6,
           kelas_kabin = $7, pnr = $8
       WHERE id = $9 AND email_member = $10 AND status_penerimaan = 'Menunggu'
       RETURNING id`,
      [maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan,
       flight_number, nomor_tiket, kelas_kabin, pnr, id, session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Klaim tidak ditemukan atau tidak dapat diedit' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/klaim/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// DELETE /api/klaim/[id]  — batalkan klaim (hanya yang Menunggu milik sendiri)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM claim_missing_miles
       WHERE id = $1 AND email_member = $2 AND status_penerimaan = 'Menunggu'
       RETURNING id`,
      [id, session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Klaim tidak ditemukan atau tidak dapat dibatalkan' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/klaim/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
