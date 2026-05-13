import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;
  const isStaf = session.user.role === 'staf';

  try {
    let profileQuery = '';
    if (isStaf) {
      profileQuery = `
        SELECT p.*, s.id_staf, s.kode_maskapai, m.nama_maskapai
        FROM PENGGUNA p 
        JOIN STAF s ON p.email = s.email
        LEFT JOIN MASKAPAI m ON s.kode_maskapai = m.kode_maskapai
        WHERE p.email = $1
      `;
    } else {
      profileQuery = `
        SELECT p.*, m.nomor_member, m.tanggal_bergabung, m.id_tier, t.nama as nama_tier,
               m.award_miles, m.total_miles
        FROM PENGGUNA p 
        JOIN MEMBER m ON p.email = m.email
        LEFT JOIN TIER t ON m.id_tier = t.id_tier
        WHERE p.email = $1
      `;
    }

    const { rows } = await pool.query(profileQuery, [email]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    let maskapaiList = [];
    if (isStaf) {
      const maskapaiResult = await pool.query('SELECT kode_maskapai, nama_maskapai FROM MASKAPAI ORDER BY nama_maskapai');
      maskapaiList = maskapaiResult.rows;
    }

    const profile = rows[0];
    if (profile.tanggal_lahir) {
        const date = new Date(profile.tanggal_lahir);
        profile.tanggal_lahir = date.toISOString().split('T')[0];
    }
    if (profile.tanggal_bergabung) {
        const date = new Date(profile.tanggal_bergabung);
        profile.tanggal_bergabung = date.toISOString().split('T')[0];
    }

    return NextResponse.json({ profile, maskapaiList }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = session.user.email;
  const isStaf = session.user.role === 'staf';
  const data = await request.json();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (data.action === 'UPDATE_PASSWORD') {
      const { oldPassword, newPassword } = data;
      
      const userRes = await client.query('SELECT password FROM PENGGUNA WHERE email = $1', [email]);
      if (userRes.rows.length === 0) throw new Error('User not found');
      
      const isMatch = await bcrypt.compare(oldPassword, userRes.rows[0].password);
      if (!isMatch) {
         await client.query('ROLLBACK');
         return NextResponse.json({ error: 'Password lama salah' }, { status: 400 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await client.query('UPDATE PENGGUNA SET password = $1 WHERE email = $2', [hashedNewPassword, email]);

    } else {
      const { salutation, first_mid_name, last_name, country_code, mobile_number, tanggal_lahir, kewarganegaraan, kode_maskapai } = data;

      await client.query(`
        UPDATE PENGGUNA
        SET salutation = $1, first_mid_name = $2, last_name = $3,
            country_code = $4, mobile_number = $5, 
            tanggal_lahir = $6, kewarganegaraan = $7
        WHERE email = $8
      `, [salutation, first_mid_name, last_name, country_code, mobile_number, tanggal_lahir, kewarganegaraan, email]);

      if (isStaf && kode_maskapai) {
        await client.query('UPDATE STAF SET kode_maskapai = $1 WHERE email = $2', [kode_maskapai, email]);
      }
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
