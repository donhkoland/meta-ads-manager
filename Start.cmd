@echo off
cd /d "%~dp0"
if not exist node_modules call npm.cmd install
echo Open http://localhost:3000
call npm.cmd start
pause
