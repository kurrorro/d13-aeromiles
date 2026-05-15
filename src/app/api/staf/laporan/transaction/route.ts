import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { tipe, email, ref_1, ref_2, timestamp } = body;

  try {
    if (tipe === 'Transfer') {
      const query = `
        DELETE FROM TRANSFER 
        WHERE email_member_1 = $1 AND email_member_2 = $2 AND timestamp = $3;
      `;
      // In UNION query for Transfer, ref_1 was email_member_1 and ref_2 was email_member_2
      await pool.query(query, [ref_1, ref_2, timestamp]);
      return NextResponse.json({ success: true, message: 'Transaksi transfer berhasil dihapus.' });
    } else if (tipe === 'Redeem') {
      const query = `
        DELETE FROM REDEEM 
        WHERE email_member = $1 AND kode_hadiah = $2 AND timestamp = $3;
      `;
      await pool.query(query, [ref_1, ref_2, timestamp]);
      return NextResponse.json({ success: true, message: 'Transaksi redeem berhasil dihapus.' });
    } else if (tipe === 'Klaim Disetujui') {
      return NextResponse.json({ error: 'Transaksi Klaim Disetujui tidak boleh dihapus.' }, { status: 400 });
    } else if (tipe === 'Pembelian Package') {
      const query = `
        DELETE FROM MEMBER_AWARD_MILES_PACKAGE 
        WHERE email_member = $1 AND id_award_miles_package = $2::int AND timestamp = $3;
      `;
      await pool.query(query, [ref_1, ref_2, timestamp]);
      return NextResponse.json({ success: true, message: 'Transaksi pembelian package berhasil dihapus.' });
    }

    return NextResponse.json({ error: 'Tipe transaksi tidak valid' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
