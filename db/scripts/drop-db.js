require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME || 'anyform_dev';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

async function dropDatabase() {
  console.log(`Attempting to connect to PostgreSQL server at ${dbHost}:${dbPort} with user ${dbUser}`);
  
  // Connect to the default 'postgres' database to drop the target database
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
    
    if (results.length === 0) {
      console.log(`ℹ️ Database '${dbName}' does not exist`);
    } else {
      console.log(`Dropping database '${dbName}'...`);
      // Terminate all connections to the database before dropping it
      await sequelize.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${dbName}'
        AND pid <> pg_backend_pid();
      `);
      
      await sequelize.query(`DROP DATABASE IF EXISTS ${dbName}`);
      console.log(`✅ Database '${dbName}' dropped successfully`);
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

dropDatabase();
