const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const issueManager = require('./issue-manager');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

/**
 * Execute a Git command
 * @param {string} command - Git command to execute
 * @returns {string} Command output
 */
function git(command) {
  try {
    return execSync(`git ${command}`, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error executing git ${command}:`, error.message);
    return null;
  }
}

/**
 * Check if Git is initialized
 * @returns {boolean} True if Git is initialized
 */
function isGitInitialized() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf8' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Initialize Git repository
 */
function initializeGit() {
  if (!isGitInitialized()) {
    console.log('Initializing Git repository...');
    git('init');
  } else {
    console.log('Git repository is already initialized.');
  }
}

/**
 * Configure remote repository
 */
function configureRemote() {
  const { owner, name } = config.repository;
  const remoteUrl = `https://github.com/${owner}/${name}.git`;
  
  // Check if remote exists
  const remotes = git('remote');
  
  if (remotes && remotes.includes('origin')) {
    // Update existing remote
    git(`remote set-url origin ${remoteUrl}`);
  } else {
    // Add new remote
    git(`remote add origin ${remoteUrl}`);
  }
  
  console.log(`Remote repository configured: ${remoteUrl}`);
}

/**
 * Get current branch name
 * @returns {string} Branch name
 */
function getCurrentBranch() {
  return git('rev-parse --abbrev-ref HEAD').trim();
}

/**
 * Create a branch for an issue
 * @param {number} issueNumber - Issue number
 * @param {string} issueTitle - Issue title
 * @returns {string} Branch name
 */
function createBranchForIssue(issueNumber, issueTitle) {
  if (!config.automation.git.createBranchForIssue) return getCurrentBranch();
  
  // Convert issue title to kebab case for branch name
  const branchSuffix = issueTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const branchName = `issue-${issueNumber}-${branchSuffix}`;
  
  // Check if branch exists
  const branches = git('branch');
  
  if (!branches || !branches.includes(branchName)) {
    // Create and checkout branch
    git(`checkout -b ${branchName}`);
    console.log(`Created and checked out branch: ${branchName}`);
  } else {
    // Checkout existing branch
    git(`checkout ${branchName}`);
    console.log(`Checked out existing branch: ${branchName}`);
  }
  
  return branchName;
}

/**
 * Add all changes to Git
 */
function addAllChanges() {
  git('add .');
  console.log('Added all changes to Git.');
}

/**
 * Commit changes with a message
 * @param {string} message - Commit message
 * @param {number} issueNumber - Issue number (optional)
 * @returns {boolean} True if commit was successful
 */
function commitChanges(message, issueNumber = null) {
  if (!config.automation.git.autoCommit) return false;
  
  let commitMessage = message;
  
  // Add issue reference if configured and issue number is provided
  if (config.automation.git.addIssueReferenceToCommit && issueNumber) {
    commitMessage = `${message} (Closes #${issueNumber})`;
  }
  
  const result = git(`commit -m "${commitMessage}"`);
  
  if (result && !result.includes('nothing to commit')) {
    console.log(`Committed changes with message: ${commitMessage}`);
    
    // Update issue status based on commit message
    issueManager.updateIssueStatusFromCommit(commitMessage);
    
    return true;
  }
  
  return false;
}

/**
 * Push changes to remote repository
 * @param {string} branch - Branch name (optional)
 * @returns {boolean} True if push was successful
 */
function pushChanges(branch = null) {
  if (!config.automation.git.autoPush) return false;
  
  const branchName = branch || getCurrentBranch();
  const result = git(`push -u origin ${branchName}`);
  
  if (result) {
    console.log(`Pushed changes to remote repository (branch: ${branchName}).`);
    return true;
  }
  
  return false;
}

/**
 * Create a pull request
 * @param {string} title - PR title
 * @param {string} body - PR description
 * @param {string} base - Base branch
 * @param {string} head - Head branch
 * @returns {object} Pull request data
 */
function createPullRequest(title, body, base = 'main', head = null) {
  const headBranch = head || getCurrentBranch();
  
  // Use GitHub API to create PR
  const { owner, name } = config.repository;
  const data = {
    title,
    body,
    base,
    head: headBranch
  };
  
  try {
    const curlCommand = `curl -X POST -H "Accept: application/vnd.github.v3+json" -H "Authorization: token ${process.env.GITHUB_TOKEN}" https://api.github.com/repos/${owner}/${name}/pulls -d '${JSON.stringify(data)}'`;
    const response = execSync(curlCommand, { encoding: 'utf8' });
    const pullRequest = JSON.parse(response);
    
    console.log(`Created pull request #${pullRequest.number}: ${title}`);
    return pullRequest;
  } catch (error) {
    console.error('Error creating pull request:', error.message);
    return null;
  }
}

/**
 * Perform a complete Git workflow for an issue
 * @param {number} issueNumber - Issue number
 * @param {string} issueTitle - Issue title
 * @param {string} commitMessage - Commit message
 * @param {boolean} createPR - Whether to create a PR
 * @returns {object} Result object
 */
function completeWorkflow(issueNumber, issueTitle, commitMessage, createPR = false) {
  // Create branch for issue
  const branch = createBranchForIssue(issueNumber, issueTitle);
  
  // Add all changes
  addAllChanges();
  
  // Commit changes
  const committed = commitChanges(commitMessage, issueNumber);
  
  if (!committed) {
    console.log('No changes to commit.');
    return { success: false, message: 'No changes to commit' };
  }
  
  // Push changes
  const pushed = pushChanges(branch);
  
  if (!pushed) {
    console.log('Failed to push changes.');
    return { success: false, message: 'Failed to push changes' };
  }
  
  // Create pull request if requested
  let pullRequest = null;
  if (createPR) {
    pullRequest = createPullRequest(
      `Resolve #${issueNumber}: ${issueTitle}`,
      `This PR resolves issue #${issueNumber}.\n\n${commitMessage}`,
      'main',
      branch
    );
  }
  
  // Update milestone progress
  issueManager.updateMilestoneProgress();
  
  return {
    success: true,
    branch,
    committed,
    pushed,
    pullRequest
  };
}

module.exports = {
  initializeGit,
  configureRemote,
  getCurrentBranch,
  createBranchForIssue,
  addAllChanges,
  commitChanges,
  pushChanges,
  createPullRequest,
  completeWorkflow
};
