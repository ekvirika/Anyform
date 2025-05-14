const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const commonPasswords = [
  'postgres',
  'admin',
  'password',
  'root',
  'postgres123',
  'postgresql',
  'postgres1234',
  'postgres1',
  'postgres123!',
  '', // Empty password
];

async function testConnection(password) {
  console.log(`\n🔑 Testing password: ${password || '(empty)'}`);
  
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: password,
    database: 'postgres',
    connectionTimeoutMillis: 2000,
  });

  try {
    await client.connect();
    const result = await client.query('SELECT version()');
    console.log('✅ Success! Connected to PostgreSQL');
    console.log('PostgreSQL Version:', result.rows[0].version);
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message);
    return false;
  } finally {
    await client.end();
  }
}

async function runTests() {
  console.log('🔍 Testing PostgreSQL connection with common passwords...');
  
  for (const password of commonPasswords) {
    const success = await testConnection(password);
    if (success) {
      console.log(`\n🎉 Success! Working password found: ${password || '(empty)'}`);
      process.exit(0);
    }
  }
  
  console.log('\n🔐 None of the common passwords worked.');
  console.log('Please enter your PostgreSQL password manually:');
  
  rl.question('Password: ', async (password) => {
    const success = await testConnection(password);
    if (success) {
      console.log('✅ Great! Update your .env file with this password:');
      console.log(`DB_PASS=${password}`);
    } else {
      console.log('❌ Failed to connect with the provided password.');
      console.log('You may need to reset your PostgreSQL password.');
    }
    rl.close();
  });
}

runTests();
