import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';

export async function GET() {
  const session = await getServerSession();
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT h.kode_hadiah, h.nama, h.miles, h.deskripsi,
               h.valid_start_date, h.program_end,
               COALESCE(ma.nama_maskapai, mi.nama_mitra) AS nama_penyedia
        FROM HADIAH h
        LEFT JOIN MASKAPAI ma ON h.id_penyedia = ma.id_penyedia
        LEFT JOIN MITRA mi ON h.id_penyedia = mi.id_penyedia
        WHERE h.program_end >= CURRENT_DATE
        ORDER BY h.miles;
      `);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email_member = session.user?.email;
  const { kode_hadiah } = await req.json();

  if (!kode_hadiah) {
    return NextResponse.json({ error: 'kode_hadiah is required' }, { status: 400 });
  }

  const client = await pool.connect();
  const notices: string[] = [];

  client.on('notice', (msg) => {
    if (msg.message) notices.push(msg.message);
  });

  try {
    await client.query(
      'INSERT INTO REDEEM (email_member, kode_hadiah, timestamp) VALUES ($1, $2, NOW())',
      [email_member, kode_hadiah]
    );
    return NextResponse.json({ success: true, message: notices[0] ?? 'Redeem berhasil.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  } finally {
    client.release();
  }
}
