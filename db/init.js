const { Sequelize } = require('sequelize');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create a new Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    dialectOptions: dbConfig.dialectOptions
  }
);

// Import models
const User = require('./models/User')(sequelize);
const Form = require('./models/Form')(sequelize);

// Define associations
User.hasMany(Form, { foreignKey: 'userId' });
Form.belongsTo(User, { foreignKey: 'userId' });

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
}

// Sync all models
async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');
    return true;
  } catch (error) {
    console.error('❌ Error synchronizing database models:', error);
    return false;
  }
}

// Export the sequelize instance and models
module.exports = {
  sequelize,
  Sequelize,
  User,
  Form,
  testConnection,
  syncModels
};

// If this file is run directly, test the connection and sync models
if (require.main === module) {
  (async () => {
    await testConnection();
    await syncModels();
    process.exit(0);
  })();
}
