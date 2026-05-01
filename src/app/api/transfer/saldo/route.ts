import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DUMMY_MEMBERS } from '@/dummy/member';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const member = DUMMY_MEMBERS.find(m => m.email === session.user.email);
    
    // Default dummy saldo jika tidak ditemukan adalah 0
    return NextResponse.json({ saldo: member?.award_miles || 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
