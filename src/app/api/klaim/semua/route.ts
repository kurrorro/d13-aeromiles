import { NextResponse } from 'next/server';
import { DUMMY_KLAIM } from '@/dummy/klaim';

export async function GET() {
  return NextResponse.json(DUMMY_KLAIM);
}
