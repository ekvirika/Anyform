require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const dbConfig = require('./database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Initialize Sequelize with configuration
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    ...(config.dialectOptions && { dialectOptions: config.dialectOptions })
  }
);

// Import models
const User = require('./models/User')(sequelize);
const Form = require('./models/Form')(sequelize);

// Set up associations
User.hasMany(Form, { foreignKey: 'userId' });
Form.belongsTo(User, { foreignKey: 'userId' });

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Sync all models
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  User,
  Form,
  testConnection,
  syncModels
};
