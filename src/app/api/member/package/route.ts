import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import pool from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT id, harga_paket, jumlah_award_miles
        FROM aeromiles.AWARD_MILES_PACKAGE
        ORDER BY harga_paket;
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
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email_member = session.user?.email;
  const { id_award_miles_package } = await req.json();

  if (!id_award_miles_package) {
    return NextResponse.json({ error: 'id_award_miles_package is required' }, { status: 400 });
  }

  const client = await pool.connect();
  let triggerNotice = '';

  client.on('notice', (msg) => {
    if (msg.message?.startsWith('SUKSES:')) triggerNotice = msg.message;
  });

  try {
    await client.query(
      'INSERT INTO aeromiles.MEMBER_AWARD_MILES_PACKAGE (id_award_miles_package, email_member, timestamp) VALUES ($1, $2, NOW())',
      [id_award_miles_package, email_member]
    );
    return NextResponse.json({ 
      success: true, 
      message: triggerNotice || 'Pembelian package berhasil. Award miles Anda telah ditambahkan.' 
    });
  } catch (err: any) {
    console.error('Purchase Package Error:', err);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Gagal memproses pembelian package.' 
    }, { status: 400 });
  } finally {
    client.release();
  }
}
