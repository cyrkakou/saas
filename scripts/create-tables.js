// This script creates the database tables
// Run it with: node scripts/create-tables.js

const sqlite3 = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Define the database file
const dbFile = path.join(__dirname, '..', 'sqlite.db');

// Create the database file if it doesn't exist
if (!fs.existsSync(dbFile)) {
  console.log('Creating database file...');
  fs.writeFileSync(dbFile, '');
}

// Connect to the database
const db = sqlite3(dbFile);

console.log('Creating tables...');

// Create the roles table
db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )
`);

// Create the permissions table
db.exec(`
  CREATE TABLE IF NOT EXISTS permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at INTEGER,
    updated_at INTEGER
  )
`);

// Create the role_permissions junction table
db.exec(`
  CREATE TABLE IF NOT EXISTS role_permissions (
    role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
  )
`);

// Create the organizations table
db.exec(`
  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    logo TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )
`);

// Create the users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    password TEXT NOT NULL,
    role_id TEXT,
    organization_id TEXT,
    is_active INTEGER DEFAULT 1,
    last_login INTEGER,
    created_at INTEGER,
    updated_at INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  )
`);

// Create the subscriptions table
db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    start_date INTEGER,
    end_date INTEGER,
    created_at INTEGER,
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Create the audit_logs table
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )
`);

// Create the reports table
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    config TEXT,
    created_by_id TEXT,
    organization_id TEXT,
    is_public INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
  )
`);

// Create the settings table
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    is_public INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  )
`);

// Insert default roles
db.exec(`
  INSERT OR IGNORE INTO roles (id, name, description, created_at, updated_at)
  VALUES 
    ('1', 'user', 'Regular user with limited permissions', unixepoch(), unixepoch()),
    ('2', 'admin', 'Administrator with full access', unixepoch(), unixepoch())
`);

// Insert default permissions
db.exec(`
  INSERT OR IGNORE INTO permissions (id, name, description, resource, action, created_at, updated_at)
  VALUES 
    ('1', 'read:users', 'Read user information', 'users', 'read', unixepoch(), unixepoch()),
    ('2', 'create:users', 'Create new users', 'users', 'create', unixepoch(), unixepoch()),
    ('3', 'update:users', 'Update user information', 'users', 'update', unixepoch(), unixepoch()),
    ('4', 'delete:users', 'Delete users', 'users', 'delete', unixepoch(), unixepoch()),
    ('5', 'read:reports', 'Read reports', 'reports', 'read', unixepoch(), unixepoch()),
    ('6', 'create:reports', 'Create new reports', 'reports', 'create', unixepoch(), unixepoch()),
    ('7', 'update:reports', 'Update reports', 'reports', 'update', unixepoch(), unixepoch()),
    ('8', 'delete:reports', 'Delete reports', 'reports', 'delete', unixepoch(), unixepoch()),
    ('9', 'read:organizations', 'Read organization information', 'organizations', 'read', unixepoch(), unixepoch()),
    ('10', 'create:organizations', 'Create new organizations', 'organizations', 'create', unixepoch(), unixepoch()),
    ('11', 'update:organizations', 'Update organization information', 'organizations', 'update', unixepoch(), unixepoch()),
    ('12', 'delete:organizations', 'Delete organizations', 'organizations', 'delete', unixepoch(), unixepoch()),
    ('13', 'read:roles', 'Read role information', 'roles', 'read', unixepoch(), unixepoch()),
    ('14', 'create:roles', 'Create new roles', 'roles', 'create', unixepoch(), unixepoch()),
    ('15', 'update:roles', 'Update role information', 'roles', 'update', unixepoch(), unixepoch()),
    ('16', 'delete:roles', 'Delete roles', 'roles', 'delete', unixepoch(), unixepoch()),
    ('17', 'read:permissions', 'Read permission information', 'permissions', 'read', unixepoch(), unixepoch()),
    ('18', 'create:permissions', 'Create new permissions', 'permissions', 'create', unixepoch(), unixepoch()),
    ('19', 'update:permissions', 'Update permission information', 'permissions', 'update', unixepoch(), unixepoch()),
    ('20', 'delete:permissions', 'Delete permissions', 'permissions', 'delete', unixepoch(), unixepoch()),
    ('21', 'read:settings', 'Read settings', 'settings', 'read', unixepoch(), unixepoch()),
    ('22', 'update:settings', 'Update settings', 'settings', 'update', unixepoch(), unixepoch())
`);

// Assign permissions to roles
db.exec(`
  -- Assign all permissions to admin role
  INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
  SELECT '2', id FROM permissions;
  
  -- Assign basic permissions to user role
  INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
  VALUES 
    ('1', '1'),  -- read:users
    ('1', '5'),  -- read:reports
    ('1', '6'),  -- create:reports
    ('1', '7'),  -- update:reports
    ('1', '8'),  -- delete:reports
    ('1', '9'),  -- read:organizations
    ('1', '21')  -- read:settings
`);

console.log('Tables created successfully');

// Close the database connection
db.close();
