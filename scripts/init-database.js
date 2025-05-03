// This script initializes the database
// Run it with: node scripts/init-database.js

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the database directory and file
const dbDir = path.join(__dirname, '..', '.db');
const dbFile = path.join(dbDir, 'sqlite.db');

// Create an empty database file if it doesn't exist
if (!fs.existsSync(dbFile)) {
  console.log('Creating empty database file...');
  fs.writeFileSync(dbFile, '');
}

// Create the database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
}

// Run the database migration
console.log('Running database migration...');
try {
  execSync('npx drizzle-kit push:sqlite', { stdio: 'inherit' });
  console.log('Database migration completed successfully');
} catch (error) {
  console.error('Database migration failed:', error);
  process.exit(1);
}

// Create a default admin user
console.log('Skipping admin user creation for now...');
console.log('To create an admin user, you can use the API or implement a proper user creation script.');

// Verify the database file exists
if (fs.existsSync(dbFile)) {
  console.log('Database file created successfully at:', dbFile);
} else {
  console.error('Failed to create database file:', dbFile);
  process.exit(1);
}

console.log('Database initialization completed successfully');
