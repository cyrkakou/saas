#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

# Check if an issue number was provided
if [ -z "$1" ]; then
  echo "Error: Please provide an issue number."
  echo "Usage: ./git/git-complete.sh 123 \"Commit message\""
  exit 1
fi

# Check if a commit message was provided
if [ -z "$2" ]; then
  node git/automate.js complete --issue "$1"
else
  node git/automate.js complete --issue "$1" --message "$2"
fi
