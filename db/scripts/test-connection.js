require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME || 'anyform_dev';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

console.log('📊 Database Configuration:');
console.log('------------------------');
console.log(`Host: ${dbHost}`);
console.log(`Port: ${dbPort}`);
console.log(`Database: ${dbName}`);
console.log(`User: ${dbUser}`);
console.log(`Password: ${dbPass ? '*****' : 'Not set'}`);
console.log('------------------------\n');

async function testConnection() {
  console.log('🔌 Testing database connection...');
  
  // First, try to connect to the default 'postgres' database
  const sequelize = new Sequelize('postgres', dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: false
    }
  });

  try {
    // Test connection to PostgreSQL server
    console.log('🔍 Connecting to PostgreSQL server...');
    await sequelize.authenticate();
    console.log('✅ Successfully connected to PostgreSQL server');
    
    // Check if our database exists
    console.log('\n🔍 Checking if database exists...');
    const [results] = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    
    if (results.length > 0) {
      console.log(`✅ Database '${dbName}' exists`);
      
      // Now connect to the actual database
      await sequelize.close();
      const appSequelize = new Sequelize(dbName, dbUser, dbPass, {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
        logging: console.log,
        dialectOptions: {
          ssl: false
        }
      });
      
      try {
        await appSequelize.authenticate();
        console.log(`✅ Successfully connected to database '${dbName}'`);
        
        // List all tables in the database
        const [tables] = await appSequelize.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        );
        
        console.log('\n📋 Database tables:');
        console.log('------------------');
        if (tables.length > 0) {
          tables.forEach(table => console.log(`- ${table.table_name}`));
        } else {
          console.log('No tables found in the database');
        }
      } catch (dbError) {
        console.error(`❌ Error connecting to database '${dbName}':`, dbError.message);
      } finally {
        if (appSequelize) await appSequelize.close();
      }
    } else {
      console.log(`ℹ️ Database '${dbName}' does not exist`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    if (error.original) {
      console.error('Original error:', error.original);
    }
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testConnection();
