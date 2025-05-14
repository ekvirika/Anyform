const { Sequelize } = require('sequelize');

// Use the same config as in database.js
const config = {
  username: 'admin',
  password: 'admin',
  database: 'anyform_dev',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log,
};

async function testConnection() {
  console.log('🔌 Testing database connection with the following settings:');
  console.log(`- Host: ${config.host}:${config.port}`);
  console.log(`- Database: ${config.database}`);
  console.log(`- Username: ${config.username}`);
  
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging,
      dialectOptions: {
        ssl: false
      }
    }
  );

  try {
    console.log('\n🔍 Attempting to connect to the database...');
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully!');
    
    // Check if the database exists and is accessible
    const [results] = await sequelize.query("SELECT current_database(), current_user, version()");
    console.log('\n📊 Database Information:');
    console.log('- Current Database:', results[0].current_database);
    console.log('- Current User:', results[0].current_user);
    console.log('- PostgreSQL Version:', results[0].version.split(' ')[1]);
    
    // List all tables in the database
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\n📋 Tables in the database:');
    if (tables.length > 0) {
      tables.forEach(table => console.log(`- ${table.table_name}`));
    } else {
      console.log('No tables found in the database.');
    }
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    if (error.original) {
      console.error('Original error:', error.original);
    }
  } finally {
    if (sequelize) {
      await sequelize.close();
      console.log('\n🔌 Database connection closed.');
    }
    process.exit();
  }
}

testConnection();
