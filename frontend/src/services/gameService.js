// Servizio universale per gestire i dati del gioco
// Supporta sia localStorage che backend API

import config from '../config.js'

class GameService {
  constructor() {
    this.isApiMode = config.STORAGE_TYPE === 'api'
    this.apiBaseUrl = this.isApiMode ? config.API_BASE_URL : null
    this.cache = null
    this.cacheTimestamp = 0
    this.CACHE_DURATION = 2000 // Ridotto a 2 secondi per refresh più frequenti
    
    // Sistema di auto-save avanzato
    this.saveQueue = []
    this.isSaving = false
    this.lastSaveTime = 0
    this.saveDebounceTimer = null
    this.SAVE_DEBOUNCE_TIME = 500 // 500ms per salvataggio immediato
    this.FORCE_SAVE_INTERVAL = 5000 // Forza salvataggio ogni 5 secondi
    
    // Chiavi per localStorage
    this.GAME_DATA_KEY = 'ilGiocoDeiTrenta_gameData'
    this.VERSION_KEY = 'ilGiocoDeiTrenta_version'
    this.LAST_UPDATE_KEY = 'ilGiocoDeiTrenta_lastUpdate'
    
    console.log(`🎮 GameService inizializzato in modalità: ${this.isApiMode ? 'API Backend' : 'localStorage'}`)
    if (this.isApiMode) {
      console.log(`🌐 Backend URL: ${this.apiBaseUrl}`)
    }
    
    // Avvia il sistema di auto-save periodico
    this.startPeriodicSave()
  }

  // SISTEMA AUTO-SAVE AVANZATO

  startPeriodicSave() {
    // Auto-save forzato ogni 5 secondi se ci sono modifiche pending
    setInterval(() => {
      if (this.saveQueue.length > 0 && !this.isSaving) {
        console.log('🔄 Auto-save periodico forzato...')
        this.processSaveQueue()
      }
    }, this.FORCE_SAVE_INTERVAL)
  }

  debouncedSave(data, operation = 'update') {
    // Aggiunge alla coda di salvataggio
    this.saveQueue.push({ data, operation, timestamp: Date.now() })
    
    // Clear del timer precedente
    clearTimeout(this.saveDebounceTimer)
    
    // Nuovo timer con debounce
    this.saveDebounceTimer = setTimeout(() => {
      this.processSaveQueue()
    }, this.SAVE_DEBOUNCE_TIME)
  }

  async processSaveQueue() {
    if (this.isSaving || this.saveQueue.length === 0) return
    
    this.isSaving = true
    console.log(`💾 Processando ${this.saveQueue.length} operazioni di salvataggio...`)
    
    try {
      // Prende l'operazione più recente per ogni tipo
      const latestOperations = this.saveQueue.reduce((acc, op) => {
        acc[op.operation] = op // Sovrascrive con l'operazione più recente
        return acc
      }, {})
      
      // Esegue tutte le operazioni
      for (const operation of Object.values(latestOperations)) {
        await this.saveGameData(operation.data)
      }
      
      // Svuota la coda
      this.saveQueue = []
      this.lastSaveTime = Date.now()
      
      console.log('✅ Tutte le operazioni salvate con successo')
      
    } catch (error) {
      console.error('❌ Errore nel processare la coda di salvataggio:', error)
      // In caso di errore, mantiene i dati in coda per retry
    } finally {
      this.isSaving = false
    }
  }

  // METODI UNIVERSALI

  async loadGameData() {
    try {
      if (this.isDataFresh()) {
        console.log('📦 Dati dalla cache')
        return this.cache
      }

      let data
      if (this.isApiMode) {
        data = await this.loadFromApi()
      } else {
        data = this.loadFromLocalStorage()
      }
      
      // Normalizza i dati per assicurare la struttura corretta
      data = this.normalizeGameData(data)
      
      this.updateCache(data)
      return data
    } catch (error) {
      console.error('❌ Errore nel caricamento:', error)
      if (this.isApiMode && error.name === 'TypeError') {
        console.log('🔄 Fallback a localStorage per offline')
        return this.loadFromLocalStorage()
      }
      return this.getDefaultGameData()
    }
  }

  async saveGameData(gameData) {
    try {
      let result
      if (this.isApiMode) {
        // Prova salvataggio API con retry
        result = await this.saveToApiWithRetry(gameData)
      } else {
        result = this.saveToLocalStorage(gameData)
      }
      
      this.updateCache(gameData)
      this.updateVersion()
      console.log('💾 Dati salvati con successo')
      return result
    } catch (error) {
      console.error('❌ Errore nel salvataggio:', error)
      if (this.isApiMode) {
        console.log('🔄 Fallback a localStorage')
        return this.saveToLocalStorage(gameData)
      }
      throw error
    }
  }

  // Salvataggio API con retry automatico
  async saveToApiWithRetry(gameData, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🌐 Tentativo salvataggio ${attempt}/${maxRetries}...`)
        const result = await this.saveToApi(gameData)
        console.log(`✅ Salvataggio riuscito al tentativo ${attempt}`)
        return result
      } catch (error) {
        console.warn(`⚠️ Tentativo ${attempt} fallito:`, error.message)
        if (attempt === maxRetries) {
          throw error
        }
        // Aspetta prima del retry (500ms, 1s, 1.5s)
        await new Promise(resolve => setTimeout(resolve, attempt * 500))
      }
    }
  }

  // Forza salvataggio immediato
  async forceSave() {
    try {
      if (this.isApiMode) {
        console.log('⚡ FORCE SAVE su API...')
        const response = await fetch(`${this.apiBaseUrl}/api/game/force-save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('✅ Force save completato')
        return result
      }
    } catch (error) {
      console.error('❌ Errore force save:', error)
      throw error
    }
  }

  // Test backup Git
  async testBackup() {
    try {
      if (this.isApiMode) {
        console.log('🔧 Test backup Git...')
        const response = await fetch(`${this.apiBaseUrl}/api/test-backup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('✅ Test backup completato:', result)
        return result
      }
    } catch (error) {
      console.error('❌ Errore test backup:', error)
      throw error
    }
  }

  // METODI API

  async loadFromApi() {
    console.log('🌐 Caricamento dal backend...')
    const response = await fetch(`${this.apiBaseUrl}/api/game/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Dati caricati dal backend:', data.scenes?.length || 0, 'scene')
    
    // Correggi i percorsi delle immagini/video per includere il dominio completo
    if (data.scenes) {
      data.scenes.forEach(scene => {
        if (scene.image && !scene.image.startsWith('http') && !scene.image.startsWith(this.apiBaseUrl)) {
          scene.image = scene.image.startsWith('/') ? 
            `${this.apiBaseUrl}${scene.image}` : 
            `${this.apiBaseUrl}/${scene.image}`
        }
        if (scene.video && !scene.video.startsWith('http') && !scene.video.startsWith(this.apiBaseUrl)) {
          scene.video = scene.video.startsWith('/') ? 
            `${this.apiBaseUrl}${scene.video}` : 
            `${this.apiBaseUrl}/${scene.video}`
        }
      })
    }
    
    return data
  }

  async saveToApi(gameData) {
    console.log('🌐 Salvataggio sul backend...')
    const response = await fetch(`${this.apiBaseUrl}/api/game/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Dati salvati sul backend')
    return result
  }

  // METODI LOCALSTORAGE

  loadFromLocalStorage() {
    console.log('💾 Caricamento da localStorage...')
    const data = localStorage.getItem(this.GAME_DATA_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      console.log('✅ Dati caricati da localStorage:', parsed.scenes?.length || 0, 'scene')
      return parsed
    }
    console.log('📝 Creazione dati di default')
    return this.getDefaultGameData()
  }

  saveToLocalStorage(gameData) {
    console.log('💾 Salvataggio su localStorage...')
    localStorage.setItem(this.GAME_DATA_KEY, JSON.stringify(gameData))
    localStorage.setItem(this.LAST_UPDATE_KEY, Date.now().toString())
    console.log('✅ Dati salvati su localStorage')
    return gameData
  }

  // GESTIONE CACHE E VERSIONING

  updateCache(data) {
    this.cache = data
    this.cacheTimestamp = Date.now()
  }

  isDataFresh() {
    if (!this.cache) return false
    const age = Date.now() - this.cacheTimestamp
    return age < this.CACHE_DURATION
  }

  updateVersion() {
    if (this.isApiMode) return // Il backend gestisce le versioni
    
    const current = localStorage.getItem(this.VERSION_KEY) || '1.0.0'
    const parts = current.split('.').map(Number)
    parts[2]++
    const newVersion = parts.join('.')
    
    localStorage.setItem(this.VERSION_KEY, newVersion)
    localStorage.setItem(this.LAST_UPDATE_KEY, Date.now().toString())
  }

  async forceRefresh() {
    console.log('🔄 Force refresh...')
    this.cache = null
    this.cacheTimestamp = 0
    return await this.loadGameData()
  }

  // METODI UTILITY

  getDefaultGameData() {
    return {
      scenes: [],
      settings: {
        gameName: "Il Gioco dei Trenta",
        welcomeMessage: "Benvenuto nel gioco!",
        maxScenes: 30,
        theme: "unlock30"
      },
      stats: {
        totalScenes: 0,
        lastModified: new Date().toISOString()
      }
    }
  }

  // NORMALIZZAZIONE DATI

  normalizeGameData(data) {
    // Assicura che la struttura sia sempre corretta
    const normalized = {
      scenes: data.scenes || [],
      settings: {
        gameName: "Il Gioco dei Trenta",
        welcomeMessage: "Benvenuto nel gioco!",
        maxScenes: 30,
        theme: "unlock30",
        ...(data.settings || {})
      },
      stats: {
        totalScenes: data.scenes ? data.scenes.length : 0,
        lastModified: new Date().toISOString(),
        ...(data.stats || {})
      }
    }
    
    return normalized
  }

  // GESTIONE SCENE

  async getScenes() {
    const data = await this.loadGameData()
    return data.scenes || []
  }

  async saveScenes(scenes) {
    const data = await this.loadGameData()
    data.scenes = scenes
    
    // Assicurati che stats esista
    if (!data.stats) {
      data.stats = {}
    }
    
    data.stats.totalScenes = scenes.length
    data.stats.lastModified = new Date().toISOString()
    
    // Usa il sistema di auto-save migliorato
    this.debouncedSave(data, 'saveScenes')
    
    // Aggiorna la cache immediatamente per feedback istantaneo
    this.updateCache(data)
    
    return data
  }

  async saveScene(scene) {
    const data = await this.loadGameData()
    const sceneIndex = data.scenes.findIndex(s => s.id === scene.id)
    
    if (sceneIndex !== -1) {
      data.scenes[sceneIndex] = scene
    } else {
      data.scenes.push(scene)
    }
    
    data.stats.totalScenes = data.scenes.length
    data.stats.lastModified = new Date().toISOString()
    
    // Usa il sistema di auto-save migliorato
    this.debouncedSave(data, 'saveScene')
    
    // Aggiorna la cache immediatamente per feedback istantaneo
    this.updateCache(data)
    
    console.log(`💾 Scena ${scene.id} salvata (in coda)`)
    return scene
  }

  async addScene(scene) {
    scene.id = Date.now()
    scene.createdAt = new Date().toISOString()
    scene.lastModified = new Date().toISOString()
    
    const data = await this.loadGameData()
    data.scenes.push(scene)
    data.stats.totalScenes = data.scenes.length
    data.stats.lastModified = new Date().toISOString()
    
    // Usa il sistema di auto-save migliorato
    this.debouncedSave(data, 'addScene')
    
    // Aggiorna la cache immediatamente
    this.updateCache(data)
    
    console.log(`✅ Nuova scena ${scene.id} aggiunta (in coda)`)
    return scene
  }

  async addScene(scene) {
    const scenes = await this.getScenes()
    const newScene = {
      id: Date.now(),
      ...scene,
      createdAt: new Date().toISOString()
    }
    scenes.push(newScene)
    await this.saveScenes(scenes)
    return newScene
  }

  async updateScene(sceneId, updates) {
    const scenes = await this.getScenes()
    const index = scenes.findIndex(s => s.id === sceneId)
    if (index !== -1) {
      scenes[index] = { ...scenes[index], ...updates, updatedAt: new Date().toISOString() }
      await this.saveScenes(scenes)
      return scenes[index]
    }
    throw new Error('Scena non trovata')
  }

  async deleteScene(sceneId) {
    const scenes = await this.getScenes()
    const filtered = scenes.filter(s => s.id !== sceneId)
    await this.saveScenes(filtered)
    return true
  }

  // GESTIONE IMMAGINI

  async uploadImage(file) {
    if (!this.isApiMode) {
      // Modalità localStorage: converte in base64
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            id: Date.now(),
            name: file.name,
            data: e.target.result,
            type: 'base64',
            uploadedAt: new Date().toISOString()
          }
          resolve(imageData)
        }
        reader.readAsDataURL(file)
      })
    }

    // Modalità API: upload al backend
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${this.apiBaseUrl}/api/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Errore upload: ${response.status}`)
    }

    return await response.json()
  }

  // CONTROLLO CONNESSIONE

  async checkConnection() {
    if (!this.isApiMode) return { status: 'localStorage', online: true }
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/health`, {
        method: 'GET',
        timeout: 3000
      })
      return { status: 'online', online: response.ok }
    } catch (error) {
      return { status: 'offline', online: false, error: error.message }
    }
  }

  // GESTIONE AUTENTICAZIONE ADMIN (compatibilità)

  isAdminAuthenticated() {
    // Per ora accesso libero, può essere implementato localStorage o API
    return true
  }

  authenticateAdmin(password) {
    // Implementazione semplice per compatibilità
    return password === 'admin123' // TODO: implementare autenticazione vera
  }

  // COMPATIBILITÀ CON LOCALGAMESERVICE LEGACY

  async getGameData(forceRefresh = false) {
    if (forceRefresh) {
      return await this.forceRefresh()
    }
    return await this.loadGameData()
  }

  getVersion() {
    // Versione mock per compatibilità
    return {
      version: '2.0.0',
      lastUpdate: Date.now(),
      lastUpdateFormatted: new Date().toLocaleString()
    }
  }

  async saveScene(sceneData) {
    if (sceneData.id) {
      return await this.updateScene(sceneData.id, sceneData)
    } else {
      return await this.addScene(sceneData)
    }
  }

  // GESTIONE FILE DATA (compatibilità)

  getFileData(fileName) {
    // Per compatibilità con il vecchio sistema
    // Tenta di trovare il file nei localStorage o restituisce null
    try {
      const uploadedFiles = localStorage.getItem('ilGiocoDeiTrenta_uploadedFiles')
      if (uploadedFiles) {
        const files = JSON.parse(uploadedFiles)
        const file = files.find(f => f.name === fileName)
        return file ? file.data : null
      }
    } catch (error) {
      console.warn('Errore nel recupero file data:', error)
    }
    return null
  }

  // METODI PER BACKUP E CLOUD

  async createBackup() {
    if (this.isApiMode) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/backup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          console.log('✅ Backup automatico creato')
          return true
        }
      } catch (error) {
        console.error('❌ Errore nel backup:', error)
      }
    }
    return false
  }

  async restoreFromBackup() {
    if (this.isApiMode) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/restore`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          console.log('✅ Dati ripristinati dal backup')
          this.clearCache() // Forza ricaricamento
          return await this.loadGameData()
        }
      } catch (error) {
        console.error('❌ Errore nel ripristino:', error)
      }
    }
    return null
  }

  async uploadFile(file) {
    if (!this.isApiMode) {
      console.warn('⚠️ Upload file disponibile solo in modalità API')
      return null
    }

    try {
      const uploadUrl = `${this.apiBaseUrl}/api/upload`
      console.log(`📤 Upload URL: ${uploadUrl}`)
      console.log(`📤 API Base URL: ${this.apiBaseUrl}`)
      console.log(`📤 Is API Mode: ${this.isApiMode}`)
      
      const formData = new FormData()
      formData.append('file', file)

      console.log(`📤 Making request to: ${uploadUrl}`)

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      })

      console.log(`📡 Response status: ${response.status}`)
      console.log(`📡 Response URL: ${response.url}`)

      if (!response.ok) {
        throw new Error(`Upload fallito: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ File caricato:', result.filePath)
      
      // Crea backup automatico dopo upload
      await this.createBackup()
      
      return result.filePath
    } catch (error) {
      console.error('❌ Errore upload file:', error)
      throw error
    }
  }

  async getUploadedFiles() {
    if (!this.isApiMode) {
      return []
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/uploads`)
      if (response.ok) {
        const data = await response.json()
        return data.files || []
      }
    } catch (error) {
      console.error('❌ Errore nel recupero file:', error)
    }
    return []
  }
}

// Esporta istanza singleton
export default new GameService()
