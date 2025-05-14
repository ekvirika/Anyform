const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up database...');

try {
  // Create database
  console.log('Creating database...');
  execSync('node db/scripts/create-db.js', { stdio: 'inherit' });

  // Run migrations
  console.log('\nRunning migrations...');
  execSync('node node_modules/.bin/sequelize db:migrate --config=db/config.js', { stdio: 'inherit' });

  console.log('\n✅ Database setup completed successfully!');
} catch (error) {
  console.error('\n❌ Error setting up database:', error.message);
  process.exit(1);
}
