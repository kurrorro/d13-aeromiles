import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const query = `
    SELECT m.id_tier, t.nama AS nama_tier, m.total_miles, m.award_miles,
           next_t.nama AS tier_berikutnya,
           next_t.minimal_tier_miles AS next_tier_miles,
           GREATEST(0, next_t.minimal_tier_miles - m.total_miles) AS sisa_miles
    FROM MEMBER m
    JOIN TIER t ON m.id_tier = t.id_tier
    LEFT JOIN TIER next_t ON next_t.minimal_tier_miles = (
        SELECT MIN(minimal_tier_miles)
        FROM TIER
        WHERE minimal_tier_miles > m.total_miles
    )
    WHERE m.email = $1;
  `;

  try {
    const result = await pool.query(query, [session.user.email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching member tier info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

