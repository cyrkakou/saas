const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to create directory if it doesn't exist
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
}

// Function to execute shell commands
function executeCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
  }
}

// Create Next.js project
console.log('Creating Next.js project...');
executeCommand('npx create-next-app@latest . --typescript --eslint --tailwind --app');

// Install additional dependencies
console.log('Installing additional dependencies...');
executeCommand('npm install drizzle-orm @tanstack/react-query @tanstack/react-table zod');
executeCommand('npm install -D drizzle-kit better-sqlite3 @types/better-sqlite3');

// Create directory structure
console.log('Creating directory structure...');
const directories = [
  'app/api',
  'core/domain/entities',
  'core/domain/repositories',
  'core/domain/services',
  'core/domain/value-objects',
  'core/domain/errors',
  'core/use-cases/user',
  'core/use-cases/subscription',
  'core/interfaces/storage',
  'core/interfaces/payment',
  'core/interfaces/email',
  'infrastructure/database/drizzle',
  'infrastructure/database/repositories',
  'infrastructure/payment',
  'infrastructure/email',
  'infrastructure/storage',
  'presentation/components/ui',
  'presentation/components/auth',
  'presentation/components/dashboard',
  'presentation/components/layouts',
  'presentation/components/shared',
  'presentation/hooks',
  'presentation/providers',
  'presentation/utils',
  'lib/api',
  'lib/config',
  'lib/utils',
  'lib/validation',
  'types',
  'tests/e2e',
  'tests/integration',
  'tests/unit/core',
  'tests/unit/infrastructure',
  'tests/unit/presentation'
];

directories.forEach(dir => createDirIfNotExists(dir));

console.log('Setup completed successfully!');
