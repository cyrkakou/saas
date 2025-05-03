const { Database } = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create the database file if it doesn't exist
const dbPath = path.join(__dirname, '..', 'sqlite.db');
console.log(`Setting up admin user and audit trail in database at ${dbPath}`);

// Create the database
const db = new Database(dbPath);

// Create the audit_logs table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`);

// Check if admin user already exists
const adminUser = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');

if (!adminUser) {
  // Create default admin user
  const now = Date.now();
  const userId = crypto.randomUUID();
  
  db.prepare(`
    INSERT INTO users (id, email, name, password, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    'admin@example.com',
    'Admin User',
    'admin123', // In a production environment, this should be hashed
    'admin',
    now,
    now
  );
  
  // Log the admin user creation in audit trail
  const logId = crypto.randomUUID();
  
  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    logId,
    userId,
    'CREATE',
    'USER',
    userId,
    JSON.stringify({ message: 'Default admin user created during setup' }),
    now
  );
  
  console.log('Default admin user created successfully:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
} else {
  console.log('Admin user already exists, skipping creation.');
}

console.log('Audit trail table created successfully!');

// Close the database connection
db.close();
