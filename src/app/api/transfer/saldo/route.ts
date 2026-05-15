import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await pool.query(`
      SELECT m.award_miles as saldo
      FROM aeromiles.MEMBER m
      WHERE m.email = $1
    `, [session.user.email]);

    if (res.rows.length === 0) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    return NextResponse.json({ saldo: res.rows[0].saldo });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
