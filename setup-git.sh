#!/bin/bash

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
else
  echo "Git repository is already initialized."
fi

# Configure remote repository
echo "Configuring remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/cyrkakou/saas.git
echo "Remote repository configured: https://github.com/cyrkakou/saas.git"

# Add all files to Git
echo "Adding all files to Git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Project setup with Next.js, Tailwind CSS, and Clean Architecture

Changelog:
- Set up Next.js project structure
- Implemented Clean Architecture pattern
- Added Tailwind CSS for styling
- Created core domain entities and repositories
- Implemented authentication system
- Added dashboard and landing page components
- Set up database with Drizzle ORM
- Added audit trail functionality"

# Push to remote repository
echo "Pushing to remote repository..."
git push -u origin main || git push -u origin master

echo ""
echo "Git repository has been set up successfully!"
echo "All changes have been committed and pushed to https://github.com/cyrkakou/saas.git"
echo ""
