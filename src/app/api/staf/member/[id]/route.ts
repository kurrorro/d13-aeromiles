import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const nomorMember = id;

  try {
    const query = `
      SELECT m.nomor_member, m.id_tier, m.award_miles, m.total_miles, m.tanggal_bergabung,
             p.email, p.salutation, p.first_mid_name, p.last_name, p.country_code, 
             p.mobile_number, p.kewarganegaraan, 
             TO_CHAR(p.tanggal_lahir, 'YYYY-MM-DD') AS tanggal_lahir
      FROM MEMBER m JOIN PENGGUNA p ON m.email = p.email
      WHERE m.nomor_member = $1
    `;
    const { rows } = await pool.query(query, [nomorMember]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const nomorMember = id;
  const data = await request.json();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const memberRes = await client.query('SELECT email FROM MEMBER WHERE nomor_member = $1', [nomorMember]);
    if (memberRes.rows.length === 0) throw new Error('Member not found');
    const email = memberRes.rows[0].email;

    const {
      salutation, first_mid_name, last_name, country_code, mobile_number,
      tanggal_lahir, kewarganegaraan, id_tier
    } = data;

    await client.query(`
      UPDATE PENGGUNA
      SET salutation = $1, first_mid_name = $2, last_name = $3,
          country_code = $4, mobile_number = $5,
          tanggal_lahir = $6, kewarganegaraan = $7
      WHERE email = $8
    `, [salutation, first_mid_name, last_name, country_code, mobile_number, tanggal_lahir, kewarganegaraan, email]);

    if (id_tier) {
      await client.query('UPDATE MEMBER SET id_tier = $1 WHERE email = $2', [id_tier, email]);
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Update successful' }, { status: 200 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'staf') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const nomorMember = id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const memberRes = await client.query('SELECT email FROM MEMBER WHERE nomor_member = $1', [nomorMember]);
    if (memberRes.rows.length === 0) throw new Error('Member not found');
    const email = memberRes.rows[0].email;

    await client.query('DELETE FROM MEMBER WHERE email = $1', [email]);
    await client.query('DELETE FROM PENGGUNA WHERE email = $1', [email]);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Member deleted successfully' }, { status: 200 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
