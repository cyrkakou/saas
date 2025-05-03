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

// Configure Git user (if not already configured)
console.log('Checking Git configuration...');
try {
  const userName = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const userEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
  
  console.log(`Git user: ${userName} <${userEmail}>`);
} catch (error) {
  console.log('Git user not configured. Please configure with:');
  console.log('git config --global user.name "Your Name"');
  console.log('git config --global user.email "your.email@example.com"');
}

// Add all files to Git
console.log('Adding files to Git...');
if (!runCommand('git add .')) {
  process.exit(1);
}

// Make initial commit
console.log('Creating initial commit...');
if (!runCommand('git commit -m "Initial commit: Project setup with Next.js, Tailwind CSS, and Clean Architecture"')) {
  console.log('No changes to commit or commit failed. This is normal if all changes were already committed.');
}

console.log('\nGit repository has been initialized successfully!');
console.log('\nNext steps:');
console.log('1. To connect to a remote repository (e.g., GitHub), run:');
console.log('   git remote add origin https://github.com/username/repository.git');
console.log('2. To push your code to the remote repository, run:');
console.log('   git push -u origin main');
console.log('\nHappy coding!');
