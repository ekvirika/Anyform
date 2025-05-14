require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const dbName = process.env.DB_NAME || 'anyform_dev';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

console.log('🚀 Running database migrations...');
console.log('-------------------------------');
console.log(`Database: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
console.log('-------------------------------\n');

async function runMigrations() {
  // Connect to the database
  const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: false
    }
  });

  try {
    // Authenticate the connection
    console.log('🔐 Authenticating with database...');
    await sequelize.authenticate();
    console.log('✅ Successfully connected to the database');

    // Create SequelizeMeta table if it doesn't exist
    console.log('\n📋 Checking for migrations table...');
    const [results] = await sequelize.query(
      `SELECT to_regclass('public.\"SequelizeMeta\"') as table_exists`
    );
    
    if (!results[0].table_exists) {
      console.log('ℹ️ Creating SequelizeMeta table...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS public.\"SequelizeMeta\" (
          \"name\" VARCHAR(255) NOT NULL,
          PRIMARY KEY (\"name\"),
          CONSTRAINT \"name\" UNIQUE (\"name\")
        );
      `);
      console.log('✅ Created SequelizeMeta table');
    } else {
      console.log('✅ SequelizeMeta table already exists');
    }

    // Get all migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .sort();

    console.log(`\n🔍 Found ${migrationFiles.length} migration files`);
    
    if (migrationFiles.length === 0) {
      console.log('No migration files found. Exiting...');
      return;
    }

    // Get already executed migrations
    const [executedMigrations] = await sequelize.query(
      'SELECT \"name\" FROM public.\"SequelizeMeta\"',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const executedMigrationNames = executedMigrations.map(m => m.name);
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrationNames.includes(file.replace('.js', ''))
    );

    console.log(`\n📊 Migration status:`);
    console.log(`- Total migrations: ${migrationFiles.length}`);
    console.log(`- Already executed: ${executedMigrations.length}`);
    console.log(`- Pending: ${pendingMigrations.length}`);

    if (pendingMigrations.length === 0) {
      console.log('\n✅ Database is up to date');
      return;
    }

    // Run pending migrations
    console.log('\n🚀 Running pending migrations...');
    for (const file of pendingMigrations) {
      const migration = require(path.join(migrationsDir, file));
      console.log(`\n🔄 Running migration: ${file}`);
      
      try {
        await sequelize.transaction(async (transaction) => {
          await migration.up(sequelize.getQueryInterface(), Sequelize, { transaction });
          await sequelize.query(
            'INSERT INTO public.\"SequelizeMeta\" (\"name\") VALUES ($1)',
            { bind: [file.replace('.js', '')], transaction }
          );
          console.log(`✅ Successfully applied migration: ${file}`);
        });
      } catch (error) {
        console.error(`❌ Error running migration ${file}:`, error.message);
        throw error;
      }
    }

    console.log('\n✨ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
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

runMigrations();
