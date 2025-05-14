const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('anyform_dev', 'postgres', 'newpassword', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true
  }
});

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'db', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .sort();

  console.log(`Found ${migrationFiles.length} migration files`);

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // Create SequelizeMeta table if it doesn't exist
    await sequelize.getQueryInterface().createTable('SequelizeMeta', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      }
    });
    console.log('✅ Created SequelizeMeta table');

    // Get already executed migrations
    const [executedMigrations] = await sequelize.query(
      'SELECT name FROM "SequelizeMeta"',
      { type: sequelize.QueryTypes.SELECT }
    );

    const executedNames = executedMigrations.map(m => m.name);
    const pendingMigrations = migrationFiles.filter(
      file => !executedNames.includes(file.replace('.js', ''))
    );

    console.log(`\n📊 Migration status:`);
    console.log(`- Total migrations: ${migrationFiles.length}`);
    console.log(`- Already executed: ${executedNames.length}`);
    console.log(`- Pending: ${pendingMigrations.length}`);

    if (pendingMigrations.length === 0) {
      console.log('\n✅ Database is up to date');
      return;
    }

    // Run pending migrations
    for (const file of pendingMigrations) {
      console.log(`\n🔄 Running migration: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      
      try {
        await sequelize.transaction(async (t) => {
          await migration.up(sequelize.getQueryInterface(), Sequelize, { transaction: t });
          await sequelize.query(
            'INSERT INTO "SequelizeMeta" (name) VALUES ($1)',
            { bind: [file.replace('.js', '')], transaction: t }
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
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations();
