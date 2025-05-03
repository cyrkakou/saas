const fs = require('fs');
const path = require('path');
const gitManager = require('./git-manager');
const issueManager = require('./issue-manager');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

/**
 * Parse command line arguments
 * @returns {object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    command: args[0],
    options: {}
  };
  
  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const option = args[i].substring(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      result.options[option] = value;
      if (value !== true) i++;
    }
  }
  
  return result;
}

/**
 * Initialize the repository
 */
function initialize() {
  console.log('Initializing repository...');
  
  // Initialize Git
  gitManager.initializeGit();
  
  // Configure remote
  gitManager.configureRemote();
  
  // Initialize labels
  issueManager.initializeLabels();
  
  console.log('Repository initialized successfully!');
}

/**
 * Commit and push changes
 * @param {string} message - Commit message
 * @param {number} issueNumber - Issue number (optional)
 * @param {boolean} createPR - Whether to create a PR (optional)
 */
function commitAndPush(message, issueNumber = null, createPR = false) {
  console.log('Committing and pushing changes...');
  
  // Add all changes
  gitManager.addAllChanges();
  
  // Commit changes
  const committed = gitManager.commitChanges(message, issueNumber);
  
  if (!committed) {
    console.log('No changes to commit.');
    return;
  }
  
  // Push changes
  const pushed = gitManager.pushChanges();
  
  if (!pushed) {
    console.log('Failed to push changes.');
    return;
  }
  
  // Create pull request if requested
  if (createPR && issueNumber) {
    const issue = issueManager.getIssues().find(i => i.number === parseInt(issueNumber));
    if (issue) {
      gitManager.createPullRequest(
        `Resolve #${issueNumber}: ${issue.title}`,
        `This PR resolves issue #${issueNumber}.\n\n${message}`,
        'main'
      );
    }
  }
  
  // Update milestone progress
  issueManager.updateMilestoneProgress();
  
  console.log('Changes committed and pushed successfully!');
}

/**
 * Work on an issue
 * @param {number} issueNumber - Issue number
 */
function workOnIssue(issueNumber) {
  console.log(`Working on issue #${issueNumber}...`);
  
  // Get issue details
  const issues = issueManager.getIssues();
  const issue = issues.find(i => i.number === parseInt(issueNumber));
  
  if (!issue) {
    console.error(`Issue #${issueNumber} not found.`);
    return;
  }
  
  // Create branch for issue
  gitManager.createBranchForIssue(issueNumber, issue.title);
  
  // Update issue status to in-progress
  issueManager.addLabelToIssue(issueNumber, 'status:in-progress');
  
  // Add comment to issue
  if (config.automation.issues.addComments) {
    issueManager.addComment(issueNumber, `Started working on this issue. Created branch: ${gitManager.getCurrentBranch()}`);
  }
  
  console.log(`Now working on issue #${issueNumber}: ${issue.title}`);
  console.log(`Branch: ${gitManager.getCurrentBranch()}`);
}

/**
 * Complete an issue
 * @param {number} issueNumber - Issue number
 * @param {string} message - Commit message
 */
function completeIssue(issueNumber, message) {
  console.log(`Completing issue #${issueNumber}...`);
  
  // Get issue details
  const issues = issueManager.getIssues();
  const issue = issues.find(i => i.number === parseInt(issueNumber));
  
  if (!issue) {
    console.error(`Issue #${issueNumber} not found.`);
    return;
  }
  
  // Complete workflow
  const result = gitManager.completeWorkflow(
    issueNumber,
    issue.title,
    message || `Resolve issue #${issueNumber}: ${issue.title}`,
    true
  );
  
  if (!result.success) {
    console.error(`Failed to complete issue #${issueNumber}: ${result.message}`);
    return;
  }
  
  // Update issue status to done
  issueManager.addLabelToIssue(issueNumber, 'status:done');
  
  // Close issue
  if (config.automation.issues.updateStatus) {
    issueManager.updateIssue(issueNumber, { state: 'closed' });
  }
  
  // Add comment to issue
  if (config.automation.issues.addComments) {
    issueManager.addComment(issueNumber, `Completed this issue. Created PR: ${result.pullRequest ? result.pullRequest.html_url : 'No PR created'}`);
  }
  
  console.log(`Completed issue #${issueNumber}: ${issue.title}`);
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Git Automation Tool

Usage:
  node automate.js <command> [options]

Commands:
  init                Initialize repository
  commit              Commit and push changes
  work                Start working on an issue
  complete            Complete an issue
  help                Show this help message

Options:
  --message, -m       Commit message
  --issue, -i         Issue number
  --pr                Create pull request
  
Examples:
  node automate.js init
  node automate.js commit --message "Add new feature"
  node automate.js commit --message "Fix bug" --issue 123
  node automate.js work --issue 123
  node automate.js complete --issue 123 --message "Implemented feature"
  `);
}

/**
 * Main function
 */
function main() {
  const { command, options } = parseArgs();
  
  switch (command) {
    case 'init':
      initialize();
      break;
    case 'commit':
      commitAndPush(
        options.message || options.m,
        options.issue || options.i,
        options.pr
      );
      break;
    case 'work':
      workOnIssue(options.issue || options.i);
      break;
    case 'complete':
      completeIssue(
        options.issue || options.i,
        options.message || options.m
      );
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

// Run main function
main();
