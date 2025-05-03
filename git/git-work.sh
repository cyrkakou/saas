#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

# Check if an issue number was provided
if [ -z "$1" ]; then
  echo "Error: Please provide an issue number."
  echo "Usage: ./git/git-work.sh 123"
  exit 1
fi

# Run the work script
node git/automate.js work --issue "$1"
