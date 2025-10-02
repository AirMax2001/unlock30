@echo off
echo ====================================
echo    VERIFICA PERSISTENZA DATI
echo ====================================
echo.

if exist "backend\data\gameData.json" (
    echo [OK] File gameData.json trovato!
    echo.
    echo Contenuto del file:
    echo ========================
    type "backend\data\gameData.json"
    echo.
    echo ========================
) else (
    echo [ERRORE] File gameData.json non trovato!
    echo Il backend potrebbe non essere mai stato avviato.
)

echo.
if exist "backend\data\users.json" (
    echo [OK] File users.json trovato!
) else (
    echo [ERRORE] File users.json non trovato!
)

echo.
echo ====================================
echo    CONTROLLO PROCESSI ATTIVI
echo ====================================
echo.

tasklist /FI "IMAGENAME eq node.exe" | find "node.exe" >nul
if %errorlevel% == 0 (
    echo [OK] Backend in esecuzione:
    tasklist /FI "IMAGENAME eq node.exe"
) else (
    echo [ATTENZIONE] Nessun processo Node.js attivo
    echo Il backend potrebbe non essere in esecuzione
)

echo.
pause
