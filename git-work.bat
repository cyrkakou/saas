@echo off
setlocal
cd %~dp0

if "%~1"=="" (
  echo Error: Please provide an issue number.
  echo Usage: git-work.bat 123
  exit /b 1
)

node git\automate.js work --issue %~1
