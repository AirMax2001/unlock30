// Servizio per gestire i dati del gioco senza backend
// Salva tutto nel localStorage del browser

class LocalGameService {
  constructor() {
    this.GAME_DATA_KEY = 'ilGiocoDeiTrenta_gameData'
    this.ADMIN_AUTH_KEY = 'ilGiocoDeiTrenta_adminAuth'
    this.UPLOADED_FILES_KEY = 'ilGiocoDeiTrenta_uploadedFiles'
    
    // Inizializza i dati se non esistono
    this.initializeGameData()
  }

  // Inizializza i dati di default
  initializeGameData() {
    const existingData = localStorage.getItem(this.GAME_DATA_KEY)
    
    if (!existingData) {
      const defaultData = {
        scenes: [
          {
            id: 1,
            title: "Benvenuto nel Gioco dei Trenta",
            description: "Questa è la prima scena del tuo gioco. Puoi modificarla nell'area admin! Usa il pulsante Admin in alto a destra con username: 000 e password: 000",
            image: "",
            video: "",
            isFinal: false,
            choices: [
              { id: 1, text: "Esplora la casa misteriosa", nextSceneId: 2 },
              { id: 2, text: "Vai nel giardino", nextSceneId: 3 }
            ]
          },
          {
            id: 2,
            title: "La Casa Misteriosa",
            description: "Entri in una casa abbandonata. L'aria è densa di mistero...",
            image: "",
            video: "",
            isFinal: false,
            choices: [
              { id: 1, text: "Sali al piano superiore", nextSceneId: 4 },
              { id: 2, text: "Esplora la cantina", nextSceneId: 5 }
            ]
          },
          {
            id: 3,
            title: "Il Giardino Incantato",
            description: "Ti trovi in un giardino magico con piante luminose...",
            image: "",
            video: "",
            isFinal: true,
            choices: []
          },
          {
            id: 4,
            title: "Il Piano Superiore",
            description: "Trovi una stanza piena di libri antichi e una scrivania...",
            image: "",
            video: "",
            isFinal: true,
            choices: []
          },
          {
            id: 5,
            title: "La Cantina Segreta",
            description: "Nella cantina scopri un passaggio segreto che conduce a un tesoro nascosto!",
            image: "",
            video: "",
            isFinal: true,
            choices: []
          }
        ]
      }
      
      localStorage.setItem(this.GAME_DATA_KEY, JSON.stringify(defaultData))
    }
  }

  // Simula chiamata API per ottenere i dati del gioco
  async getGameData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(this.GAME_DATA_KEY)
        resolve(JSON.parse(data))
      }, 100) // Simula latenza di rete
    })
  }

  // Simula login admin
  async adminLogin(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === '000' && password === '000') {
          localStorage.setItem(this.ADMIN_AUTH_KEY, 'true')
          resolve({ success: true, message: 'Login effettuato con successo' })
        } else {
          reject({ response: { data: { message: 'Credenziali non valide' } } })
        }
      }, 500)
    })
  }

  // Verifica se admin è autenticato
  isAdminAuthenticated() {
    return localStorage.getItem(this.ADMIN_AUTH_KEY) === 'true'
  }

  // Logout admin
  adminLogout() {
    localStorage.removeItem(this.ADMIN_AUTH_KEY)
  }

  // Salva i dati del gioco
  async saveGameData(gameData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(this.GAME_DATA_KEY, JSON.stringify(gameData))
        resolve({ success: true, message: 'Dati salvati con successo' })
      }, 200)
    })
  }

  // Ottieni una scena specifica
  async getScene(sceneId) {
    const gameData = await this.getGameData()
    const scene = gameData.scenes.find(s => s.id === parseInt(sceneId))
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (scene) {
          resolve(scene)
        } else {
          reject({ response: { status: 404, data: { error: 'Scena non trovata' } } })
        }
      }, 100)
    })
  }

  // Crea o aggiorna una scena
  async saveScene(sceneData) {
    const gameData = await this.getGameData()
    const sceneIndex = gameData.scenes.findIndex(s => s.id === sceneData.id)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (sceneIndex !== -1) {
          // Aggiorna scena esistente
          gameData.scenes[sceneIndex] = { ...gameData.scenes[sceneIndex], ...sceneData }
        } else {
          // Nuova scena
          if (!sceneData.id) {
            const maxId = Math.max(...gameData.scenes.map(s => s.id), 0)
            sceneData.id = maxId + 1
          }
          gameData.scenes.push(sceneData)
        }
        
        localStorage.setItem(this.GAME_DATA_KEY, JSON.stringify(gameData))
        resolve({ success: true, scene: sceneData })
      }, 200)
    })
  }

  // Elimina una scena
  async deleteScene(sceneId) {
    const gameData = await this.getGameData()
    
    return new Promise((resolve) => {
      setTimeout(() => {
        gameData.scenes = gameData.scenes.filter(s => s.id !== parseInt(sceneId))
        localStorage.setItem(this.GAME_DATA_KEY, JSON.stringify(gameData))
        resolve({ success: true, message: 'Scena eliminata con successo' })
      }, 200)
    })
  }

  // Simula upload di file (converte in base64 e salva localmente)
  async uploadFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject({ response: { data: { error: 'Nessun file selezionato' } } })
        return
      }

      const reader = new FileReader()
      
      reader.onload = () => {
        const base64 = reader.result
        const fileName = `${Date.now()}-${file.name}`
        const fileUrl = `local://${fileName}`
        
        // Salva il file nel localStorage
        const uploadedFiles = JSON.parse(localStorage.getItem(this.UPLOADED_FILES_KEY) || '{}')
        uploadedFiles[fileName] = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          url: fileUrl
        }
        localStorage.setItem(this.UPLOADED_FILES_KEY, JSON.stringify(uploadedFiles))
        
        resolve({ success: true, fileUrl: fileUrl })
      }
      
      reader.onerror = () => {
        reject({ response: { data: { error: 'Errore nella lettura del file' } } })
      }
      
      reader.readAsDataURL(file)
    })
  }

  // Ottieni URL di un file locale
  getFileData(fileName) {
    const uploadedFiles = JSON.parse(localStorage.getItem(this.UPLOADED_FILES_KEY) || '{}')
    return uploadedFiles[fileName]?.data || null
  }

  // Pulisci tutti i dati (per reset)
  clearAllData() {
    localStorage.removeItem(this.GAME_DATA_KEY)
    localStorage.removeItem(this.ADMIN_AUTH_KEY)
    localStorage.removeItem(this.UPLOADED_FILES_KEY)
    this.initializeGameData()
  }

  // Esporta dati per backup
  exportData() {
    return {
      gameData: JSON.parse(localStorage.getItem(this.GAME_DATA_KEY) || '{}'),
      uploadedFiles: JSON.parse(localStorage.getItem(this.UPLOADED_FILES_KEY) || '{}')
    }
  }

  // Importa dati da backup
  importData(exportedData) {
    if (exportedData.gameData) {
      localStorage.setItem(this.GAME_DATA_KEY, JSON.stringify(exportedData.gameData))
    }
    if (exportedData.uploadedFiles) {
      localStorage.setItem(this.UPLOADED_FILES_KEY, JSON.stringify(exportedData.uploadedFiles))
    }
  }
}

// Esporta istanza singleton
export default new LocalGameService()
