import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;

  try {
    const result = await pool.query(`
      SELECT t.*, 
             p1.first_mid_name || ' ' || p1.last_name as nama_pengirim,
             p2.first_mid_name || ' ' || p2.last_name as nama_penerima
      FROM TRANSFER t
      JOIN PENGGUNA p1 ON t.email_member_1 = p1.email
      JOIN PENGGUNA p2 ON t.email_member_2 = p2.email
      WHERE t.email_member_1 = $1 OR t.email_member_2 = $1
      ORDER BY t.timestamp DESC;
    `, [email]);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email_pengirim = session.user.email;
  const { email_penerima, jumlah, catatan } = await req.json();

  if (!email_penerima || !jumlah) {
    return NextResponse.json({ error: 'Email penerima dan jumlah wajib diisi' }, { status: 400 });
  }

  if (email_pengirim === email_penerima) {
    return NextResponse.json({ error: 'Tidak bisa mengirim ke diri sendiri' }, { status: 400 });
  }

  const client = await pool.connect();
  const notices: string[] = [];
  client.on('notice', (msg) => { if (msg.message) notices.push(msg.message); });

  try {
    await client.query(
      'INSERT INTO TRANSFER (email_member_1, email_member_2, timestamp, jumlah, catatan) VALUES ($1, $2, NOW(), $3, $4)',
      [email_pengirim, email_penerima, jumlah, catatan || '']
    );

    return NextResponse.json({ 
      success: true, 
      message: notices[0] || 'Transfer berhasil dicatat.' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    client.release();
  }
}
