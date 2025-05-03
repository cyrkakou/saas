@echo off
setlocal
cd %~dp0

if "%~1"=="" (
  echo Error: Please provide an issue number.
  echo Usage: git-complete.bat 123 "Commit message"
  exit /b 1
)

if "%~2"=="" (
  node git\automate.js complete --issue %~1
) else (
  node git\automate.js complete --issue %~1 --message "%~2"
)
