@echo off
echo ====================================
echo    STOP BACKEND
echo ====================================
echo.
echo Ricerca e chiusura processi Node.js...

FOR /F "tokens=2" %%i IN ('tasklist /FI "IMAGENAME eq node.exe" ^| find "node.exe"') DO (
    echo Chiusura processo Node.js con PID %%i
    taskkill /PID %%i /F
)

echo.
echo ====================================
echo    BACKEND FERMATO!
echo ====================================
echo.
echo Tutti i processi Node.js sono stati terminati.
echo.
pause
