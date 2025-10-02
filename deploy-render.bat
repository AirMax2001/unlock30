@echo off
echo ====================================
echo    DEPLOY SU RENDER CON BACKUP
echo ====================================
echo.

echo 1. Verifico se ci sono modifiche locali...
git status --porcelain > nul
if %errorlevel% neq 0 (
    echo [ATTENZIONE] Ci sono modifiche non salvate!
    echo Salvo tutto su Git prima del deploy...
    
    git add .
    git commit -m "Backup automatico prima del deploy - %date% %time%"
    echo [OK] Backup locale completato
) else (
    echo [OK] Repository Git aggiornato
)

echo.
echo 2. Sincronizzazione con il repository remoto...
git push origin main
if %errorlevel% neq 0 (
    echo [ERRORE] Impossibile sincronizzare con Git remoto
    echo Controlla la connessione e i permessi
    pause
    exit /b 1
)

echo.
echo 3. Backup dei dati correnti...
if exist "backend\data\gameData.json" (
    echo [BACKUP] Copio i dati attuali...
    if not exist "backup" mkdir "backup"
    copy "backend\data\gameData.json" "backup\gameData_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.json" > nul
    echo [OK] Backup dati creato in cartella backup\
) else (
    echo [INFO] Nessun dato da salvare (primo deploy)
)

echo.
echo 4. Preparazione build per produzione...
cd frontend
echo [BUILD] Compilazione frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRORE] Build del frontend fallita
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ====================================
echo    DEPLOY COMPLETATO!
echo ====================================
echo.
echo 🎉 Tutto pronto per Render!
echo.
echo 📋 CHECKLIST POST-DEPLOY:
echo ✅ Codice sincronizzato su Git
echo ✅ Build di produzione creata
echo ✅ Backup dati locale salvato
echo.
echo 🔗 Prossimi passi:
echo 1. Vai su render.com
echo 2. Connetti il repository GitHub
echo 3. Configura le variabili d'ambiente
echo 4. Deploy automatico attivato!
echo.
echo ⚠️  IMPORTANTE: Dopo il deploy, usa i pulsanti
echo    'Backup' e 'Ripristina' nell'admin per
echo    sincronizzare i dati tra locale e cloud.
echo.
pause
