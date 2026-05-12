import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const data = await request.json();
  const { role, email, password, salutation, namaDepan, namaBelakang, tanggalLahir, kewarganegaraan, countryCode, nomorHp, kodeMaskapai } = data;

  if (!email || !password || !namaDepan || !tanggalLahir) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const checkEmail = await client.query('SELECT email FROM PENGGUNA WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      `INSERT INTO PENGGUNA (email, password, salutation, first_mid_name, last_name, country_code, mobile_number, tanggal_lahir, kewarganegaraan)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [email, hashedPassword, salutation, namaDepan, namaBelakang, countryCode, nomorHp, tanggalLahir, kewarganegaraan]
    );

    if (role === 'member') {
      const lastMember = await client.query('SELECT nomor_member FROM MEMBER ORDER BY nomor_member DESC LIMIT 1');
      let newNomorMember = 'M0001';
      if (lastMember.rows.length > 0 && lastMember.rows[0].nomor_member) {
        const lastNum = parseInt(lastMember.rows[0].nomor_member.substring(1));
        if (!isNaN(lastNum)) {
          newNomorMember = `M${String(lastNum + 1).padStart(4, '0')}`;
        }
      }

      const lowestTier = await client.query('SELECT id_tier FROM TIER ORDER BY minimal_tier_miles ASC LIMIT 1');
      const idTier = lowestTier.rows.length > 0 ? lowestTier.rows[0].id_tier : 1;

      await client.query(
        `INSERT INTO MEMBER (email, nomor_member, tanggal_bergabung, id_tier)
         VALUES ($1, $2, CURRENT_DATE, $3)`,
        [email, newNomorMember, idTier]
      );
    } else if (role === 'staf') {
      if (!kodeMaskapai) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Kode Maskapai wajib diisi untuk Staf' }, { status: 400 });
      }

      const lastStaf = await client.query('SELECT id_staf FROM STAF ORDER BY id_staf DESC LIMIT 1');
      let newIdStaf = 'S0001';
      if (lastStaf.rows.length > 0 && lastStaf.rows[0].id_staf) {
        const lastNum = parseInt(lastStaf.rows[0].id_staf.substring(1));
        if (!isNaN(lastNum)) {
          newIdStaf = `S${String(lastNum + 1).padStart(4, '0')}`;
        }
      }

      await client.query(
        `INSERT INTO STAF (email, id_staf, kode_maskapai)
         VALUES ($1, $2, $3)`,
        [email, newIdStaf, kodeMaskapai]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Registrasi berhasil' }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    const maskapaiResult = await pool.query('SELECT kode_maskapai, nama_maskapai FROM MASKAPAI ORDER BY nama_maskapai');
    return NextResponse.json({ maskapai: maskapaiResult.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching maskapai:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
