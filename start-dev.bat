@echo off
setlocal enabledelayedexpansion

REM Add Node.js to PATH
set PATH=C:\Program Files\nodejs;%PATH%

cd /d "c:\Users\andre\Documents\tunes\tunes\scripts\fiddlesource_-traditional-music-archive"

REM Start the dev server
npm run dev
