@echo off
echo ====================================
echo    BUILD PER PRODUZIONE
echo ====================================
echo.
echo Compilazione per maristellacichella.altervista.org
echo.

echo 1. Build del Frontend...
cd frontend
call npm run build
echo.

echo 2. Preparazione files di produzione...
if not exist "..\dist" mkdir "..\dist"
if not exist "..\dist\public_html" mkdir "..\dist\public_html"

echo Copia frontend compilato...
xcopy /E /I /Y "dist\*" "..\dist\public_html\"
cd ..

echo 3. Copia Backend...
if not exist "dist\backend" mkdir "dist\backend"
xcopy /E /I /Y "backend\*" "dist\backend\"
xcopy /Y "backend\package.json" "dist\public_html\"
xcopy /Y "backend\server.js" "dist\public_html\"

echo 4. Creazione struttura Altervista...
if not exist "dist\public_html\data" mkdir "dist\public_html\data"
if not exist "dist\public_html\uploads" mkdir "dist\public_html\uploads"

echo.
echo ====================================
echo BUILD COMPLETATO!
echo.
echo Files pronti per Altervista nella cartella 'dist\public_html':
echo - index.html (pagina principale)
echo - css/ js/ (assets frontend)
echo - server.js package.json (backend)
echo - data/ (file JSON del gioco)
echo - uploads/ (immagini e video)
echo.
echo ISTRUZIONI PER ALTERVISTA:
echo 1. Carica tutto il contenuto di 'dist\public_html' nella cartella public_html del tuo spazio
echo 2. Nel pannello Altervista, abilita Node.js
echo 3. Imposta server.js come file principale
echo 4. Il sito sarà disponibile su maristellacichella.altervista.org
echo ====================================
echo.
pause
