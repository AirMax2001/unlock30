const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, 'public')));

// Configurazione multer per upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Percorsi dei file JSON
const gameDataPath = path.join(__dirname, 'data', 'gameData.json');
const usersPath = path.join(__dirname, 'data', 'users.json');

// Crea directory data se non esiste
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// FUNZIONE BACKUP AUTOMATICO SU GIT
const backupToGit = (message = 'Auto-backup dati gioco') => {
  if (process.env.NODE_ENV === 'production' || process.env.FORCE_BACKUP === 'true') {
    console.log('[BACKUP] Backup automatico su Git...');
    
    // Configurazione Git con token (prende dalle variabili di ambiente)
    const githubToken = process.env.GITHUB_TOKEN || process.env.VUE_APP_GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER || process.env.VUE_APP_GITHUB_OWNER || 'AirMax2001';
    const githubRepo = process.env.GITHUB_REPO || process.env.VUE_APP_GITHUB_REPO || 'unlock30';
    
    if (!githubToken) {
      console.log('[BACKUP] ❌ Token GitHub non trovato nelle variabili di ambiente');
      return;
    }
    
    const repoUrl = `https://${githubToken}@github.com/${githubOwner}/${githubRepo}.git`;
    
    const commands = [
      'git config user.name "Render Auto-Backup"',
      'git config user.email "backup@render.com"',
      'git add backend/data/ backend/uploads/',
      `git commit -m "${message} - ${new Date().toISOString()}" || echo "Nothing to commit"`,
      `git remote set-url origin ${repoUrl}`,
      'git push origin main'
    ];
    
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        exec(cmd, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
          if (error) {
            console.log(`[BACKUP] ❌ Comando ${index + 1}/${commands.length}: ${error.message}`);
            if (stderr) console.log(`[BACKUP] stderr: ${stderr}`);
          } else {
            console.log(`[BACKUP] ✅ Comando ${index + 1}/${commands.length}: OK`);
            if (stdout) console.log(`[BACKUP] stdout: ${stdout}`);
          }
        });
      }, index * 3000); // Aspetta 3 secondi tra ogni comando
    });
  } else {
    console.log('[BACKUP] Modalità sviluppo - backup Git disabilitato');
  }
};

// Inizializza file JSON se non esistono
if (!fs.existsSync(gameDataPath)) {
  const initialGameData = {
    scenes: [
      {
        id: 1,
        title: "Scena Iniziale",
        description: "Benvenuto nel Gioco dei Trenta! Inizia la tua avventura...",
        image: "",
        video: "",
        choices: [
          {
            id: 1,
            text: "Inizia l'avventura",
            nextSceneId: 2
          }
        ],
        isFinal: false
      }
    ]
  };
  writeJsonFile(gameDataPath, initialGameData);
}

if (!fs.existsSync(usersPath)) {
  const initialUsers = {
    admins: [
      {
        username: "admin",
        password: "admin123"
      }
    ]
  };
  writeJsonFile(usersPath, initialUsers);
}

// Funzioni helper
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`[READ] File letto con successo: ${filePath}`);
    return JSON.parse(data);
  } catch (error) {
    console.error(`[READ] Errore nella lettura del file ${filePath}:`, error);
    return null;
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    // Assicura che la directory esista
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Scrittura SINCRONA e FORZATA del file
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, { encoding: 'utf8', flag: 'w' });
    
    // Forza il flush sul disco
    const fd = fs.openSync(filePath, 'r+');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    
    console.log(`[WRITE] ✅ File salvato e sincronizzato: ${filePath}`);
    console.log(`[WRITE] 📄 Dimensione: ${jsonString.length} caratteri`);
    console.log(`[WRITE] 🕐 Timestamp: ${new Date().toISOString()}`);
    
    // BACKUP AUTOMATICO OGNI VOLTA CHE SI SALVANO I DATI
    if (filePath === gameDataPath) {
      backupToGit('Aggiornamento automatico dati gioco');
    }
    
    return true;
  } catch (error) {
    console.error(`[WRITE] ❌ Errore nella scrittura del file ${filePath}:`, error);
    return false;
  }
};

// Routes

// Login admin
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJsonFile(usersPath);
  
  if (!users) {
    return res.status(500).json({ error: 'Errore nel caricamento utenti' });
  }
  
  const admin = users.admins.find(a => a.username === username && a.password === password);
  
  if (admin) {
    res.json({ success: true, message: 'Login effettuato con successo' });
  } else {
    res.status(401).json({ success: false, message: 'Credenziali non valide' });
  }
});

// Ottieni dati del gioco
app.get('/api/game/data', (req, res) => {
  console.log('[API] Richiesta dati del gioco ricevuta');
  const gameData = readJsonFile(gameDataPath);
  
  if (!gameData) {
    return res.status(500).json({ error: 'Errore nel caricamento dei dati del gioco' });
  }
  
  res.json(gameData);
});

// Salva dati del gioco
app.post('/api/game/data', (req, res) => {
  console.log('[API] Richiesta di salvataggio dati ricevuta');
  const gameData = req.body;
  
  // Validazione base
  if (!gameData || !gameData.scenes || !Array.isArray(gameData.scenes)) {
    return res.status(400).json({ error: 'Dati del gioco non validi' });
  }
  
  const success = writeJsonFile(gameDataPath, gameData);
  
  if (success) {
    res.json({ success: true, message: 'Dati salvati con successo' });
  } else {
    res.status(500).json({ error: 'Errore nel salvataggio dei dati' });
  }
});

// Endpoint per forzare il salvataggio immediato
app.post('/api/game/force-save', (req, res) => {
  console.log('[API] ⚡ FORCE SAVE richiesto');
  
  try {
    const currentData = readJsonFile(gameDataPath);
    if (!currentData) {
      return res.status(500).json({ error: 'Impossibile leggere i dati attuali' });
    }
    
    // Forza riscrittura con sync
    const success = writeJsonFile(gameDataPath, currentData);
    
    if (success) {
      console.log('[API] ✅ Force save completato');
      res.json({ success: true, message: 'Force save completato' });
    } else {
      res.status(500).json({ error: 'Errore nel force save' });
    }
  } catch (error) {
    console.error('[API] ❌ Errore force save:', error);
    res.status(500).json({ error: 'Errore interno nel force save' });
  }
});

// Endpoint per testare il backup Git
app.post('/api/test-backup', (req, res) => {
  console.log('[API] 🔧 Test backup Git richiesto');
  
  try {
    // Verifica variabili di ambiente
    const githubToken = process.env.GITHUB_TOKEN || process.env.VUE_APP_GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER || process.env.VUE_APP_GITHUB_OWNER || 'AirMax2001';
    const githubRepo = process.env.GITHUB_REPO || process.env.VUE_APP_GITHUB_REPO || 'unlock30';
    
    console.log(`[TEST-BACKUP] Owner: ${githubOwner}`);
    console.log(`[TEST-BACKUP] Repo: ${githubRepo}`);
    console.log(`[TEST-BACKUP] Token presente: ${githubToken ? 'Sì' : 'No'}`);
    console.log(`[TEST-BACKUP] NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`[TEST-BACKUP] FORCE_BACKUP: ${process.env.FORCE_BACKUP}`);
    
    // Forza il backup
    backupToGit('Test backup manuale');
    
    res.json({ 
      success: true, 
      message: 'Test backup avviato',
      config: {
        owner: githubOwner,
        repo: githubRepo,
        hasToken: !!githubToken,
        nodeEnv: process.env.NODE_ENV,
        forceBackup: process.env.FORCE_BACKUP
      }
    });
  } catch (error) {
    console.error('[API] ❌ Errore test backup:', error);
    res.status(500).json({ error: 'Errore nel test backup' });
  }
});

// Upload di file (immagini e video)
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('[UPLOAD] Richiesta upload file ricevuta');
  
  if (!req.file) {
    return res.status(400).json({ error: 'Nessun file caricato' });
  }
  
  const filePath = `/uploads/${req.file.filename}`;
  console.log(`[UPLOAD] File caricato: ${filePath}`);
  
  // BACKUP AUTOMATICO QUANDO SI CARICA UN FILE
  backupToGit(`Upload file: ${req.file.originalname}`);
  
  res.json({ 
    success: true, 
    filePath: filePath,
    originalName: req.file.originalname,
    filename: req.file.filename
  });
});

// Lista file uploads
app.get('/api/uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    return res.json({ files: [] });
  }
  
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileList = files
      .filter(filename => !filename.endsWith('.md')) // Escludi README.md
      .map(filename => ({
        filename,
        path: `/uploads/${filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${filename}`
      }));
    
    res.json({ files: fileList });
  } catch (error) {
    console.error('[UPLOADS] Errore nel listare i file:', error);
    res.status(500).json({ error: 'Errore nel recupero dei file' });
  }
});

// Elimina file upload
app.delete('/api/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[DELETE] File eliminato: ${filename}`);
      
      // BACKUP AUTOMATICO QUANDO SI ELIMINA UN FILE
      backupToGit(`Eliminato file: ${filename}`);
      
      res.json({ success: true, message: 'File eliminato con successo' });
    } else {
      res.status(404).json({ error: 'File non trovato' });
    }
  } catch (error) {
    console.error('[DELETE] Errore nell\'eliminazione del file:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione del file' });
  }
});

// Endpoint per backup manuale
app.post('/api/backup', (req, res) => {
  console.log('[BACKUP] Richiesta backup manuale');
  backupToGit('Backup manuale richiesto');
  res.json({ success: true, message: 'Backup avviato' });
});

// Recupera backup dal Git
app.post('/api/restore', (req, res) => {
  console.log('[RESTORE] Richiesta ripristino dati');
  
  exec('git pull origin main', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      console.error('[RESTORE] Errore nel ripristino:', error);
      res.status(500).json({ error: 'Errore nel ripristino dei dati' });
    } else {
      console.log('[RESTORE] Dati ripristinati con successo');
      res.json({ success: true, message: 'Dati ripristinati dal backup' });
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Catch all per servire il frontend
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend non trovato' });
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Errore server:', error);
  res.status(500).json({ error: 'Errore interno del server' });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Server con backup automatico in esecuzione su porta ${PORT}`);
  console.log(`📁 Directory dati: ${dataDir}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Backup automatico: ${process.env.NODE_ENV === 'production' ? 'ATTIVO' : 'DISABILITATO (dev)'}`);
  
  // Backup iniziale all'avvio
  setTimeout(() => {
    backupToGit('Server avviato - backup iniziale');
  }, 5000);
});
