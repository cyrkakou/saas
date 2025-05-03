@echo off
echo Initializing Git repository...
git init

echo Configuring remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/cyrkakou/saas.git

echo Adding all files to Git...
git add .

echo Creating commit...
git commit -m "Project reorganization: Moved components to consistent structure

Changelog:
- Moved landing page components from root components folder to presentation/components/landing
- Moved ThemeProvider from components to presentation/providers
- Updated imports in app/page.tsx and app/layout.tsx
- Added Git setup scripts and documentation
- Updated README.md with Git instructions"

echo Pushing to remote repository...
git push -u origin main || git push -u origin master

echo.
echo Git repository has been set up successfully!
echo All changes have been committed and pushed to https://github.com/cyrkakou/saas.git
echo.
