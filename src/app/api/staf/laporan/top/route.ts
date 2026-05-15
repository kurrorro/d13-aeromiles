import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'miles';

  try {
    if (category === 'miles') {
      // Call stored procedure and catch notice
      const client = await pool.connect();
      let noticeMessage = '';
      client.on('notice', (msg) => {
        if (msg.message.includes('SUKSES')) {
          noticeMessage = msg.message;
        }
      });

      try {
        const result = await client.query('SELECT * FROM fn_top5_member_by_miles()');
        return NextResponse.json({ 
          data: result.rows, 
          message: noticeMessage 
        });
      } finally {
        client.release();
      }
    } else if (category === 'transfer') {
      const query = `
        SELECT p.first_mid_name || ' ' || p.last_name AS nama,
               t.email_member_1 AS email,
               COUNT(*) AS frekuensi,
               SUM(t.jumlah) AS total_miles
        FROM TRANSFER t
        JOIN PENGGUNA p ON t.email_member_1 = p.email
        GROUP BY t.email_member_1, nama
        ORDER BY frekuensi DESC
        LIMIT 5;
      `;
      const result = await pool.query(query);
      return NextResponse.json({ data: result.rows });
    } else if (category === 'redeem') {
      const query = `
        SELECT p.first_mid_name || ' ' || p.last_name AS nama,
               r.email_member AS email,
               COUNT(*) AS frekuensi,
               SUM(h.miles) AS total_miles
        FROM REDEEM r
        JOIN HADIAH h ON r.kode_hadiah = h.kode_hadiah
        JOIN PENGGUNA p ON r.email_member = p.email
        GROUP BY r.email_member, nama
        ORDER BY frekuensi DESC
        LIMIT 5;
      `;
      const result = await pool.query(query);
      return NextResponse.json({ data: result.rows });
    }

    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching top members:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
