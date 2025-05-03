#!/bin/bash

# Change to the project root directory
cd "$(dirname "$0")/.."

# Run the initialization script
node git/automate.js init
