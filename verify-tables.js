const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'anyform_dev',
  password: 'newpassword',
  port: 5432,
});

async function verifyTables() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('\n📋 Database tables:');
    console.table(tables.rows);

    // Check users table structure
    const usersColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
    `);
    
    console.log('\n👥 Users table columns:');
    console.table(usersColumns.rows);

    // Check forms table structure
    const formsColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'forms'
    `);
    
    console.log('\n📝 Forms table columns:');
    console.table(formsColumns.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyTables();
