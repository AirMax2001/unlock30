<template>
  <div class="admin-container animated-red-background">
    <!-- Header -->
    <div class="admin-header">
      <h1><i class="fas fa-cog"></i> Pannello Admin</h1>
      <div class="header-actions">
        <button class="btn-preview" @click="refreshData" :disabled="loading">
          <i :class="['fas', loading ? 'fa-spinner fa-spin' : 'fa-sync-alt']"></i> 
          {{ loading ? 'Aggiornamento...' : 'Aggiorna' }}
        </button>
        <button class="btn-preview" @click="previewGame">
          <i class="fas fa-eye"></i> Anteprima Gioco
        </button>
        <button class="btn-home" @click="goHome">
          <i class="fas fa-home"></i> Home
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Caricamento pannello admin...</p>
    </div>

    <!-- Contenuto principale -->
    <div v-else class="admin-content">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>Gestione Scene</h3>
          <button class="btn-add-scene" @click="addNewScene">
            <i class="fas fa-plus"></i> Nuova Scena
          </button>
        </div>
        
        <div class="scenes-list">
          <div 
            v-for="scene in scenes" 
            :key="scene.id"
            @click="selectScene(scene)"
            :class="['scene-item', { active: selectedScene?.id === scene.id, final: scene.isFinal }]"
          >
            <div class="scene-info">
              <h4>{{ scene.title || 'Scena senza titolo' }}</h4>
              <p>ID: {{ scene.id }}</p>
              <span v-if="scene.isFinal" class="final-badge">
                <i class="fas fa-flag-checkered"></i> Finale
              </span>
            </div>
            <button @click.stop="deleteScene(scene.id)" class="btn-delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Editor principale -->
      <div class="main-editor">
        <div v-if="!selectedScene" class="no-selection">
          <i class="fas fa-mouse-pointer"></i>
          <h3>Seleziona una scena per modificarla</h3>
          <p>Oppure crea una nuova scena cliccando su "Nuova Scena"</p>
        </div>

        <div v-else class="scene-editor">
          <div class="editor-header">
            <div class="scene-header-info">
              <div class="scene-id-badge">
                <span class="id-label">ID:</span>
                <span class="id-number">{{ selectedScene.id }}</span>
              </div>
              <h2>{{ selectedScene.title || 'Senza titolo' }}</h2>
            </div>
            <div class="editor-actions">
              <button @click="toggleFinalScene" :class="['btn-final', { active: selectedScene.isFinal }]">
                <i class="fas fa-flag-checkered"></i>
                {{ selectedScene.isFinal ? 'Scena Finale' : 'Rendi Finale' }}
              </button>
              <button @click="saveScene" class="btn-save" :disabled="saving">
                <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-save"></i>
                {{ saving ? 'Salvataggio...' : 'Salva' }}
              </button>
            </div>
          </div>

          <div class="editor-content">
            <!-- Informazioni base -->
            <div class="form-section">
              <h3>Informazioni Base</h3>
              <div class="form-group">
                <label>Titolo della Scena:</label>
                <input 
                  type="text" 
                  v-model="selectedScene.title" 
                  placeholder="Inserisci il titolo della scena"
                >
              </div>
              <div class="form-group">
                <label>Descrizione:</label>
                <textarea 
                  v-model="selectedScene.description" 
                  placeholder="Inserisci la descrizione della scena"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <!-- Media -->
            <div class="form-section">
              <h3>Media</h3>
              <div class="media-upload">
                <div class="upload-section">
                  <label>Immagine:</label>
                  <div class="upload-area">
                    <input 
                      type="file" 
                      @change="uploadImage"
                      accept="image/*"
                      ref="imageInput"
                      style="display: none"
                    >
                    <button @click="$refs.imageInput.click()" class="btn-upload">
                      <i class="fas fa-image"></i> Carica Immagine
                    </button>
                    <div v-if="selectedScene.image" class="current-media">
                      <img :src="getMediaUrl(selectedScene.image)" alt="Anteprima" class="media-preview">
                      <button @click="removeImage" class="btn-remove">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="upload-section">
                  <label>Video:</label>
                  <div class="upload-area">
                    <input 
                      type="file" 
                      @change="uploadVideo"
                      accept="video/*"
                      ref="videoInput"
                      style="display: none"
                    >
                    <button @click="$refs.videoInput.click()" class="btn-upload">
                      <i class="fas fa-video"></i> Carica Video
                    </button>
                    <div v-if="selectedScene.video" class="current-media">
                      <video :src="getMediaUrl(selectedScene.video)" class="media-preview" controls></video>
                      <button @click="removeVideo" class="btn-remove">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scelte -->
            <div v-if="!selectedScene.isFinal" class="form-section">
              <h3>Scelte e Collegamenti</h3>
              <div class="scene-overview">
                <div class="available-scenes">
                  <h4>Scene Disponibili:</h4>
                  <div class="scenes-grid">
                    <div 
                      v-for="scene in scenes" 
                      :key="scene.id"
                      :class="['scene-chip', { current: scene.id === selectedScene.id, final: scene.isFinal }]"
                    >
                      <span class="chip-id">{{ scene.id }}</span>
                      <span class="chip-title">{{ scene.title || 'Senza titolo' }}</span>
                      <i v-if="scene.isFinal" class="fas fa-flag-checkered final-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="choices-editor">
                <div 
                  v-for="(choice, index) in selectedScene.choices" 
                  :key="choice.id || index"
                  class="choice-item-enhanced"
                >
                  <div class="choice-number">{{ index + 1 }}</div>
                  <div class="choice-text-section">
                    <label>Testo della scelta:</label>
                    <input 
                      type="text" 
                      v-model="choice.text" 
                      placeholder="Inserisci il testo della scelta..."
                      class="choice-text-input-enhanced"
                    >
                  </div>
                  <div class="choice-controls">
                    <div class="scene-selector">
                      <label>Scene disponibili:</label>
                      <div class="available-ids">
                        <span 
                          v-for="scene in scenes.filter(s => s.id !== selectedScene.id)" 
                          :key="scene.id"
                          @click="setChoiceDestination(choice, scene.id)"
                          :class="['id-chip', { selected: choice.nextSceneId === scene.id, final: scene.isFinal }]"
                          :title="scene.title"
                        >
                          {{ scene.id }}
                          <i v-if="scene.isFinal" class="fas fa-flag-checkered"></i>
                        </span>
                      </div>
                    </div>
                    <div class="destination-input">
                      <label>Vai alla scena:</label>
                      <div class="destination-box">
                        <input 
                          type="number" 
                          v-model.number="choice.nextSceneId" 
                          placeholder="ID"
                          class="destination-number"
                          :class="{ invalid: choice.nextSceneId && !isValidSceneId(choice.nextSceneId), valid: choice.nextSceneId && isValidSceneId(choice.nextSceneId) }"
                        >
                        <div v-if="choice.nextSceneId" class="destination-info">
                          <span v-if="isValidSceneId(choice.nextSceneId)" class="valid-destination">
                            <i class="fas fa-check"></i>
                            {{ getSceneTitle(choice.nextSceneId) }}
                          </span>
                          <span v-else class="invalid-destination">
                            <i class="fas fa-exclamation-triangle"></i>
                            Scena non trovata
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button @click="removeChoice(index)" class="btn-remove-choice-enhanced">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                
                <button @click="addChoice" class="btn-add-choice">
                  <i class="fas fa-plus"></i> Aggiungi Scelta
                </button>
              </div>
            </div>

            <!-- Messaggio per scene finali -->
            <div v-else class="form-section final-scene-info">
              <h3><i class="fas fa-flag-checkered"></i> Scena Finale</h3>
              <div class="final-message">
                <p><i class="fas fa-info-circle"></i> Questa è una scena finale. I giocatori che raggiungono questa scena vedranno il messaggio di fine gioco.</p>
                <p>Non è possibile aggiungere scelte a una scena finale. Se vuoi continuare la storia, disattiva prima l'opzione "Scena Finale".</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast messages -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      <i :class="toast.icon"></i>
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import gameService from '../services/gameService'
import axios from 'axios'
import config from '../config'

export default {
  name: 'Admin',
  data() {
    return {
      loading: true,
      scenes: [],
      selectedScene: null,
      saving: false,
      refreshInterval: null,
      toast: {
        show: false,
        type: '',
        message: '',
        icon: ''
      }
    }
  },
  mounted() {
    this.checkAuth()
    this.loadScenes()
    this.startAutoRefresh()
  },
  beforeUnmount() {
    this.stopAutoRefresh()
  },
  methods: {
    checkAuth() {
      if (!gameService.isAdminAuthenticated()) {
        this.$router.push('/')
      }
    },

    startAutoRefresh() {
      // Controlla aggiornamenti ogni 10 secondi
      this.refreshInterval = setInterval(() => {
        this.checkForUpdates()
      }, 10000)
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
      }
    },

    async checkForUpdates() {
      try {
        // Forza il refresh dei dati per controllare aggiornamenti
        const freshData = await gameService.forceRefresh()
        const currentSceneCount = this.scenes.length
        const newSceneCount = freshData.scenes.length
        
        // Se il numero di scene è cambiato, ricarica automaticamente
        if (newSceneCount !== currentSceneCount) {
          console.log('[AUTO-REFRESH] Rilevate modifiche, aggiornamento automatico...')
          await this.loadScenes()
          this.showToast('success', 'Dati aggiornati automaticamente', 'fas fa-sync-alt')
        }
      } catch (error) {
        console.error('[AUTO-REFRESH] Errore nel controllo aggiornamenti:', error)
      }
    },

    async loadScenes(forceRefresh = false) {
      this.loading = true
      console.log('[FRONTEND] Inizio caricamento scene')
      try {
        const gameData = await gameService.getGameData(forceRefresh)
        console.log('[FRONTEND] Dati ricevuti:', gameData)
        this.scenes = gameData.scenes || []
        console.log('[FRONTEND] Scene caricate:', this.scenes.length)
        
        // Mostra informazioni versione in console
        const versionInfo = gameService.getVersion()
        console.log('[VERSION] Versione attuale:', versionInfo.version, 'Ultimo aggiornamento:', versionInfo.lastUpdateFormatted)
      } catch (error) {
        console.error('[FRONTEND] Errore nel caricamento delle scene:', error)
        this.showToast('error', 'Errore nel caricamento delle scene', 'fas fa-exclamation-triangle')
      } finally {
        this.loading = false
      }
    },

    selectScene(scene) {
      this.selectedScene = { ...scene }
      if (!this.selectedScene.choices) {
        this.selectedScene.choices = []
      }
      // Assicurati che isFinal sia definito
      if (this.selectedScene.isFinal === undefined) {
        this.selectedScene.isFinal = false
      }
    },

    addNewScene() {
      const newScene = {
        id: Math.max(...this.scenes.map(s => s.id), 0) + 1,
        title: 'Nuova Scena',
        description: '',
        image: '',
        video: '',
        choices: [],
        isFinal: false
      }
      this.scenes.push(newScene)
      this.selectScene(newScene)
    },

    async deleteScene(sceneId) {
      if (!confirm('Sei sicuro di voler eliminare questa scena?')) return

      try {
        await gameService.deleteScene(sceneId)
        this.scenes = this.scenes.filter(s => s.id !== sceneId)
        if (this.selectedScene?.id === sceneId) {
          this.selectedScene = null
        }
        this.showToast('success', 'Scena eliminata con successo', 'fas fa-check')
      } catch (error) {
        this.showToast('error', 'Errore nell\'eliminazione della scena', 'fas fa-exclamation-triangle')
      }
    },

    async saveScene() {
      if (!this.selectedScene) return

      this.saving = true
      console.log('[FRONTEND] Inizio salvataggio scena:', this.selectedScene.id)
      
      try {
        const sceneData = { ...this.selectedScene }
        
        const response = await gameService.saveScene(sceneData)
        console.log('[FRONTEND] Risposta salvataggio:', response)
        
        // Aggiorna la lista locale
        const sceneIndex = this.scenes.findIndex(s => s.id === sceneData.id)
        if (sceneIndex !== -1) {
          this.scenes[sceneIndex] = sceneData
        } else {
          this.scenes.push(sceneData)
        }
        
        console.log('[FRONTEND] Salvataggio completato con successo')
        this.showToast('success', 'Scena salvata con successo', 'fas fa-check')
      } catch (error) {
        console.error('[FRONTEND] Errore nel salvataggio:', error)
        this.showToast('error', 'Errore nel salvataggio della scena', 'fas fa-exclamation-triangle')
      } finally {
        this.saving = false
      }
    },

    addChoice() {
      if (!this.selectedScene.choices) {
        this.selectedScene.choices = []
      }
      this.selectedScene.choices.push({
        id: Date.now(),
        text: '',
        nextSceneId: null
      })
    },

    removeChoice(index) {
      this.selectedScene.choices.splice(index, 1)
    },

    async uploadImage(event) {
      const file = event.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      try {
        const uploadUrl = config.API_BASE_URL ? `${config.API_BASE_URL}/api/admin/upload` : '/api/admin/upload'
        const response = await axios.post(uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.selectedScene.image = response.data.fileUrl
        this.showToast('success', 'Immagine caricata con successo', 'fas fa-check')
      } catch (error) {
        console.error('Errore upload immagine:', error)
        this.showToast('error', 'Errore nel caricamento dell\'immagine: ' + (error.response?.data?.error || error.message), 'fas fa-exclamation-triangle')
      }
    },

    async uploadVideo(event) {
      const file = event.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      try {
        const uploadUrl = config.API_BASE_URL ? `${config.API_BASE_URL}/api/admin/upload` : '/api/admin/upload'
        const response = await axios.post(uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.selectedScene.video = response.data.fileUrl
        this.showToast('success', 'Video caricato con successo', 'fas fa-check')
      } catch (error) {
        console.error('Errore upload video:', error)
        this.showToast('error', 'Errore nel caricamento del video: ' + (error.response?.data?.error || error.message), 'fas fa-exclamation-triangle')
      }
    },

    removeImage() {
      this.selectedScene.image = ''
    },

    removeVideo() {
      this.selectedScene.video = ''
    },

    getMediaUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return `${config.API_BASE_URL}${path}`
    },

    previewGame() {
      this.$router.push('/game')
    },

    async refreshData() {
      console.log('[MANUAL-REFRESH] Aggiornamento manuale richiesto')
      await this.loadScenes(true) // Forza refresh
      this.showToast('success', 'Dati aggiornati con successo', 'fas fa-sync-alt')
    },

    goHome() {
      localStorage.removeItem('adminAuth')
      this.$router.push('/')
    },

    showToast(type, message, icon) {
      this.toast = { show: true, type, message, icon }
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },

    toggleFinalScene() {
      this.selectedScene.isFinal = !this.selectedScene.isFinal
      
      // Se la scena diventa finale, rimuovi tutte le scelte
      if (this.selectedScene.isFinal && this.selectedScene.choices && this.selectedScene.choices.length > 0) {
        if (confirm('Rendendo questa scena finale, tutte le scelte verranno rimosse. Continuare?')) {
          this.selectedScene.choices = []
          console.log('[FRONTEND] Scelte rimosse per scena finale:', this.selectedScene.id)
        } else {
          // Se l'utente annulla, ripristina lo stato precedente
          this.selectedScene.isFinal = false
        }
      }
    },

    setChoiceDestination(choice, sceneId) {
      choice.nextSceneId = sceneId
    },

    isValidSceneId(sceneId) {
      return this.scenes.some(s => s.id === sceneId)
    },

    getSceneTitle(sceneId) {
      const scene = this.scenes.find(s => s.id === sceneId)
      return scene ? (scene.title || 'Senza titolo') : 'Scena non trovata'
    }
  }
}
</script>
