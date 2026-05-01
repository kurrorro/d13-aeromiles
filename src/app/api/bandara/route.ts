import { NextResponse } from 'next/server';
import { DUMMY_BANDARA, DUMMY_MASKAPAI } from '@/dummy/bandara';

export async function GET() {
  return NextResponse.json({
    bandara: DUMMY_BANDARA,
    maskapai: DUMMY_MASKAPAI,
  });
}
