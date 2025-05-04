// This script creates an admin user
// Run it with: node scripts/create-admin.js

const sqlite3 = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');
const { createId } = require('@paralleldrive/cuid2');

// Define the database file
const dbFile = path.join(__dirname, '..', 'sqlite.db');

// Connect to the database
const db = sqlite3(dbFile);

// Check if admin user already exists
const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@example.com');

if (existingAdmin) {
  console.log('Admin user already exists');
} else {
  // Create a password hash
  const password = 'admin123';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // Insert the admin user
  db.prepare(`
    INSERT INTO users (id, email, name, password, role_id, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    createId(),
    'admin@example.com',
    'Admin User',
    `${salt}:${hash}`,
    '2', // Admin role ID
    1,
    Date.now(),
    Date.now()
  );

  console.log('Admin user created successfully');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

// Close the database connection
db.close();
