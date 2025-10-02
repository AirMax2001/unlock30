<template>
  <div class="admin-container">
    <!-- Header -->
    <div class="admin-header">
      <h1><i class="fas fa-cog"></i> Pannello Admin</h1>
      <div class="header-actions">
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
import localGameService from '../services/localGameService'

export default {
  name: 'Admin',
  data() {
    return {
      loading: true,
      scenes: [],
      selectedScene: null,
      saving: false,
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
  },
  methods: {
    checkAuth() {
      if (!localGameService.isAdminAuthenticated()) {
        this.$router.push('/')
      }
    },

    async loadScenes() {
      this.loading = true
      console.log('[FRONTEND] Inizio caricamento scene')
      try {
        const gameData = await localGameService.getGameData()
        console.log('[FRONTEND] Dati ricevuti:', gameData)
        this.scenes = gameData.scenes || []
        console.log('[FRONTEND] Scene caricate:', this.scenes.length)
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
        await localGameService.deleteScene(sceneId)
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
        
        const response = await localGameService.saveScene(sceneData)
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
        const response = await axios.post('/api/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.selectedScene.image = response.data.fileUrl
        this.showToast('success', 'Immagine caricata con successo', 'fas fa-check')
      } catch (error) {
        this.showToast('error', 'Errore nel caricamento dell\'immagine', 'fas fa-exclamation-triangle')
      }
    },

    async uploadVideo(event) {
      const file = event.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post('/api/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.selectedScene.video = response.data.fileUrl
        this.showToast('success', 'Video caricato con successo', 'fas fa-check')
      } catch (error) {
        this.showToast('error', 'Errore nel caricamento del video', 'fas fa-exclamation-triangle')
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

<style scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.admin-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-preview, .btn-home {
  background: linear-gradient(45deg, #3498db, #2980b9);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-preview:hover, .btn-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.admin-content {
  display: flex;
  min-height: calc(100vh - 80px);
}

.sidebar {
  width: 300px;
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  overflow-y: auto;
}

.sidebar-section h3 {
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.btn-add-scene {
  width: 100%;
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  border: none;
  color: white;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.btn-add-scene:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.scenes-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.scene-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scene-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.scene-item.active {
  background: linear-gradient(45deg, #3498db, #2980b9);
}

.scene-item.final {
  border: 2px solid #f1c40f;
  box-shadow: 0 0 10px rgba(241, 196, 15, 0.3);
}

.scene-overview {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.available-scenes h4 {
  margin-bottom: 15px;
  color: #3498db;
  font-size: 1.1rem;
}

.scenes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.scene-chip {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.scene-chip.current {
  background: linear-gradient(45deg, #3498db, #2980b9);
  border-color: #2980b9;
}

.scene-chip.final {
  border-color: #f1c40f;
  box-shadow: 0 0 8px rgba(241, 196, 15, 0.4);
}

.chip-id {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

.chip-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.final-icon {
  color: #f1c40f;
  font-size: 0.8rem;
}

.choice-item-enhanced {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.choice-number {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 25px;
}

.choice-text-section {
  flex: 2;
  min-width: 250px;
}

.choice-text-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #3498db;
  font-size: 0.9rem;
}

.choice-text-input-enhanced {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.choice-text-input-enhanced:focus {
  outline: none;
  border-color: #3498db;
}

.choice-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 200px;
}

.scene-selector label,
.destination-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #3498db;
  font-size: 0.9rem;
}

.available-ids {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.id-chip {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 0.9rem;
}

.id-chip:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.id-chip.selected {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  border-color: #27ae60;
}

.id-chip.final {
  border-color: #f1c40f;
}

.destination-box {
  position: relative;
}

.destination-number {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  text-align: center;
  font-weight: 700;
  transition: all 0.3s ease;
}

.destination-number.valid {
  border-color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
}

.destination-number.invalid {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.destination-info {
  margin-top: 8px;
  font-size: 0.85rem;
  padding: 5px 8px;
  border-radius: 5px;
}

.valid-destination {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid rgba(39, 174, 96, 0.3);
}

.invalid-destination {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.btn-remove-choice-enhanced {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
  margin-top: 25px;
  flex-shrink: 0;
}

.btn-remove-choice-enhanced:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

.final-scene-info {
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.1), rgba(243, 156, 18, 0.1));
  border: 2px solid rgba(241, 196, 15, 0.3);
}

.final-scene-info h3 {
  color: #f1c40f;
  display: flex;
  align-items: center;
  gap: 10px;
}

.final-message {
  background: rgba(241, 196, 15, 0.1);
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #f1c40f;
}

.final-message p {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.6;
}

.final-message p:last-child {
  margin-bottom: 0;
}

.final-message i {
  color: #f1c40f;
  margin-top: 2px;
  flex-shrink: 0;
}

.scene-info h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.scene-info p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.final-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(45deg, #f1c40f, #f39c12);
  color: #2c3e50;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 4px;
}

.btn-delete {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #c0392b;
}

.main-editor {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  opacity: 0.7;
}

.no-selection i {
  font-size: 4rem;
  margin-bottom: 20px;
}

.scene-editor {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.scene-header-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.scene-id-badge {
  background: linear-gradient(45deg, #3498db, #2980b9);
  padding: 15px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.id-label {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 500;
}

.id-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.editor-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.editor-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-final {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-final.active {
  background: linear-gradient(45deg, #f1c40f, #f39c12);
  color: #2c3e50;
}

.btn-final:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-save {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.form-section h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
  color: #3498db;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group input::placeholder, .form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.media-upload {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.upload-section label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
}

.upload-area {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  position: relative;
}

.btn-upload {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.current-media {
  margin-top: 15px;
  position: relative;
  display: inline-block;
}

.media-preview {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
}

.btn-remove {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  border: none;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.choices-editor {
  space-y: 15px;
}

.btn-add-choice {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add-choice:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
}

.toast.error {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .admin-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    max-height: 300px;
  }
  
  .media-upload {
    grid-template-columns: 1fr;
  }
  
  .choice-item-enhanced {
    flex-direction: column;
    align-items: stretch;
  }
  
  .choice-number {
    align-self: flex-start;
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .choice-controls {
    flex-direction: row;
    min-width: auto;
  }
  
  .scene-header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .editor-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .scene-header-info {
    width: 100%;
    align-items: center;
    text-align: center;
  }
  
  .editor-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .choice-controls {
    flex-direction: column;
  }
  
  .available-ids {
    justify-content: center;
  }
  
  .scenes-grid {
    justify-content: center;
  }
}
</style>
