import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Set search_path ke schema aeromiles setiap kali dapat koneksi baru
pool.on('connect', (client) => {
  client.query('SET search_path TO aeromiles');
});

export default pool;