#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./git/git-commit.sh \"Your commit message\""
  echo "Usage with issue: ./git/git-commit.sh \"Your commit message\" 123"
  exit 1
fi

# Get the commit message
COMMIT_MESSAGE="$1"

# Check if an issue number was provided
if [ -z "$2" ]; then
  node git/automate.js commit --message "$COMMIT_MESSAGE"
else
  node git/automate.js commit --message "$COMMIT_MESSAGE" --issue "$2"
fi
