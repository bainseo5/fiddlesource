@echo off
REM FiddleSource - Push to GitHub

setlocal enabledelayedexpansion

echo.
echo ============================================
echo   FiddleSource - GitHub Push Script
echo ============================================
echo.

REM Ask for GitHub username
set /p GITHUB_USERNAME="Enter your GitHub username: "

if "!GITHUB_USERNAME!"=="" (
    echo Error: GitHub username is required!
    exit /b 1
)

echo.
echo Connecting to GitHub...

REM Add remote
"C:\Program Files\Git\bin\git" remote add origin https://github.com/!GITHUB_USERNAME!/fiddlesource.git

if errorlevel 1 (
    echo Error adding remote. It might already exist.
    echo Trying to update existing remote...
    "C:\Program Files\Git\bin\git" remote set-url origin https://github.com/!GITHUB_USERNAME!/fiddlesource.git
)

REM Rename branch to main
"C:\Program Files\Git\bin\git" branch -M main

REM Push to GitHub
echo.
echo Pushing to GitHub (you may be prompted to authenticate)...
"C:\Program Files\Git\bin\git" push -u origin main

if errorlevel 1 (
    echo.
    echo Error: Failed to push to GitHub
    echo Make sure:
    echo   1. You created the repo at https://github.com/!GITHUB_USERNAME!/fiddlesource
    echo   2. GitHub username is correct
    echo   3. You authenticated with GitHub
    exit /b 1
)

echo.
echo ============================================
echo   SUCCESS! 🎉
echo ============================================
echo.
echo Your code is now on GitHub!
echo Next: Deploy to Railway
echo.
echo Go to https://railway.app and connect your GitHub repo
echo.
pause
