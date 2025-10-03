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
    
    const commands = [
      'git add backend/data/ backend/uploads/',
      `git commit -m "${message} - ${new Date().toISOString()}"`,
      'git push origin main'
    ];
    
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        exec(cmd, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
          if (error) {
            console.log(`[BACKUP] Comando ${cmd}: ${error.message}`);
          } else {
            console.log(`[BACKUP] Comando ${cmd}: OK`);
          }
        });
      }, index * 2000); // Aspetta 2 secondi tra ogni comando
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
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`[WRITE] File scritto con successo: ${filePath}`);
    
    // BACKUP AUTOMATICO OGNI VOLTA CHE SI SALVANO I DATI
    if (filePath === gameDataPath) {
      backupToGit('Aggiornamento dati gioco');
    }
    
    return true;
  } catch (error) {
    console.error(`[WRITE] Errore nella scrittura del file ${filePath}:`, error);
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

// Visualizzatore JSON via browser
app.get('/api/game/json-viewer', (req, res) => {
  console.log('[API] Richiesta visualizzazione JSON');
  const gameData = readJsonFile(gameDataPath);
  
  if (!gameData) {
    return res.status(500).send('<h1>Errore nel caricamento dei dati</h1>');
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UNLOCK30 - JSON Viewer</title>
      <style>
        body { 
          font-family: monospace; 
          background: #1e1e1e; 
          color: #d4d4d4; 
          padding: 20px; 
          margin: 0;
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        .header { 
          background: #2d3748; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stats { 
          display: flex; 
          gap: 20px; 
          color: #68d391;
        }
        .json-content { 
          background: #2d3748; 
          padding: 20px; 
          border-radius: 8px; 
          overflow: auto;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.4;
        }
        .refresh-btn {
          background: #4299e1;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        .refresh-btn:hover { background: #3182ce; }
      </style>
      <script>
        function autoRefresh() {
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
        autoRefresh();
      </script>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 UNLOCK30 - JSON Data Viewer</h1>
          <div class="stats">
            <span>📊 Scene: ${gameData.scenes ? gameData.scenes.length : 0}</span>
            <span>🕐 Aggiornato: ${new Date().toLocaleString('it-IT')}</span>
            <a href="/api/game/json-viewer" class="refresh-btn">🔄 Aggiorna</a>
          </div>
        </div>
        <div class="json-content">${JSON.stringify(gameData, null, 2)}</div>
        <div style="margin-top: 20px; text-align: center; color: #68d391;">
          ⚡ Auto-refresh attivo ogni 5 secondi
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
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
