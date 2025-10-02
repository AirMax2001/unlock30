@echo off
echo ====================================
echo    SISTEMA CROSS-DEVICE LOCALE
echo ====================================
echo.

echo 1. Ottengo l'IP locale...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr "IPv4"') do set LOCAL_IP=%%i
for /f "tokens=1" %%i in ("%LOCAL_IP%") do set LOCAL_IP=%%i
echo [INFO] IP locale: %LOCAL_IP%

echo.
echo 2. Configuro frontend per IP locale...
echo // Configurazione per cross-device locale > "frontend\src\config.js"
echo const config = { >> "frontend\src\config.js"
echo   development: { >> "frontend\src\config.js"
echo     API_BASE_URL: 'http://%LOCAL_IP%:3001', >> "frontend\src\config.js"
echo     STORAGE_TYPE: 'api' >> "frontend\src\config.js"
echo   }, >> "frontend\src\config.js"
echo   production: { >> "frontend\src\config.js"
echo     API_BASE_URL: 'http://%LOCAL_IP%:3001', >> "frontend\src\config.js"
echo     STORAGE_TYPE: 'api' >> "frontend\src\config.js"
echo   } >> "frontend\src\config.js"
echo } >> "frontend\src\config.js"
echo const environment = 'development' >> "frontend\src\config.js"
echo export default config[environment] >> "frontend\src\config.js"

echo.
echo 3. Avvio backend cross-device...
cd backend
start /B node server.js
cd ..

echo.
echo 4. Avvio frontend...
cd frontend
start /B npm run serve
cd ..

echo.
echo ====================================
echo    CROSS-DEVICE ATTIVO!
echo ====================================
echo.
echo 🖥️  Dal PC principale:
echo     http://localhost:8080
echo.
echo 📱 Da altri dispositivi nella stessa rete:
echo     http://%LOCAL_IP%:8080
echo.
echo 🎯 Ora tutti i dispositivi vedranno:
echo     ✅ Stesse scene e modifiche
echo     ✅ Stesse immagini caricate
echo     ✅ Sincronizzazione in tempo reale
echo.
echo ⚠️  IMPORTANTE: 
echo     - Dispositivi devono essere sulla stessa WiFi
echo     - Firewall Windows potrebbe bloccare - permettere l'accesso
echo.
pause
