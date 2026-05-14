import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Akses ditolak. Halaman ini hanya untuk Staf.' }, { status: 403 });
  }

  try {
    // Ambil maskapai staf
    const stafRes = await pool.query('SELECT kode_maskapai FROM aeromiles.STAF WHERE email = $1', [session.user.email]);
    if (stafRes.rows.length === 0) return NextResponse.json({ error: 'Staf not found' }, { status: 404 });
    const myMaskapai = stafRes.rows[0].kode_maskapai;

    const res = await pool.query(`
      SELECT c.*, m.nama_maskapai, p.first_mid_name, p.last_name
      FROM aeromiles.CLAIM_MISSING_MILES c
      JOIN aeromiles.MASKAPAI m ON c.maskapai = m.kode_maskapai
      JOIN aeromiles.MEMBER mem ON c.email_member = mem.email
      JOIN aeromiles.PENGGUNA p ON mem.email = p.email
      WHERE c.id = $1
    `, [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Claim not found or you do not have permission for this airline' }, { status: 404 });
    }

    const row = res.rows[0];
    row.nama_member = `${row.first_mid_name} ${row.last_name}`;

    return NextResponse.json(row);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Akses ditolak. Halaman ini hanya untuk Staf.' }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;

  if (!['Disetujui', 'Ditolak'].includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
  }

  const client = await pool.connect();
  let triggerNotice = '';
  client.on('notice', (msg) => {
    if (msg.message?.startsWith('SUKSES:')) triggerNotice = msg.message;
  });

  try {
    // Ambil maskapai staf
    const stafRes = await client.query('SELECT kode_maskapai FROM aeromiles.STAF WHERE email = $1', [session.user.email]);
    if (stafRes.rows.length === 0) return NextResponse.json({ error: 'Staf not found' }, { status: 404 });
    const myMaskapai = stafRes.rows[0].kode_maskapai;

    console.log(`[STAF ACTION] Email: ${session.user.email}, Airline: ${myMaskapai}, Claim ID: ${id}`);

    // Pastikan klaim milik maskapai staf
    const checkRes = await client.query('SELECT maskapai FROM aeromiles.CLAIM_MISSING_MILES WHERE id = $1', [id]);
    if (checkRes.rows.length === 0 || checkRes.rows[0].maskapai !== myMaskapai) {
      console.warn(`[STAF SECURITY ALERT] Unauthorized attempt by ${session.user.email} (Airline ${myMaskapai}) to process Claim ID ${id} (Airline ${checkRes.rows[0]?.maskapai})`);
      return NextResponse.json({ error: 'Akses ditolak. Klaim ini bukan milik maskapai Anda.' }, { status: 403 });
    }

    const res = await client.query(`
      UPDATE aeromiles.CLAIM_MISSING_MILES SET
        status_penerimaan = $1,
        email_staf = $2
      WHERE id = $3
      RETURNING *
    `, [status, session.user.email, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      data: res.rows[0],
      message: triggerNotice || (status === 'Disetujui' ? 'Klaim berhasil disetujui.' : 'Klaim telah ditolak.')
    });
  } catch (error) {
    console.error('Staff Update Claim Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
