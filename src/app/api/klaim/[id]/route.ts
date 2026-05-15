import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await pool.query(`
      SELECT c.*, m.nama_maskapai, b1.nama as nama_asal, b2.nama as nama_tujuan
      FROM aeromiles.CLAIM_MISSING_MILES c
      JOIN aeromiles.MASKAPAI m ON c.maskapai = m.kode_maskapai
      JOIN aeromiles.BANDARA b1 ON c.bandara_asal = b1.iata_code
      JOIN aeromiles.BANDARA b2 ON c.bandara_tujuan = b2.iata_code
      WHERE c.id = $1
    `, [id]);

    if (res.rows.length === 0) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
