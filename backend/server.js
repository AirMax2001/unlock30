const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

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
        isFinal: false,
        choices: [
          { id: 1, text: "Inizia l'avventura", nextSceneId: 2 },
          { id: 2, text: "Esplora i dintorni", nextSceneId: 3 }
        ]
      }
    ]
  };
  fs.writeFileSync(gameDataPath, JSON.stringify(initialGameData, null, 2));
}

if (!fs.existsSync(usersPath)) {
  const initialUsers = {
    admins: [
      { username: "000", password: "000" }
    ]
  };
  fs.writeFileSync(usersPath, JSON.stringify(initialUsers, null, 2));
}

// Helper functions
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Errore nella lettura del file:', error);
    return null;
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    console.log(`[WRITE] Tentativo di scrittura file: ${filePath}`);
    console.log(`[WRITE] Dati da scrivere:`, JSON.stringify(data, null, 2));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`[WRITE] File scritto con successo: ${filePath}`);
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
  console.log('[GET] Richiesta dati del gioco');
  const gameData = readJsonFile(gameDataPath);
  if (gameData) {
    console.log(`[GET] Dati caricati con successo. Scene trovate: ${gameData.scenes ? gameData.scenes.length : 0}`);
    res.json(gameData);
  } else {
    console.error('[GET] Errore nel caricamento dati del gioco');
    res.status(500).json({ error: 'Errore nel caricamento dati del gioco' });
  }
});

// Ottieni singola scena
app.get('/api/game/scene/:id', (req, res) => {
  const sceneId = parseInt(req.params.id);
  const gameData = readJsonFile(gameDataPath);
  
  if (!gameData) {
    return res.status(500).json({ error: 'Errore nel caricamento dati del gioco' });
  }
  
  const scene = gameData.scenes.find(s => s.id === sceneId);
  
  if (scene) {
    res.json(scene);
  } else {
    res.status(404).json({ error: 'Scena non trovata' });
  }
});

// Aggiorna dati del gioco (admin)
app.put('/api/admin/game/data', (req, res) => {
  const gameData = req.body;
  
  if (writeJsonFile(gameDataPath, gameData)) {
    res.json({ success: true, message: 'Dati aggiornati con successo' });
  } else {
    res.status(500).json({ error: 'Errore nell\'aggiornamento dei dati' });
  }
});

// Aggiungi nuova scena (admin)
app.post('/api/admin/game/scene', (req, res) => {
  const newScene = req.body;
  
  console.log('[CREATE] Richiesta creazione nuova scena');
  console.log('[CREATE] Dati ricevuti:', JSON.stringify(newScene, null, 2));
  
  const gameData = readJsonFile(gameDataPath);
  
  if (!gameData) {
    console.error('[CREATE] Errore nel caricamento dati del gioco');
    return res.status(500).json({ error: 'Errore nel caricamento dati del gioco' });
  }
  
  // Genera nuovo ID se non presente
  if (!newScene.id) {
    const maxId = Math.max(...gameData.scenes.map(s => s.id), 0);
    newScene.id = maxId + 1;
    console.log(`[CREATE] Generato nuovo ID: ${newScene.id}`);
  }
  
  console.log(`[CREATE] Scene esistenti prima dell'aggiunta:`, gameData.scenes.map(s => ({ id: s.id, title: s.title })));
  
  gameData.scenes.push(newScene);
  
  if (writeJsonFile(gameDataPath, gameData)) {
    console.log(`[CREATE] Scena ${newScene.id} creata con successo`);
    console.log(`[CREATE] Totale scene dopo aggiunta: ${gameData.scenes.length}`);
    res.json({ success: true, scene: newScene });
  } else {
    console.error(`[CREATE] Errore nell'aggiunta della scena ${newScene.id}`);
    res.status(500).json({ error: 'Errore nell\'aggiunta della scena' });
  }
});

// Aggiorna scena esistente (admin)
app.put('/api/admin/game/scene/:id', (req, res) => {
  const sceneId = parseInt(req.params.id);
  const updatedScene = req.body;
  
  console.log(`[UPDATE] Tentativo di aggiornamento scena ID: ${sceneId}`);
  console.log(`[UPDATE] Dati ricevuti:`, JSON.stringify(updatedScene, null, 2));
  
  const gameData = readJsonFile(gameDataPath);
  
  if (!gameData) {
    console.error('[UPDATE] Errore nel caricamento dati del gioco');
    return res.status(500).json({ error: 'Errore nel caricamento dati del gioco' });
  }
  
  const sceneIndex = gameData.scenes.findIndex(s => s.id === sceneId);
  
  if (sceneIndex === -1) {
    console.log(`[UPDATE] Scena ID ${sceneId} non trovata. Scene esistenti:`, gameData.scenes.map(s => s.id));
    // Se la scena non esiste, creala come nuova scena
    console.log(`[UPDATE] Creazione di nuova scena con ID ${sceneId}`);
    updatedScene.id = sceneId;
    gameData.scenes.push(updatedScene);
    
    if (writeJsonFile(gameDataPath, gameData)) {
      console.log(`[UPDATE] Nuova scena ${sceneId} creata con successo`);
      res.json({ success: true, scene: updatedScene });
    } else {
      console.error(`[UPDATE] Errore nella creazione della scena ${sceneId}`);
      res.status(500).json({ error: 'Errore nella creazione della scena' });
    }
  } else {
    // Aggiorna scena esistente
    console.log(`[UPDATE] Aggiornamento scena esistente ID ${sceneId} all'indice ${sceneIndex}`);
    gameData.scenes[sceneIndex] = { ...gameData.scenes[sceneIndex], ...updatedScene };
    
    if (writeJsonFile(gameDataPath, gameData)) {
      console.log(`[UPDATE] Scena ${sceneId} aggiornata con successo`);
      res.json({ success: true, scene: gameData.scenes[sceneIndex] });
    } else {
      console.error(`[UPDATE] Errore nell'aggiornamento della scena ${sceneId}`);
      res.status(500).json({ error: 'Errore nell\'aggiornamento della scena' });
    }
  }
});

// Elimina scena (admin)
app.delete('/api/admin/game/scene/:id', (req, res) => {
  const sceneId = parseInt(req.params.id);
  const gameData = readJsonFile(gameDataPath);
  
  if (!gameData) {
    return res.status(500).json({ error: 'Errore nel caricamento dati del gioco' });
  }
  
  gameData.scenes = gameData.scenes.filter(s => s.id !== sceneId);
  
  if (writeJsonFile(gameDataPath, gameData)) {
    res.json({ success: true, message: 'Scena eliminata con successo' });
  } else {
    res.status(500).json({ error: 'Errore nell\'eliminazione della scena' });
  }
});

// Upload file (admin)
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nessun file caricato' });
  }
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, fileUrl: fileUrl });
});

// Salva dati del gioco
app.post('/api/game/data', (req, res) => {
  console.log('[POST] Richiesta salvataggio dati del gioco');
  const gameData = req.body;
  
  if (!gameData) {
    return res.status(400).json({ error: 'Dati del gioco mancanti' });
  }
  
  // Aggiungi timestamp di ultimo aggiornamento
  if (!gameData.stats) {
    gameData.stats = {};
  }
  gameData.stats.lastModified = new Date().toISOString();
  gameData.stats.totalScenes = gameData.scenes ? gameData.scenes.length : 0;
  
  const success = writeJsonFile(gameDataPath, gameData);
  if (success) {
    console.log(`[POST] Dati salvati con successo. Scene: ${gameData.scenes ? gameData.scenes.length : 0}`);
    res.json({ success: true, message: 'Dati salvati con successo', data: gameData });
  } else {
    console.error('[POST] Errore nel salvataggio dati del gioco');
    res.status(500).json({ error: 'Errore nel salvataggio dati del gioco' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('[HEALTH] Controllo stato del server');
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    message: 'Server backend funzionante'
  });
});

// Handle SPA routing - must be after API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  // Check if index.html exists
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      // If index.html doesn't exist, send a fallback response
      res.status(503).send(`
        <html>
          <head><title>Service Starting</title></head>
          <body>
            <h1>Service is starting...</h1>
            <p>The application is being deployed. Please wait a moment and refresh the page.</p>
            <script>setTimeout(() => location.reload(), 5000);</script>
          </body>
        </html>
      `);
    } else {
      res.sendFile(indexPath);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione su porta ${PORT}`);
});
