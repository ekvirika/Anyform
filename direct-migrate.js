const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'anyform_dev',
  password: 'newpassword',
  port: 5432,
});

const migrationsDir = path.join(__dirname, 'db', 'migrations');

async function runMigrations() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create users table
    console.log('\n🔄 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Created users table');

    // Create forms table
    console.log('\n🔄 Creating forms table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS forms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Created forms table');

    console.log('\n✨ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
  } finally {
    await client.end();
  }
}

runMigrations();
