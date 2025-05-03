# Git Automation System

This folder contains scripts to automate Git operations, GitHub issue management, and project tracking.

## Configuration

All automation settings are stored in `config.json`. You can customize the behavior by editing this file:

```json
{
  "automation": {
    "issues": {
      "updateStatus": true,
      "addComments": true,
      "addLabels": true,
      "linkPullRequests": true
    },
    "milestones": {
      "updateProgress": true,
      "closeWhenComplete": true
    },
    "git": {
      "autoCommit": true,
      "autoPush": true,
      "createBranchForIssue": true,
      "addIssueReferenceToCommit": true
    }
  }
}
```

Set any option to `false` to disable that specific automation feature.

## Command Line Tools

### Initialize Repository

```bash
git-init
```

This command:
- Initializes Git repository (if not already initialized)
- Configures the remote repository
- Creates standard labels in GitHub

### Commit Changes

```bash
git-commit "Your commit message"
```

or with an issue reference:

```bash
git-commit "Your commit message" 123
```

This command:
- Adds all changes to Git
- Commits with the provided message
- Pushes to the remote repository
- Updates issue status if an issue number is provided

### Work on an Issue

```bash
git-work 123
```

This command:
- Creates a branch for the issue
- Updates the issue status to "in progress"
- Adds a comment to the issue

### Complete an Issue

```bash
git-complete 123 "Implementation details"
```

This command:
- Adds all changes
- Commits with the provided message
- Pushes to the remote repository
- Creates a pull request
- Updates the issue status to "done"
- Closes the issue
- Updates milestone progress

## Automation Features

### Issue Management

- Automatically updates issue status based on commits
- Adds comments to issues with progress updates
- Adds labels to issues to indicate their status
- Links pull requests to issues

### Milestone Tracking

- Updates milestone progress based on completed issues
- Closes milestones when all issues are complete

### Git Operations

- Creates branches for issues
- Adds issue references to commit messages
- Pushes changes to the remote repository
- Creates pull requests

## Advanced Usage

For more advanced usage, you can use the Node.js scripts directly:

```bash
node git/automate.js <command> [options]
```

Available commands:
- `init`: Initialize repository
- `commit`: Commit and push changes
- `work`: Start working on an issue
- `complete`: Complete an issue
- `help`: Show help message

Options:
- `--message`, `-m`: Commit message
- `--issue`, `-i`: Issue number
- `--pr`: Create pull request

## GitHub Token

For full functionality, set your GitHub token as an environment variable:

```bash
set GITHUB_TOKEN=your_github_token
```

This enables API operations like creating pull requests and managing issues.
