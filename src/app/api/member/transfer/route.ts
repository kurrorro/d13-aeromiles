import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { recipientEmail, amount, note } = body;
  const senderEmail = session.user.email;

  if (recipientEmail === senderEmail) {
    return NextResponse.json({ error: 'Anda tidak dapat mengirim miles ke diri sendiri.' }, { status: 400 });
  }

  if (amount <= 0) {
    return NextResponse.json({ error: 'Jumlah miles harus lebih dari 0.' }, { status: 400 });
  }

  const client = await pool.connect();
  let triggerNotice = '';
  client.on('notice', (msg) => {
    if (msg.message?.startsWith('SUKSES:')) triggerNotice = msg.message;
  });

  try {
    // The trigger trg_update_miles_transfer will handle the award_miles updates and balance check
    await client.query(`
      INSERT INTO TRANSFER (email_member_1, email_member_2, timestamp, jumlah, catatan)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
    `, [senderEmail, recipientEmail, amount, note]);

    return NextResponse.json({ 
      message: triggerNotice || 'Transfer berhasil dicatat.' 
    });
  } catch (error: any) {
    console.error('Transfer Error:', error);
    const message = error.message || 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 400 });
  } finally {
    client.release();
  }
}
