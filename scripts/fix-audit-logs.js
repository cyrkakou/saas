// This script fixes the audit_logs table by adding the missing organizationId column
// Run it with: node scripts/fix-audit-logs.js

const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Define the database file
const dbFile = path.join(__dirname, '..', 'sqlite.db');

// Backup the database before making changes
const backupFile = path.join(__dirname, '..', `sqlite.db.backup-${Date.now()}`);
fs.copyFileSync(dbFile, backupFile);
console.log(`Database backed up to ${backupFile}`);

// Connect to the database
const db = sqlite3(dbFile);

console.log('Starting audit_logs table fix...');

// Begin a transaction
db.prepare('BEGIN TRANSACTION').run();

try {
  // Check if the organizationId column exists in the audit_logs table
  const columns = db.prepare(`PRAGMA table_info(audit_logs);`).all();
  const hasOrganizationIdColumn = columns.some(col => col.name === 'organization_id');
  
  if (!hasOrganizationIdColumn) {
    console.log('Adding organization_id column to audit_logs table...');
    
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
        organization_id TEXT REFERENCES organizations(id),
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
        log.created_at
      );
    });
    
    // Drop the old table and rename the new one
    db.prepare(`DROP TABLE audit_logs`).run();
    db.prepare(`ALTER TABLE audit_logs_new RENAME TO audit_logs`).run();
    
    console.log('Audit logs table updated successfully');
  } else {
    console.log('The organization_id column already exists in the audit_logs table');
  }
  
  // Commit the transaction
  db.prepare('COMMIT').run();
  console.log('Audit logs table fix completed successfully');
} catch (error) {
  // Rollback the transaction if there's an error
  db.prepare('ROLLBACK').run();
  console.error('Error fixing audit_logs table:', error);
  console.log(`The database has been rolled back to its previous state. A backup is available at ${backupFile}`);
}

// Close the database connection
db.close();
