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
    
    // Prima prova con API GitHub (più affidabile)
    backupViaGitHubAPI(githubToken, githubOwner, githubRepo, message)
      .catch(error => {
        console.log('[BACKUP] ❌ API GitHub fallita, provo con Git locale:', error.message);
        // Fallback a Git locale
        backupViaGitLocal(githubToken, githubOwner, githubRepo, message);
      });
  } else {
    console.log('[BACKUP] Modalità sviluppo - backup Git disabilitato');
  }
};

// Backup tramite API GitHub
const backupViaGitHubAPI = async (token, owner, repo, message) => {
  console.log('[BACKUP-API] Usando API GitHub...');
  
  try {
    // Leggi il file gameData.json
    const gameDataContent = fs.readFileSync(gameDataPath, 'utf8');
    const base64Content = Buffer.from(gameDataContent).toString('base64');
    
    // API GitHub per aggiornare il file
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/backend/data/gameData.json`;
    
    // Prima ottieni l'SHA del file esistente
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Render-Backup-Bot'
      }
    });
    
    let sha = null;
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
      console.log('[BACKUP-API] File esistente trovato, SHA:', sha);
    } else {
      console.log('[BACKUP-API] File non trovato, verrà creato nuovo');
    }
    
    // Aggiorna il file
    const updateData = {
      message: `${message} - ${new Date().toISOString()}`,
      content: base64Content,
      branch: 'main'
    };
    
    if (sha) {
      updateData.sha = sha;
    }
    
    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Render-Backup-Bot',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('[BACKUP-API] ✅ File aggiornato su GitHub:', result.commit.sha);
      return result;
    } else {
      const error = await updateResponse.text();
      throw new Error(`HTTP ${updateResponse.status}: ${error}`);
    }
    
  } catch (error) {
    console.error('[BACKUP-API] ❌ Errore:', error.message);
    throw error;
  }
};

// Backup tramite Git locale (fallback)
const backupViaGitLocal = (githubToken, githubOwner, githubRepo, message) => {
  console.log('[BACKUP-GIT] Usando Git locale come fallback...');
  
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
          console.log(`[BACKUP-GIT] ❌ Comando ${index + 1}/${commands.length}: ${error.message}`);
          if (stderr) console.log(`[BACKUP-GIT] stderr: ${stderr}`);
        } else {
          console.log(`[BACKUP-GIT] ✅ Comando ${index + 1}/${commands.length}: OK`);
          if (stdout) console.log(`[BACKUP-GIT] stdout: ${stdout}`);
        }
      });
    }, index * 3000); // Aspetta 3 secondi tra ogni comando
  });
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

// SISTEMA BACKUP MULTIPLO DI EMERGENZA
const createEmergencyBackup = (data, reason = 'backup') => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, 'data', 'backups');
    
    // Crea directory backup se non esiste
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Salva backup con timestamp
    const backupPath = path.join(backupDir, `gameData-${reason}-${timestamp}.json`);
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(backupPath, jsonString, { encoding: 'utf8' });
    
    console.log(`[EMERGENCY-BACKUP] ✅ Backup salvato: ${backupPath}`);
    
    // Mantieni solo gli ultimi 10 backup per evitare overflow
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('gameData-') && file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (backupFiles.length > 10) {
      backupFiles.slice(10).forEach(file => {
        fs.unlinkSync(path.join(backupDir, file));
        console.log(`[EMERGENCY-BACKUP] 🗑️ Backup vecchio eliminato: ${file}`);
      });
    }
    
    return backupPath;
  } catch (error) {
    console.error('[EMERGENCY-BACKUP] ❌ Errore nel backup di emergenza:', error);
    return null;
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
  
  // BACKUP DI EMERGENZA PRIMA DEL SALVATAGGIO
  const currentData = readJsonFile(gameDataPath);
  if (currentData && currentData.scenes && currentData.scenes.length > 0) {
    createEmergencyBackup(currentData, 'pre-save');
    console.log(`[API] 🛡️ Backup pre-salvataggio creato (${currentData.scenes.length} scene)`);
  }
  
  // BACKUP DEI NUOVI DATI
  createEmergencyBackup(gameData, 'new-data');
  console.log(`[API] 💾 Backup nuovi dati creato (${gameData.scenes.length} scene)`);
  
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

// ENDPOINT DI EMERGENZA PER RECUPERO BACKUP
app.get('/api/emergency/backups', (req, res) => {
  console.log('[API] 🚨 Richiesta lista backup di emergenza');
  
  try {
    const backupDir = path.join(__dirname, 'data', 'backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.json({ backups: [], message: 'Nessun backup trovato' });
    }
    
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('gameData-') && file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        return {
          filename: file,
          created: stats.birthtime,
          size: stats.size,
          scenes: data.scenes ? data.scenes.length : 0,
          lastModified: data.stats ? data.stats.lastModified : 'Unknown'
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));
    
    res.json({ backups: backupFiles });
  } catch (error) {
    console.error('[API] ❌ Errore nel recupero backup:', error);
    res.status(500).json({ error: 'Errore nel recupero backup' });
  }
});

app.get('/api/emergency/backup/:filename', (req, res) => {
  console.log(`[API] 🚨 Richiesta backup specifico: ${req.params.filename}`);
  
  try {
    const backupPath = path.join(__dirname, 'data', 'backups', req.params.filename);
    
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Backup non trovato' });
    }
    
    const backupData = readJsonFile(backupPath);
    res.json(backupData);
  } catch (error) {
    console.error('[API] ❌ Errore nel caricamento backup:', error);
    res.status(500).json({ error: 'Errore nel caricamento backup' });
  }
});

app.post('/api/emergency/restore/:filename', (req, res) => {
  console.log(`[API] 🚨 Richiesta ripristino backup: ${req.params.filename}`);
  
  try {
    const backupPath = path.join(__dirname, 'data', 'backups', req.params.filename);
    
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: 'Backup non trovato' });
    }
    
    const backupData = readJsonFile(backupPath);
    
    // Crea backup dei dati attuali prima del ripristino
    const currentData = readJsonFile(gameDataPath);
    if (currentData) {
      createEmergencyBackup(currentData, 'before-restore');
    }
    
    // Ripristina il backup
    const success = writeJsonFile(gameDataPath, backupData);
    
    if (success) {
      console.log(`[API] ✅ Backup ripristinato: ${req.params.filename}`);
      res.json({ success: true, message: 'Backup ripristinato con successo', scenes: backupData.scenes.length });
    } else {
      res.status(500).json({ error: 'Errore nel ripristino del backup' });
    }
  } catch (error) {
    console.error('[API] ❌ Errore nel ripristino backup:', error);
    res.status(500).json({ error: 'Errore nel ripristino backup' });
  }
});

// Endpoint per testare il backup Git
app.post('/api/test-backup', async (req, res) => {
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
    
    // Test diretto dell'API GitHub
    try {
      console.log('[TEST-BACKUP] Testando API GitHub...');
      const result = await backupViaGitHubAPI(githubToken, githubOwner, githubRepo, 'Test backup manuale API');
      
      res.json({ 
        success: true, 
        message: 'Test backup API completato con successo',
        method: 'GitHub API',
        result: result ? 'File aggiornato' : 'Errore',
        config: {
          owner: githubOwner,
          repo: githubRepo,
          hasToken: !!githubToken,
          nodeEnv: process.env.NODE_ENV,
          forceBackup: process.env.FORCE_BACKUP
        }
      });
    } catch (apiError) {
      console.log('[TEST-BACKUP] API fallita, provo backup normale...');
      
      // Fallback al backup normale
      backupToGit('Test backup manuale fallback');
      
      res.json({ 
        success: true, 
        message: 'API fallita, backup normale avviato',
        method: 'Git Local Fallback',
        apiError: apiError.message,
        config: {
          owner: githubOwner,
          repo: githubRepo,
          hasToken: !!githubToken,
          nodeEnv: process.env.NODE_ENV,
          forceBackup: process.env.FORCE_BACKUP
        }
      });
    }
  } catch (error) {
    console.error('[API] ❌ Errore test backup:', error);
    res.status(500).json({ error: 'Errore nel test backup', details: error.message });
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
