@echo off
setlocal enabledelayedexpansion
title BMW M4 CSL - Push to GitHub

:: 1. Navigate to script's own directory (Guarantees correct project root even when double-clicked)
cd /d "%~dp0"

echo ===================================================================
echo           BMW M4 CSL Website - GitHub Push Utility
echo ===================================================================
echo Project Directory: %CD%
echo.

:: 2. Check if Git is installed and accessible
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b 1
)

:: 3. Check if inside a Git repository
if not exist ".git" (
    echo [ERROR] This directory is not a Git repository.
    echo Initializing Git repository...
    git init -b main
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize Git repository.
        pause
        exit /b 1
    )
)

:: 4. Verify / Configure remote origin
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo Configuring remote repository origin...
    git remote add origin https://github.com/arshadali85579-star/BMW-M4-CSL-.git
)

for /f "delims=" %%r in ('git remote get-url origin 2^>nul') do set REMOTE_URL=%%r
echo Remote Repository: !REMOTE_URL!

:: 5. Detect current branch
for /f "delims=" %%b in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%b
if "!CURRENT_BRANCH!"=="" set CURRENT_BRANCH=main
echo Current Branch:    !CURRENT_BRANCH!
echo.

:: 6. Check for working tree changes
git status --porcelain > "%temp%\git_status_%random%.tmp"
set HAS_CHANGES=0
for %%A in ("%temp%\git_status_%random%.tmp") do (
    if %%~zA gtr 0 set HAS_CHANGES=1
)
del "%temp%\git_status_*.tmp" >nul 2>nul

for /f %%i in ('git status --porcelain 2^>nul ^| find /c /v ""') do set CHANGE_COUNT=%%i

if !CHANGE_COUNT! equ 0 (
    echo -------------------------------------------------------------------
    echo No local file changes detected. Working tree is clean.
    echo -------------------------------------------------------------------
    echo.
    echo Checking for any unpushed commits on !CURRENT_BRANCH!...
    git push origin !CURRENT_BRANCH!
    if !errorlevel! equ 0 (
        echo [SUCCESS] Everything is up to date on GitHub.
    ) else (
        echo [INFO] Remote is up to date or push skipped.
    )
    echo.
    pause
    exit /b 0
)

:: 7. Display detected changes
echo -------------------------------------------------------------------
echo Detected !CHANGE_COUNT! changed file(s):
echo -------------------------------------------------------------------
git status --short
echo.

:: 8. Stage all modified and added files
echo Staging changes...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to stage changes.
    pause
    exit /b 1
)

:: 9. Generate descriptive commit message with date and time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set DT=%%I
if defined DT (
    set YYYY=!DT:~0,4!
    set MM=!DT:~4,2!
    set DD=!DT:~6,2!
    set HH=!DT:~8,2!
    set MIN=!DT:~10,2!
    set COMMIT_MSG=Update BMW M4 CSL website - !YYYY!-!MM!-!DD! !HH!:!MIN!
) else (
    set COMMIT_MSG=Update BMW M4 CSL website - %date% %time%
)

echo Creating commit: "!COMMIT_MSG!"
git commit -m "!COMMIT_MSG!"
if %errorlevel% neq 0 (
    echo [ERROR] Commit failed.
    pause
    exit /b 1
)

:: 10. Push commit to GitHub
echo.
echo Pushing to GitHub (origin !CURRENT_BRANCH!)...
echo [NOTE] Uploading files (including the 67 MB 3D car model). Please wait, this may take 20-40 seconds...
git push -u origin !CURRENT_BRANCH! --progress
if %errorlevel% neq 0 (
    echo.
    echo ===================================================================
    echo [ERROR] Push to GitHub failed.
    echo ===================================================================
    echo Possible causes:
    echo  1. GitHub authentication required (Sign in via browser / Git Credential Manager).
    echo  2. Remote has new commits. Try pulling first if needed.
    echo  3. Internet connection issue.
    echo.
    echo (Note: Destructive commands like force-push are NEVER run automatically).
    echo ===================================================================
    pause
    exit /b 1
)

echo.
echo ===================================================================
echo [SUCCESS] Commit successfully pushed to GitHub!
echo Repository: https://github.com/arshadali85579-star/BMW-M4-CSL-
echo Branch:     !CURRENT_BRANCH!
echo ===================================================================
echo.
pause
