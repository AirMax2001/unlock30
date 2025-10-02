const fs = require('fs');
const path = require('path');

// Funzione per copiare ricorsivamente una directory
function copyDir(src, dest) {
  // Crea la directory di destinazione se non esiste
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Legge il contenuto della directory sorgente
  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      // Se è una directory, copia ricorsivamente
      copyDir(srcPath, destPath);
    } else {
      // Se è un file, copialo
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Percorsi
const frontendDist = path.join(__dirname, 'frontend', 'dist');
const backendPublic = path.join(__dirname, 'backend', 'public');

// Controlla se la directory dist esiste
if (fs.existsSync(frontendDist)) {
  console.log('Copiando files da frontend/dist a backend/public...');
  
  // Rimuovi la directory public se esiste
  if (fs.existsSync(backendPublic)) {
    fs.rmSync(backendPublic, { recursive: true, force: true });
  }
  
  // Copia i file
  copyDir(frontendDist, backendPublic);
  console.log('Files copiati con successo!');
} else {
  console.error('Directory frontend/dist non trovata. Esegui prima il build del frontend.');
  process.exit(1);
}
