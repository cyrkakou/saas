#!/bin/bash

# This script automatically commits all changes and pushes them to the remote repository
# Usage: ./git-commit-push.sh "Your commit message"

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./git-commit-push.sh \"Your commit message\""
  exit 1
fi

# Get the commit message
COMMIT_MESSAGE="$1"

# Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit. Working directory is clean."
  exit 0
fi

# Add all changes
echo "Adding all changes to Git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "$COMMIT_MESSAGE"

# Push to remote repository
echo "Pushing changes to remote repository..."
git push

echo ""
echo "Changes have been committed and pushed successfully!"
echo "Commit message: $COMMIT_MESSAGE"
echo ""
