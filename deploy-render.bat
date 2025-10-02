@echo off
echo ====================================
echo    DEPLOY SU RENDER CON UPLOAD
echo ====================================
echo.

echo 1. Backup del server attuale...
if exist "backend\server.js.backup" del "backend\server.js.backup"
copy "backend\server.js" "backend\server.js.backup"
echo [OK] Backup creato: server.js.backup

echo.
echo 2. Sostituisco server.js con la versione con upload...
copy "backend\server-with-backup.js" "backend\server.js"
echo [OK] server.js aggiornato con funzionalità upload

echo.
echo 3. Ripristino config per produzione...
copy "frontend\src\config.js" "frontend\src\config.js.dev.backup"
echo // Configurazione dell'ambiente > "frontend\src\config.js.temp"
echo const config = { >> "frontend\src\config.js.temp"
echo   development: { >> "frontend\src\config.js.temp"
echo     API_BASE_URL: 'http://localhost:3001', >> "frontend\src\config.js.temp"
echo     STORAGE_TYPE: 'api' >> "frontend\src\config.js.temp"
echo   }, >> "frontend\src\config.js.temp"
echo   production: { >> "frontend\src\config.js.temp"
echo     API_BASE_URL: window.location.origin, >> "frontend\src\config.js.temp"
echo     STORAGE_TYPE: 'api' >> "frontend\src\config.js.temp"
echo   } >> "frontend\src\config.js.temp"
echo } >> "frontend\src\config.js.temp"
echo const environment = process.env.NODE_ENV === 'development' ? 'development' : 'production' >> "frontend\src\config.js.temp"
echo export default config[environment] >> "frontend\src\config.js.temp"
move "frontend\src\config.js.temp" "frontend\src\config.js"
echo [OK] Config ripristinato per produzione

echo.
echo 4. Salvataggio su Git...
git add .
git commit -m "🚀 DEPLOY RENDER: Upload e backup automatico attivati - %date% %time%"
git push origin main
if %errorlevel% neq 0 (
    echo [ERRORE] Push Git fallito
    pause
    exit /b 1
)

echo.
echo 5. Build per produzione...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERRORE] Build frontend fallita
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
echo 🎉 Render si aggiornerà automaticamente!
echo.
echo 📋 COSA È STATO FATTO:
echo ✅ server.js sostituito con versione upload
echo ✅ Config produzione ripristinato  
echo ✅ Codice pushato su Git
echo ✅ Build di produzione creata
echo.
echo 🔗 Su Render ora funzioneranno:
echo ✅ Upload immagini/video
echo ✅ Backup automatico su Git
echo ✅ Sincronizzazione cross-device
echo.
echo ⏰ Attendi 2-3 minuti per il deploy automatico
echo 🌐 Poi testa su: https://unlock30.onrender.com
echo.
pause
