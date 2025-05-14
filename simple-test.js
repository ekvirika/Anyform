const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'newpassword',
  port: 5432,
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL!');
    const res = await client.query('SELECT version()');
    console.log('PostgreSQL version:', res.rows[0].version);
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  } finally {
    await client.end();
  }
}

test();
