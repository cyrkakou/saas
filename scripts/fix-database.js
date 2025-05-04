// This script fixes the database schema and data
// Run it with: node scripts/fix-database.js

const sqlite3 = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

// Define the database file
const dbFile = path.join(__dirname, '..', 'sqlite.db');

// Connect to the database
const db = sqlite3(dbFile);

console.log('Starting database fixes...');

// Begin a transaction
db.prepare('BEGIN TRANSACTION').run();

try {
  // 1. Add role_id column to users table
  console.log('Adding role_id column to users table...');
  db.prepare('ALTER TABLE users ADD COLUMN role_id TEXT REFERENCES roles(id)').run();

  // 2. Update role_id based on role value
  console.log('Updating role_id values...');
  const users = db.prepare('SELECT id, role FROM users').all();
  const roles = db.prepare('SELECT id, name FROM roles').all();
  
  const roleMap = {};
  roles.forEach(role => {
    roleMap[role.name] = role.id;
  });
  
  users.forEach(user => {
    const roleId = roleMap[user.role] || roleMap['user']; // Default to 'user' if role not found
    db.prepare('UPDATE users SET role_id = ? WHERE id = ?').run(roleId, user.id);
  });

  // 3. Hash passwords
  console.log('Hashing passwords...');
  const usersToUpdate = db.prepare('SELECT id, password FROM users').all();
  
  usersToUpdate.forEach(user => {
    // Skip if password is already hashed (contains a colon)
    if (user.password.includes(':') && user.password.length > 40) {
      console.log(`  Password for user ${user.id} already appears to be hashed, skipping.`);
      return;
    }
    
    // Hash the password
    const password = user.password;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword = `${salt}:${hash}`;
    
    // Update the user's password
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user.id);
    console.log(`  Password for user ${user.id} has been hashed.`);
  });

  // 4. Create a new users table with the correct schema (optional, only if needed)
  // This step is commented out because it's more complex and risky
  // If you want to completely rebuild the users table with the correct schema,
  // you would need to:
  // 1. Create a new table with the correct schema
  // 2. Copy data from the old table to the new table
  // 3. Drop the old table
  // 4. Rename the new table to the old table name

  // Commit the transaction
  db.prepare('COMMIT').run();
  console.log('Database fixes completed successfully.');
} catch (error) {
  // Rollback the transaction if there's an error
  db.prepare('ROLLBACK').run();
  console.error('Error fixing database:', error);
}

// Close the database connection
db.close();
