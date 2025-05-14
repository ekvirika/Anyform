const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'newpassword',
  port: 5432,
});

async function checkAndCreateDatabase() {
  try {
    await client.connect();
    
    // Check if database exists
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'anyform_dev'"
    );
    
    if (dbCheck.rows.length === 0) {
      console.log('Database does not exist. Creating anyform_dev...');
      await client.query('CREATE DATABASE anyform_dev');
      console.log('✅ Database created successfully!');
    } else {
      console.log('✅ Database anyform_dev already exists');
    }
    
    // Connect to the new database
    await client.end();
    
    const appClient = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'anyform_dev',
      password: 'newpassword',
      port: 5432,
    });
    
    await appClient.connect();
    console.log('✅ Successfully connected to anyform_dev database');
    
    // Check if tables exist
    const tables = await appClient.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\n📋 Existing tables:');
    if (tables.rows.length > 0) {
      tables.rows.forEach(row => console.log(`- ${row.table_name}`));
    } else {
      console.log('No tables found in the database.');
    }
    
    await appClient.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAndCreateDatabase();
