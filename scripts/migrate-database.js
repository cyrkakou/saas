// This script migrates the database to match the application model
// Run it with: node scripts/migrate-database.js

const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { createId } = require('@paralleldrive/cuid2');

// Define the database file
const dbFile = path.join(__dirname, '..', 'sqlite.db');

// Backup the database before making changes
const backupFile = path.join(__dirname, '..', `sqlite.db.backup-${Date.now()}`);
fs.copyFileSync(dbFile, backupFile);
console.log(`Database backed up to ${backupFile}`);

// Connect to the database
const db = sqlite3(dbFile);

console.log('Starting database migration...');

// Begin a transaction
db.prepare('BEGIN TRANSACTION').run();

try {
  // Step 1: Check if we need to create a new users table with the correct schema
  console.log('Checking users table schema...');
  
  // Get the current users table schema
  const usersColumns = db.prepare(`PRAGMA table_info(users);`).all();
  const hasRoleColumn = usersColumns.some(col => col.name === 'role');
  const hasRoleIdColumn = usersColumns.some(col => col.name === 'role_id');
  const hasIsActiveColumn = usersColumns.some(col => col.name === 'is_active');
  const hasOrganizationIdColumn = usersColumns.some(col => col.name === 'organization_id');
  const hasLastLoginColumn = usersColumns.some(col => col.name === 'last_login');
  
  // If the users table doesn't have the correct schema, we need to recreate it
  if (hasRoleColumn || !hasRoleIdColumn || !hasIsActiveColumn || !hasOrganizationIdColumn || !hasLastLoginColumn) {
    console.log('Users table needs to be updated to match the application model');
    
    // Create a temporary table with the correct schema
    db.prepare(`
      CREATE TABLE users_new (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        password TEXT NOT NULL,
        role_id TEXT REFERENCES roles(id),
        organization_id TEXT REFERENCES organizations(id),
        is_active INTEGER DEFAULT 1,
        last_login INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `).run();
    
    // Copy data from the old table to the new table
    console.log('Migrating user data...');
    const users = db.prepare(`SELECT * FROM users`).all();
    
    // Get roles to map role names to role IDs
    const roles = db.prepare(`SELECT id, name FROM roles`).all();
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });
    
    // Insert users into the new table
    const insertStmt = db.prepare(`
      INSERT INTO users_new (
        id, email, name, password, role_id, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    users.forEach(user => {
      // Map role to role_id if needed
      let roleId = user.role_id;
      if (!roleId && user.role) {
        roleId = roleMap[user.role] || roleMap['user']; // Default to 'user' if role not found
      }
      
      // Set is_active to 1 (true) if it doesn't exist
      const isActive = user.is_active !== undefined ? user.is_active : 1;
      
      insertStmt.run(
        user.id,
        user.email,
        user.name,
        user.password,
        roleId,
        isActive,
        user.created_at,
        user.updated_at
      );
    });
    
    // Drop the old table and rename the new one
    db.prepare(`DROP TABLE users`).run();
    db.prepare(`ALTER TABLE users_new RENAME TO users`).run();
    
    console.log('Users table updated successfully');
  } else {
    console.log('Users table schema is already correct');
  }
  
  // Step 2: Check if we need to update the organizations table
  console.log('Checking organizations table schema...');
  
  // Get the current organizations table schema
  const orgsColumns = db.prepare(`PRAGMA table_info(organizations);`).all();
  const hasWebsiteColumn = orgsColumns.some(col => col.name === 'website');
  const hasEmailColumn = orgsColumns.some(col => col.name === 'email');
  const hasPhoneColumn = orgsColumns.some(col => col.name === 'phone');
  const hasAddressColumn = orgsColumns.some(col => col.name === 'address');
  const hasLogoColumn = orgsColumns.some(col => col.name === 'logo');
  
  // If the organizations table doesn't have the correct schema, we need to update it
  if (!hasWebsiteColumn || !hasEmailColumn || !hasPhoneColumn || !hasAddressColumn || !hasLogoColumn) {
    console.log('Organizations table needs to be updated to match the application model');
    
    // Add missing columns
    if (!hasWebsiteColumn) {
      db.prepare(`ALTER TABLE organizations ADD COLUMN website TEXT`).run();
    }
    if (!hasEmailColumn) {
      db.prepare(`ALTER TABLE organizations ADD COLUMN email TEXT`).run();
    }
    if (!hasPhoneColumn) {
      db.prepare(`ALTER TABLE organizations ADD COLUMN phone TEXT`).run();
    }
    if (!hasAddressColumn) {
      db.prepare(`ALTER TABLE organizations ADD COLUMN address TEXT`).run();
    }
    if (!hasLogoColumn) {
      db.prepare(`ALTER TABLE organizations ADD COLUMN logo TEXT`).run();
    }
    
    console.log('Organizations table updated successfully');
  } else {
    console.log('Organizations table schema is already correct');
  }
  
  // Step 3: Check if we need to update the reports table
  console.log('Checking reports table schema...');
  
  // Get the current reports table schema
  const reportsColumns = db.prepare(`PRAGMA table_info(reports);`).all();
  const hasConfigColumn = reportsColumns.some(col => col.name === 'config');
  const hasCreatedByIdColumn = reportsColumns.some(col => col.name === 'created_by_id');
  const hasOrgIdColumn = reportsColumns.some(col => col.name === 'organization_id');
  const hasIsPublicColumn = reportsColumns.some(col => col.name === 'is_public');
  
  // If the reports table doesn't have the correct schema, we need to update it
  if (!hasConfigColumn || !hasCreatedByIdColumn || !hasOrgIdColumn || !hasIsPublicColumn) {
    console.log('Reports table needs to be updated to match the application model');
    
    // Add missing columns
    if (!hasConfigColumn) {
      db.prepare(`ALTER TABLE reports ADD COLUMN config TEXT`).run();
    }
    if (!hasCreatedByIdColumn) {
      db.prepare(`ALTER TABLE reports ADD COLUMN created_by_id TEXT REFERENCES users(id)`).run();
    }
    if (!hasOrgIdColumn) {
      db.prepare(`ALTER TABLE reports ADD COLUMN organization_id TEXT REFERENCES organizations(id)`).run();
    }
    if (!hasIsPublicColumn) {
      db.prepare(`ALTER TABLE reports ADD COLUMN is_public INTEGER DEFAULT 0`).run();
    }
    
    console.log('Reports table updated successfully');
  } else {
    console.log('Reports table schema is already correct');
  }
  
  // Step 4: Check if we need to update the subscriptions table
  console.log('Checking subscriptions table schema...');
  
  // Get the current subscriptions table schema
  const subsColumns = db.prepare(`PRAGMA table_info(subscriptions);`).all();
  const hasPlanColumn = subsColumns.some(col => col.name === 'plan');
  const hasStatusColumn = subsColumns.some(col => col.name === 'status');
  const hasStartDateColumn = subsColumns.some(col => col.name === 'start_date');
  const hasEndDateColumn = subsColumns.some(col => col.name === 'end_date');
  
  // If the subscriptions table doesn't have the correct schema, we need to update it
  if (!hasPlanColumn || !hasStatusColumn || !hasStartDateColumn || !hasEndDateColumn) {
    console.log('Subscriptions table needs to be updated to match the application model');
    
    // Create a temporary table with the correct schema
    db.prepare(`
      CREATE TABLE subscriptions_new (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan TEXT NOT NULL,
        status TEXT NOT NULL,
        start_date INTEGER NOT NULL,
        end_date INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `).run();
    
    // Copy data from the old table to the new table
    console.log('Migrating subscription data...');
    const subs = db.prepare(`SELECT * FROM subscriptions`).all();
    
    // Insert subscriptions into the new table
    const insertStmt = db.prepare(`
      INSERT INTO subscriptions_new (
        id, user_id, plan, status, start_date, end_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    subs.forEach(sub => {
      insertStmt.run(
        sub.id,
        sub.user_id,
        sub.plan || 'free',
        sub.status || 'active',
        sub.start_date || Date.now(),
        sub.end_date,
        sub.created_at || Date.now(),
        sub.updated_at || Date.now()
      );
    });
    
    // Drop the old table and rename the new one
    db.prepare(`DROP TABLE subscriptions`).run();
    db.prepare(`ALTER TABLE subscriptions_new RENAME TO subscriptions`).run();
    
    console.log('Subscriptions table updated successfully');
  } else {
    console.log('Subscriptions table schema is already correct');
  }
  
  // Step 5: Check if we need to update the settings table
  console.log('Checking settings table schema...');
  
  // Get the current settings table schema
  const settingsColumns = db.prepare(`PRAGMA table_info(settings);`).all();
  const hasKeyColumn = settingsColumns.some(col => col.name === 'key');
  const hasValueColumn = settingsColumns.some(col => col.name === 'value');
  const hasDescriptionColumn = settingsColumns.some(col => col.name === 'description');
  const hasSettingsIsPublicColumn = settingsColumns.some(col => col.name === 'is_public');
  
  // If the settings table doesn't have the correct schema, we need to update it
  if (!hasKeyColumn || !hasValueColumn || !hasDescriptionColumn || !hasSettingsIsPublicColumn) {
    console.log('Settings table needs to be updated to match the application model');
    
    // Create a temporary table with the correct schema
    db.prepare(`
      CREATE TABLE settings_new (
        id TEXT PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT,
        description TEXT,
        is_public INTEGER DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER
      )
    `).run();
    
    // Copy data from the old table to the new table
    console.log('Migrating settings data...');
    const settings = db.prepare(`SELECT * FROM settings`).all();
    
    // Insert settings into the new table
    const insertStmt = db.prepare(`
      INSERT INTO settings_new (
        id, key, value, description, is_public, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    settings.forEach(setting => {
      insertStmt.run(
        setting.id,
        setting.key,
        setting.value,
        setting.description,
        setting.is_public || 0,
        setting.created_at,
        setting.updated_at
      );
    });
    
    // Drop the old table and rename the new one
    db.prepare(`DROP TABLE settings`).run();
    db.prepare(`ALTER TABLE settings_new RENAME TO settings`).run();
    
    console.log('Settings table updated successfully');
  } else {
    console.log('Settings table schema is already correct');
  }
  
  // Step 6: Check if we need to update the audit_logs table
  console.log('Checking audit_logs table schema...');
  
  // Get the current audit_logs table schema
  const logsColumns = db.prepare(`PRAGMA table_info(audit_logs);`).all();
  const hasUserIdColumn = logsColumns.some(col => col.name === 'user_id');
  const hasActionColumn = logsColumns.some(col => col.name === 'action');
  const hasEntityTypeColumn = logsColumns.some(col => col.name === 'entity_type');
  const hasEntityIdColumn = logsColumns.some(col => col.name === 'entity_id');
  const hasDetailsColumn = logsColumns.some(col => col.name === 'details');
  const hasIpAddressColumn = logsColumns.some(col => col.name === 'ip_address');
  
  // If the audit_logs table doesn't have the correct schema, we need to update it
  if (!hasUserIdColumn || !hasActionColumn || !hasEntityTypeColumn || !hasEntityIdColumn || !hasDetailsColumn || !hasIpAddressColumn) {
    console.log('Audit logs table needs to be updated to match the application model');
    
    // Create a temporary table with the correct schema
    db.prepare(`
      CREATE TABLE audit_logs_new (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        details TEXT,
        ip_address TEXT,
        created_at INTEGER NOT NULL
      )
    `).run();
    
    // Copy data from the old table to the new table
    console.log('Migrating audit log data...');
    const logs = db.prepare(`SELECT * FROM audit_logs`).all();
    
    // Insert logs into the new table
    const insertStmt = db.prepare(`
      INSERT INTO audit_logs_new (
        id, user_id, action, entity_type, entity_id, details, ip_address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    logs.forEach(log => {
      insertStmt.run(
        log.id,
        log.user_id,
        log.action,
        log.entity_type,
        log.entity_id,
        log.details,
        log.ip_address,
        log.created_at || Date.now()
      );
    });
    
    // Drop the old table and rename the new one
    db.prepare(`DROP TABLE audit_logs`).run();
    db.prepare(`ALTER TABLE audit_logs_new RENAME TO audit_logs`).run();
    
    console.log('Audit logs table updated successfully');
  } else {
    console.log('Audit logs table schema is already correct');
  }
  
  // Step 7: Check if we need to update the role_permissions table
  console.log('Checking role_permissions table schema...');
  
  // Get the current role_permissions table schema
  const rolePermsColumns = db.prepare(`PRAGMA table_info(role_permissions);`).all();
  const hasRoleIdCol = rolePermsColumns.some(col => col.name === 'role_id');
  const hasPermissionIdCol = rolePermsColumns.some(col => col.name === 'permission_id');
  
  // If the role_permissions table doesn't have the correct schema, we need to update it
  if (!hasRoleIdCol || !hasPermissionIdCol) {
    console.log('Role permissions table needs to be updated to match the application model');
    
    // Create a temporary table with the correct schema
    db.prepare(`
      CREATE TABLE role_permissions_new (
        role_id TEXT NOT NULL,
        permission_id TEXT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `).run();
    
    // Copy data from the old table to the new table
    console.log('Migrating role permissions data...');
    const rolePerms = db.prepare(`SELECT * FROM role_permissions`).all();
    
    // Insert role permissions into the new table
    const insertStmt = db.prepare(`
      INSERT INTO role_permissions_new (
        role_id, permission_id
      ) VALUES (?, ?)
    `);
    
    rolePerms.forEach(rolePerm => {
      insertStmt.run(
        rolePerm.role_id,
        rolePerm.permission_id
      );
    });
    
    // Drop the old table and rename the new one
    db.prepare(`DROP TABLE role_permissions`).run();
    db.prepare(`ALTER TABLE role_permissions_new RENAME TO role_permissions`).run();
    
    console.log('Role permissions table updated successfully');
  } else {
    console.log('Role permissions table schema is already correct');
  }
  
  // Step 8: Remove the 'role' column from the users table if it still exists
  if (hasRoleColumn) {
    console.log('Removing the role column from the users table...');
    
    // SQLite doesn't support dropping columns directly, so we need to create a new table
    // But we've already done this in Step 1, so we just need to check if the column still exists
    const usersColumnsAfterMigration = db.prepare(`PRAGMA table_info(users);`).all();
    const roleColumnStillExists = usersColumnsAfterMigration.some(col => col.name === 'role');
    
    if (roleColumnStillExists) {
      console.log('The role column still exists in the users table. This should not happen if Step 1 was successful.');
    } else {
      console.log('The role column has been successfully removed from the users table.');
    }
  }
  
  // Step 9: Ensure all passwords are properly hashed
  console.log('Checking password hashing...');
  
  // Get all users
  const users = db.prepare(`SELECT id, password FROM users`).all();
  let unhashed = 0;
  
  // Check each user's password
  users.forEach(user => {
    // If the password is not hashed (doesn't contain a colon or is too short)
    if (!user.password.includes(':') || user.password.length < 40) {
      unhashed++;
      
      // Hash the password
      const crypto = require('crypto');
      const password = user.password;
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      const hashedPassword = `${salt}:${hash}`;
      
      // Update the user's password
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user.id);
      console.log(`  Hashed password for user ${user.id}`);
    }
  });
  
  if (unhashed === 0) {
    console.log('All passwords are already properly hashed.');
  } else {
    console.log(`Hashed ${unhashed} unhashed passwords.`);
  }
  
  // Step 10: Ensure all required foreign keys are set
  console.log('Checking foreign key relationships...');
  
  // Check if any users have a null role_id
  const usersWithoutRole = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role_id IS NULL`).get();
  if (usersWithoutRole.count > 0) {
    console.log(`Found ${usersWithoutRole.count} users without a role_id. Assigning default role...`);
    
    // Get the default role (user)
    const defaultRole = db.prepare(`SELECT id FROM roles WHERE name = 'user'`).get();
    if (defaultRole) {
      // Update users without a role
      db.prepare(`UPDATE users SET role_id = ? WHERE role_id IS NULL`).run(defaultRole.id);
      console.log(`Assigned default role to ${usersWithoutRole.count} users.`);
    } else {
      console.log('Default role not found. Creating it...');
      
      // Create the default role
      const roleId = createId();
      db.prepare(`
        INSERT INTO roles (id, name, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        roleId,
        'user',
        'Regular user with limited permissions',
        Date.now(),
        Date.now()
      );
      
      // Update users without a role
      db.prepare(`UPDATE users SET role_id = ? WHERE role_id IS NULL`).run(roleId);
      console.log(`Created default role and assigned it to ${usersWithoutRole.count} users.`);
    }
  } else {
    console.log('All users have a role_id assigned.');
  }
  
  // Commit the transaction
  db.prepare('COMMIT').run();
  console.log('Database migration completed successfully.');
  
  // Verify the migration
  console.log('\nVerifying migration...');
  
  // Check if the users table has the correct schema
  const finalUsersColumns = db.prepare(`PRAGMA table_info(users);`).all();
  const hasRoleIdColumnFinal = finalUsersColumns.some(col => col.name === 'role_id');
  const hasRoleColumnFinal = finalUsersColumns.some(col => col.name === 'role');
  
  if (hasRoleIdColumnFinal && !hasRoleColumnFinal) {
    console.log('✓ Users table has the correct schema.');
  } else {
    console.log('✗ Users table schema is incorrect.');
  }
  
  // Check if all passwords are hashed
  const unhashed2 = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE password NOT LIKE '%:%' OR LENGTH(password) < 40
  `).get();
  
  if (unhashed2.count === 0) {
    console.log('✓ All passwords are properly hashed.');
  } else {
    console.log(`✗ ${unhashed2.count} passwords are not properly hashed.`);
  }
  
  // Check if all users have a role_id
  const usersWithoutRole2 = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role_id IS NULL`).get();
  
  if (usersWithoutRole2.count === 0) {
    console.log('✓ All users have a role_id assigned.');
  } else {
    console.log(`✗ ${usersWithoutRole2.count} users do not have a role_id assigned.`);
  }
  
  console.log('\nMigration verification complete.');
} catch (error) {
  // Rollback the transaction if there's an error
  db.prepare('ROLLBACK').run();
  console.error('Error during migration:', error);
  console.log(`The database has been rolled back to its previous state. A backup is available at ${backupFile}`);
}

// Close the database connection
db.close();
