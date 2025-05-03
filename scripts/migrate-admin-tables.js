// This script initializes the admin tables in the database
// Run it with: node scripts/migrate-admin-tables.js

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('better-sqlite3');

// Define the database directory and file
const dbDir = path.join(__dirname, '..', '.db');
const dbFile = path.join(dbDir, 'sqlite.db');

// Create the database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create an empty database file if it doesn't exist
if (!fs.existsSync(dbFile)) {
  console.log('Creating empty database file...');
  fs.writeFileSync(dbFile, '');
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

// Create default roles and permissions
console.log('Creating default roles and permissions...');
try {
  // Open the database
  const db = sqlite3(dbFile);
  
  // Check if the roles table exists
  const rolesTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='roles'").get();
  
  if (!rolesTableExists) {
    console.error('Roles table not found. Make sure the migration has been run correctly.');
    db.close();
    process.exit(1);
  }
  
  // Create default roles if they don't exist
  const roles = [
    { id: '1', name: 'Admin', description: 'Administrator with full access to all features' },
    { id: '2', name: 'User', description: 'Regular user with limited access' },
    { id: '3', name: 'Manager', description: 'Manager with access to reports and user management' },
  ];
  
  const now = new Date().toISOString();
  
  // Insert roles
  const insertRoleStmt = db.prepare(`
    INSERT OR IGNORE INTO roles (id, name, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  for (const role of roles) {
    insertRoleStmt.run(role.id, role.name, role.description, now, now);
  }
  
  // Check if the permissions table exists
  const permissionsTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='permissions'").get();
  
  if (!permissionsTableExists) {
    console.error('Permissions table not found. Make sure the migration has been run correctly.');
    db.close();
    process.exit(1);
  }
  
  // Create default permissions if they don't exist
  const permissions = [
    { id: '1', name: 'Manage Users', description: 'Create, read, update, and delete users', resource: 'users', action: 'manage' },
    { id: '2', name: 'Manage Roles', description: 'Create, read, update, and delete roles', resource: 'roles', action: 'manage' },
    { id: '3', name: 'Manage Permissions', description: 'Create, read, update, and delete permissions', resource: 'permissions', action: 'manage' },
    { id: '4', name: 'Manage Organizations', description: 'Create, read, update, and delete organizations', resource: 'organizations', action: 'manage' },
    { id: '5', name: 'Manage Settings', description: 'Create, read, update, and delete settings', resource: 'settings', action: 'manage' },
    { id: '6', name: 'Manage Reports', description: 'Create, read, update, and delete reports', resource: 'reports', action: 'manage' },
    { id: '7', name: 'Manage Subscriptions', description: 'Create, read, update, and delete subscriptions', resource: 'subscriptions', action: 'manage' },
    { id: '8', name: 'View Reports', description: 'View reports', resource: 'reports', action: 'read' },
    { id: '9', name: 'View Users', description: 'View users', resource: 'users', action: 'read' },
  ];
  
  // Insert permissions
  const insertPermissionStmt = db.prepare(`
    INSERT OR IGNORE INTO permissions (id, name, description, resource, action, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const permission of permissions) {
    insertPermissionStmt.run(
      permission.id,
      permission.name,
      permission.description,
      permission.resource,
      permission.action,
      now,
      now
    );
  }
  
  // Check if the role_permissions table exists
  const rolePermissionsTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='role_permissions'").get();
  
  if (!rolePermissionsTableExists) {
    console.error('Role permissions table not found. Make sure the migration has been run correctly.');
    db.close();
    process.exit(1);
  }
  
  // Assign permissions to roles
  const rolePermissions = [
    // Admin role has all permissions
    { roleId: '1', permissionId: '1' },
    { roleId: '1', permissionId: '2' },
    { roleId: '1', permissionId: '3' },
    { roleId: '1', permissionId: '4' },
    { roleId: '1', permissionId: '5' },
    { roleId: '1', permissionId: '6' },
    { roleId: '1', permissionId: '7' },
    { roleId: '1', permissionId: '8' },
    { roleId: '1', permissionId: '9' },
    
    // Manager role has view permissions and some manage permissions
    { roleId: '3', permissionId: '8' },
    { roleId: '3', permissionId: '9' },
    { roleId: '3', permissionId: '1' },
    
    // User role has view permissions
    { roleId: '2', permissionId: '8' },
    { roleId: '2', permissionId: '9' },
  ];
  
  // Insert role permissions
  const insertRolePermissionStmt = db.prepare(`
    INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
    VALUES (?, ?)
  `);
  
  for (const rolePermission of rolePermissions) {
    insertRolePermissionStmt.run(rolePermission.roleId, rolePermission.permissionId);
  }
  
  // Create a default organization
  const organizationsTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'").get();
  
  if (organizationsTableExists) {
    const defaultOrg = {
      id: '1',
      name: 'Default Organization',
      description: 'Default organization for the system',
      website: 'https://example.com',
      email: 'contact@example.com',
    };
    
    const insertOrgStmt = db.prepare(`
      INSERT OR IGNORE INTO organizations (id, name, description, website, email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertOrgStmt.run(
      defaultOrg.id,
      defaultOrg.name,
      defaultOrg.description,
      defaultOrg.website,
      defaultOrg.email,
      now,
      now
    );
  }
  
  // Update existing users to have the admin role
  const usersTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
  
  if (usersTableExists) {
    // Check if the role_id column exists in the users table
    const roleIdColumnExists = db.prepare("PRAGMA table_info(users)").all().some(col => col.name === 'role_id');
    
    if (roleIdColumnExists) {
      // Update the first user to be an admin
      db.prepare(`
        UPDATE users
        SET role_id = '1'
        WHERE id IN (SELECT id FROM users LIMIT 1)
      `).run();
      
      console.log('Updated first user to have admin role');
    }
  }
  
  db.close();
  console.log('Default roles and permissions created successfully');
} catch (error) {
  console.error('Failed to create default roles and permissions:', error);
  process.exit(1);
}

console.log('Admin tables migration completed successfully');
