@echo off
setlocal

if "%~1"=="" (
  echo Error: Please provide a commit message.
  echo Usage: git-commit.bat "Your commit message"
  exit /b 1
)

echo Adding all changes to Git...
git add .

echo Committing changes...
git commit -m "%~1"

echo Pushing changes to remote repository...
git push

echo.
echo Changes have been committed and pushed successfully!
echo Commit message: %~1
echo.
