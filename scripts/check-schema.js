// This script checks the database schema
// Run it with: node scripts/check-schema.js

const sqlite3 = require('better-sqlite3');
const path = require('path');

// Define the database file
const dbFile = path.join(__dirname, '..', 'sqlite.db');

// Connect to the database
const db = sqlite3(dbFile);

// Get the schema
const tables = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
`).all();

console.log('Tables in the database:');
tables.forEach(table => {
  console.log(`\nTable: ${table.name}`);
  const columns = db.prepare(`PRAGMA table_info(${table.name});`).all();
  columns.forEach(column => {
    console.log(`  ${column.name} (${column.type})${column.pk ? ' PRIMARY KEY' : ''}${column.notnull ? ' NOT NULL' : ''}`);
  });
});

// Check if the users table has a role_id column
const usersTable = db.prepare(`PRAGMA table_info(users);`).all();
const roleIdColumn = usersTable.find(column => column.name === 'role_id');
if (roleIdColumn) {
  console.log('\nThe users table has a role_id column, which is good for referential integrity.');
} else {
  console.log('\nWARNING: The users table does not have a role_id column. This should be fixed.');
}

// Check if passwords are stored securely
const users = db.prepare(`SELECT email, password FROM users LIMIT 5;`).all();
console.log('\nPassword storage check:');
users.forEach(user => {
  console.log(`  ${user.email}: ${user.password.substring(0, 20)}...`);
  if (user.password.includes(':') && user.password.length > 40) {
    console.log('    ✓ Password appears to be stored as a salted hash (good)');
  } else {
    console.log('    ✗ Password may not be properly hashed and salted (bad)');
  }
});

// Close the database connection
db.close();
