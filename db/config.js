require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'newpassword',
    database: 'anyform_dev',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true
    },
    dialectOptions: {
      ssl: false
    }
  },
  test: {
    username: 'postgres',
    password: 'newpassword',
    database: 'anyform_test',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: false
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
