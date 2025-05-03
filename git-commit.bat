@echo off
setlocal
cd %~dp0

if "%~1"=="" (
  echo Error: Please provide a commit message.
  echo Usage: git-commit.bat "Your commit message"
  echo Usage with issue: git-commit.bat "Your commit message" 123
  exit /b 1
)

if "%~2"=="" (
  node git\automate.js commit --message "%~1"
) else (
  node git\automate.js commit --message "%~1" --issue %~2
)

echo.
