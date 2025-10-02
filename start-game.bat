@echo off
echo ====================================
echo    IL GIOCO DEI TRENTA - SETUP
echo ====================================
echo.
echo Questo script avviera' entrambi i server necessari
echo per far funzionare Il Gioco dei Trenta in locale.
echo.
echo Backend (Node.js): http://localhost:3001
echo Frontend (Vue.js): http://localhost:8080
echo Produzione: http://maristellacichella.altervista.org/
echo.
echo Premi un tasto per continuare...
pause > nul

echo.
echo 1. Avvio del Backend...
start cmd /k "cd backend && npm install && npm start"

echo.
echo 2. Attendo 5 secondi prima di avviare il frontend...
timeout /t 5 /nobreak > nul

echo.
echo 3. Avvio del Frontend...
start cmd /k "cd frontend && npm install && npm run serve"

echo.
echo ====================================
echo I server sono in avvio!
echo.
echo Una volta completato l'avvio:
echo - Locale: http://localhost:8080
echo - Online: http://maristellacichella.altervista.org/
echo - Per accedere come admin usa:
echo   Username: 000
echo   Password: 000
echo.
echo NOTA: Per deployare online esegui 'build-production.bat'
echo e carica il contenuto di 'dist\public_html' su Altervista
echo ====================================
echo.
pause
