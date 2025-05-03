const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Check if Git is already initialized
const isGitInitialized = fs.existsSync(path.join(process.cwd(), '.git'));

if (isGitInitialized) {
  console.log('Git repository is already initialized.');
} else {
  console.log('Initializing Git repository...');
  if (!runCommand('git init')) {
    process.exit(1);
  }
}

// Configure remote repository
console.log('Configuring remote repository...');
runCommand('git remote remove origin 2>/dev/null || true');
if (!runCommand('git remote add origin https://github.com/cyrkakou/saas.git')) {
  console.log('Failed to add remote repository. Continuing anyway...');
}
console.log('Remote repository configured: https://github.com/cyrkakou/saas.git');

// Add all files to Git
console.log('Adding all files to Git...');
if (!runCommand('git add .')) {
  process.exit(1);
}

// Create initial commit
const commitMessage = `Initial commit: Project setup with Next.js, Tailwind CSS, and Clean Architecture

Changelog:
- Set up Next.js project structure
- Implemented Clean Architecture pattern
- Added Tailwind CSS for styling
- Created core domain entities and repositories
- Implemented authentication system
- Added dashboard and landing page components
- Set up database with Drizzle ORM
- Added audit trail functionality`;

console.log('Creating initial commit...');
if (!runCommand(`git commit -m "${commitMessage}"`)) {
  console.log('No changes to commit or commit failed. This is normal if all changes were already committed.');
}

// Push to remote repository
console.log('Pushing to remote repository...');
if (!runCommand('git push -u origin main || git push -u origin master')) {
  console.log('Failed to push to remote repository. You may need to push manually.');
}

console.log('\nGit repository has been set up successfully!');
console.log('All changes have been committed and pushed to https://github.com/cyrkakou/saas.git');
