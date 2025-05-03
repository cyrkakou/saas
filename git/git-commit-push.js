const { execSync } = require('child_process');

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

// Get the commit message from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Error: Please provide a commit message.');
  console.error('Usage: node git-commit-push.js "Your commit message"');
  process.exit(1);
}

const commitMessage = args.join(' ');

// Check if there are any changes to commit
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (!status.trim()) {
    console.log('No changes to commit. Working directory is clean.');
    process.exit(0);
  }
} catch (error) {
  console.error('Error checking git status:', error.message);
  process.exit(1);
}

// Add all changes
console.log('Adding all changes to Git...');
if (!runCommand('git add .')) {
  process.exit(1);
}

// Commit changes
console.log('Committing changes...');
if (!runCommand(`git commit -m "${commitMessage}"`)) {
  console.log('Failed to commit changes.');
  process.exit(1);
}

// Push to remote repository
console.log('Pushing changes to remote repository...');
if (!runCommand('git push')) {
  console.log('Failed to push changes to remote repository.');
  process.exit(1);
}

console.log('\nChanges have been committed and pushed successfully!');
console.log(`Commit message: ${commitMessage}`);
