const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting frontend build and copy process...');

// Funzione per eseguire un comando con error handling
function runCommand(command, options = {}) {
  try {
    console.log(`Executing: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
    return result;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    throw error;
  }
}

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

try {
  // Check if we're in a build process (skip if dist already exists and is recent)
  const frontendDist = path.join(__dirname, 'frontend', 'dist');
  const backendPublic = path.join(__dirname, 'backend', 'public');
  
  // Only build if dist doesn't exist or if this is explicitly a build process
  if (!fs.existsSync(frontendDist) || process.argv.includes('--force-build')) {
    console.log('📦 Building frontend...');
    
    // Change to frontend directory
    process.chdir(path.join(__dirname, 'frontend'));
    
    // Try different approaches to run the build
    try {
      // First try with npx
      runCommand('npx vue-cli-service build');
    } catch (error1) {
      console.log('⚠️  npx failed, trying with yarn...');
      try {
        runCommand('yarn build');
      } catch (error2) {
        console.log('⚠️  yarn failed, trying with npm...');
        try {
          runCommand('npm run build');
        } catch (error3) {
          console.log('⚠️  All build methods failed, trying to fix permissions...');
          
          // Try to fix permissions and retry
          runCommand('chmod +x node_modules/.bin/vue-cli-service || true', { stdio: 'pipe' });
          runCommand('npx vue-cli-service build');
        }
      }
    }
    
    // Change back to root directory
    process.chdir(__dirname);
  } else {
    console.log('✅ Frontend dist already exists, skipping build');
  }

  // Copy files
  if (fs.existsSync(frontendDist)) {
    console.log('📁 Copying files from frontend/dist to backend/public...');
    
    // Rimuovi la directory public se esiste
    if (fs.existsSync(backendPublic)) {
      fs.rmSync(backendPublic, { recursive: true, force: true });
    }
    
    // Copia i file
    copyDir(frontendDist, backendPublic);
    console.log('✅ Files copied successfully!');
  } else {
    console.error('❌ Frontend dist directory not found after build.');
    process.exit(1);
  }
  
} catch (error) {
  console.error('💥 Build process failed:', error.message);
  process.exit(1);
}
