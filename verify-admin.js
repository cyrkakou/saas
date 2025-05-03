const Database = require('better-sqlite3');
const crypto = require('crypto');

console.log('Verifying admin user and audit trail setup...');

// Create or open the database
const db = new Database('sqlite.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    start_date INTEGER NOT NULL,
    end_date INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

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
  console.log('Admin user already exists:');
  console.log('Email:', adminUser.email);
  console.log('Password: admin123 (default)');
}

// Verify audit_logs table
const auditLogsCount = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get();
console.log(`Audit logs table exists with ${auditLogsCount.count} records.`);

// Close the database connection
db.close();

console.log('Verification complete!');
