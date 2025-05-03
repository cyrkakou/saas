const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const { owner, name } = config.repository;

/**
 * GitHub API request function
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object} data - Request data
 * @returns {object} Response data
 */
function githubRequest(endpoint, method = 'GET', data = null) {
  const url = `https://api.github.com${endpoint}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHubAutomation'
  };

  // Add authorization if token is available
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const options = ['--silent', '-X', method];
  
  // Add headers
  Object.entries(headers).forEach(([key, value]) => {
    options.push('-H', `${key}: ${value}`);
  });

  // Add data if provided
  if (data) {
    options.push('-d', JSON.stringify(data));
  }

  try {
    const response = execSync(`curl ${options.join(' ')} "${url}"`, { encoding: 'utf8' });
    return JSON.parse(response);
  } catch (error) {
    console.error(`Error making GitHub API request to ${endpoint}:`, error.message);
    return null;
  }
}

/**
 * Get all issues for the repository
 * @returns {Array} List of issues
 */
function getIssues() {
  return githubRequest(`/repos/${owner}/${name}/issues?state=all&per_page=100`);
}

/**
 * Get all milestones for the repository
 * @returns {Array} List of milestones
 */
function getMilestones() {
  return githubRequest(`/repos/${owner}/${name}/milestones?state=all&per_page=100`);
}

/**
 * Update an issue
 * @param {number} issueNumber - Issue number
 * @param {object} data - Update data
 * @returns {object} Updated issue
 */
function updateIssue(issueNumber, data) {
  return githubRequest(`/repos/${owner}/${name}/issues/${issueNumber}`, 'PATCH', data);
}

/**
 * Add a comment to an issue
 * @param {number} issueNumber - Issue number
 * @param {string} body - Comment body
 * @returns {object} Created comment
 */
function addComment(issueNumber, body) {
  return githubRequest(`/repos/${owner}/${name}/issues/${issueNumber}/comments`, 'POST', { body });
}

/**
 * Update a milestone
 * @param {number} milestoneNumber - Milestone number
 * @param {object} data - Update data
 * @returns {object} Updated milestone
 */
function updateMilestone(milestoneNumber, data) {
  return githubRequest(`/repos/${owner}/${name}/milestones/${milestoneNumber}`, 'PATCH', data);
}

/**
 * Create a label if it doesn't exist
 * @param {object} label - Label data
 */
function createLabelIfNotExists(label) {
  const existingLabels = githubRequest(`/repos/${owner}/${name}/labels`);
  const exists = existingLabels.some(l => l.name === label.name);
  
  if (!exists) {
    githubRequest(`/repos/${owner}/${name}/labels`, 'POST', label);
    console.log(`Created label: ${label.name}`);
  }
}

/**
 * Add a label to an issue
 * @param {number} issueNumber - Issue number
 * @param {string} labelName - Label name
 */
function addLabelToIssue(issueNumber, labelName) {
  return githubRequest(`/repos/${owner}/${name}/issues/${issueNumber}/labels`, 'POST', { labels: [labelName] });
}

/**
 * Remove a label from an issue
 * @param {number} issueNumber - Issue number
 * @param {string} labelName - Label name
 */
function removeLabelFromIssue(issueNumber, labelName) {
  return githubRequest(`/repos/${owner}/${name}/issues/${issueNumber}/labels/${encodeURIComponent(labelName)}`, 'DELETE');
}

/**
 * Update issue status based on commit message
 * @param {string} commitMessage - Commit message
 */
function updateIssueStatusFromCommit(commitMessage) {
  // Extract issue numbers from commit message (e.g., #123)
  const issueMatches = commitMessage.match(/#(\d+)/g);
  if (!issueMatches) return;

  const issueNumbers = issueMatches.map(match => parseInt(match.substring(1)));
  
  // Determine status from commit message
  let status = 'status:in-progress';
  if (commitMessage.toLowerCase().includes('fix') || 
      commitMessage.toLowerCase().includes('close') || 
      commitMessage.toLowerCase().includes('resolve')) {
    status = 'status:done';
  }

  // Update each referenced issue
  issueNumbers.forEach(issueNumber => {
    // Get current issue data
    const issue = githubRequest(`/repos/${owner}/${name}/issues/${issueNumber}`);
    if (!issue) return;
    
    // Remove any existing status labels
    const statusLabels = issue.labels
      .filter(label => label.name.startsWith('status:'))
      .map(label => label.name);
    
    statusLabels.forEach(label => {
      removeLabelFromIssue(issueNumber, label);
    });
    
    // Add new status label
    addLabelToIssue(issueNumber, status);
    
    // Add comment about the update
    if (config.automation.issues.addComments) {
      const comment = `Status updated to ${status} based on commit: ${commitMessage}`;
      addComment(issueNumber, comment);
    }
    
    // Close issue if status is done and configured to do so
    if (status === 'status:done' && config.automation.issues.updateStatus) {
      updateIssue(issueNumber, { state: 'closed' });
    }
    
    console.log(`Updated issue #${issueNumber} status to ${status}`);
  });
}

/**
 * Update milestone progress
 */
function updateMilestoneProgress() {
  if (!config.automation.milestones.updateProgress) return;
  
  const milestones = getMilestones();
  if (!milestones) return;
  
  milestones.forEach(milestone => {
    const { number, open_issues, closed_issues } = milestone;
    const total = open_issues + closed_issues;
    const progress = total > 0 ? Math.round((closed_issues / total) * 100) : 0;
    
    // Update milestone description with progress
    const description = milestone.description.replace(/\[Progress: \d+%\]/, '');
    const newDescription = `${description} [Progress: ${progress}%]`;
    
    updateMilestone(number, { description: newDescription });
    
    // Close milestone if all issues are closed and configured to do so
    if (open_issues === 0 && closed_issues > 0 && config.automation.milestones.closeWhenComplete) {
      updateMilestone(number, { state: 'closed' });
      console.log(`Closed milestone #${number} as all issues are complete`);
    }
    
    console.log(`Updated milestone #${number} progress to ${progress}%`);
  });
}

/**
 * Initialize labels from configuration
 */
function initializeLabels() {
  // Create status labels
  config.labels.status.forEach(label => {
    createLabelIfNotExists(label);
  });
  
  // Create priority labels
  config.labels.priority.forEach(label => {
    createLabelIfNotExists(label);
  });
  
  // Create type labels
  config.labels.type.forEach(label => {
    createLabelIfNotExists(label);
  });
}

module.exports = {
  getIssues,
  getMilestones,
  updateIssue,
  addComment,
  updateMilestone,
  addLabelToIssue,
  removeLabelFromIssue,
  updateIssueStatusFromCommit,
  updateMilestoneProgress,
  initializeLabels
};
