require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'anyform_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    models: [path.join(__dirname, 'models')],
    migrations: [path.join(__dirname, 'migrations')],
    seeders: [path.join(__dirname, 'seeders')]
  },
  test: {
    username: process.env.DB_TEST_USER || 'postgres',
    password: process.env.DB_TEST_PASS || 'postgres',
    database: process.env.DB_TEST_NAME || 'anyform_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    models: [path.join(__dirname, 'models')],
    migrations: [path.join(__dirname, 'migrations')],
    seeders: [path.join(__dirname, 'seeders')]
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    models: [path.join(__dirname, 'models')],
    migrations: [path.join(__dirname, 'migrations')],
    seeders: [path.join(__dirname, 'seeders')],
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
