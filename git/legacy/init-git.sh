#!/bin/bash

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
else
  echo "Git repository is already initialized."
fi

# Add all files to Git
echo "Adding files to Git..."
git add .

# Make initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Project setup with Next.js, Tailwind CSS, and Clean Architecture"

echo ""
echo "Git repository has been initialized successfully!"
echo ""
echo "Next steps:"
echo "1. To connect to a remote repository (e.g., GitHub), run:"
echo "   git remote add origin https://github.com/username/repository.git"
echo "2. To push your code to the remote repository, run:"
echo "   git push -u origin main"
echo ""
echo "Happy coding!"
