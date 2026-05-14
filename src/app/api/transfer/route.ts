import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DUMMY_TRANSFER } from '@/dummy/transfer';
import { DUMMY_MEMBERS } from '@/dummy/member';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const memberTransfers = DUMMY_TRANSFER.filter(
      t => t.email_member_1 === session.user.email || t.email_member_2 === session.user.email
    );
    return NextResponse.json(memberTransfers);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email_penerima, jumlah } = await req.json();
    
    const sender = DUMMY_MEMBERS.find(m => m.email === session.user.email);
    if (!sender) return NextResponse.json({ error: 'Member tidak ditemukan' }, { status: 404 });

    if (sender.award_miles < jumlah) {
      return NextResponse.json({ error: 'Saldo award miles tidak mencukupi' }, { status: 400 });
    }

    // Mock success
    return NextResponse.json({ success: true, message: 'Transfer berhasil' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
