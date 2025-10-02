const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Avviando il deployment...');

// Percorsi importanti
const backendPublicDir = path.join(__dirname, 'backend', 'public');
const indexHtmlPath = path.join(backendPublicDir, 'index.html');

// Funzione per controllare se i file del frontend sono pronti
function checkFrontendFiles() {
  return fs.existsSync(indexHtmlPath);
}

// Funzione per eseguire il build se necessario
async function buildIfNeeded() {
  if (!checkFrontendFiles()) {
    console.log('📦 File del frontend non trovati, eseguendo il build...');
    
    return new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
        shell: true
      });
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Build completato con successo');
          resolve();
        } else {
          console.error('❌ Build fallito');
          reject(new Error(`Build process exited with code ${code}`));
        }
      });
    });
  } else {
    console.log('✅ File del frontend già presenti');
  }
}

// Funzione per avviare il server
function startServer() {
  console.log('🚀 Avviando il server...');
  const serverProcess = spawn('node', ['backend/server.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

// Esegui il processo
async function main() {
  try {
    await buildIfNeeded();
    startServer();
  } catch (error) {
    console.error('💥 Errore durante l\'avvio:', error);
    process.exit(1);
  }
}

main();
