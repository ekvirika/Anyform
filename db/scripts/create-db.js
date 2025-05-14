require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME || 'anyform_dev';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

async function createDatabase() {
  console.log(`Attempting to connect to PostgreSQL server at ${dbHost}:${dbPort} with user ${dbUser}`);
  
  // Connect to the default 'postgres' database to create a new database
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
    console.log('Authenticating with PostgreSQL server...');
    await sequelize.authenticate();
    console.log('✅ Successfully connected to PostgreSQL server');
    
    // Check if database exists
    const [results] = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    
    if (results.length > 0) {
      console.log(`✅ Database '${dbName}' already exists`);
    } else {
      console.log(`Creating database '${dbName}'...`);
      await sequelize.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.original) {
      console.error('Original error:', error.original);
    }
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
      console.log('Database connection closed');
    }
  }
}

createDatabase();
