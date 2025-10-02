@echo off
echo ====================================
echo    AVVIO BACKEND PERSISTENTE
echo ====================================
echo.
echo Avvio del backend in background...
echo Il backend rimarrà attivo anche dopo aver chiuso questa finestra.
echo.

cd backend
echo Installazione dipendenze...
call npm install
echo.

echo Avvio server in background...
start /B node server-with-backup.js

echo.
echo ====================================
echo    BACKEND AVVIATO!
echo ====================================
echo.
echo Il backend è ora attivo su http://localhost:3001
echo Per fermarlo, usa stop-backend.bat
echo.
pause
