import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', (client) => {
  client.query('SET search_path TO aeromiles');
});

export async function executeWithNotices(query: string, params: any[] = []) {
  const client = await pool.connect();
  const notices: string[] = [];

  try {
    client.on('notice', (msg) => {
      if (msg.message) notices.push(msg.message);
    });

    const result = await client.query(query, params);
    return {
      ...result,
      notices: notices
    };
  } finally {
    client.removeAllListeners('notice');
    client.release();
  }
}

export default pool;