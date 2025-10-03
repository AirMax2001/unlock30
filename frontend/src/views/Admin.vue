<template>
  <div class="admin-container animated-red-background">
    <!-- Header -->
    <div class="admin-header">
      <!-- Indicatore di stato in alto a sinistra -->
      <div class="save-status-left" :class="saveStatus.class">
        <i :class="saveStatus.icon"></i>
        {{ saveStatus.text }}
      </div>
      
      <h1><i class="fas fa-cog"></i> Pannello Admin</h1>
      
      <div class="header-actions">
        <button 
          v-if="selectedScene" 
          @click="forceSave" 
          class="btn-force-save"
          title="Salva immediatamente"
          :disabled="loading"
        >
          <i class="fas fa-save"></i> Salva Ora
        </button>
        <button 
          @click="megaForceSave" 
          class="btn-mega-save"
          title="FORCE SAVE - Salvataggio garantito con verifica"
          :disabled="loading"
        >
          <i class="fas fa-database"></i> FORCE SAVE
        </button>
        <button 
          @click="testGitBackup" 
          class="btn-git-test"
          title="Test backup Git - Verifica sincronizzazione repository"
          :disabled="loading"
        >
          <i class="fab fa-github"></i> Test Git
        </button>
        <button class="btn-backup" @click="createBackup" :disabled="loading">
          <i class="fas fa-cloud-upload-alt"></i> Backup
        </button>
        <button class="btn-restore" @click="restoreBackup" :disabled="loading">
          <i class="fas fa-cloud-download-alt"></i> Ripristina
        </button>
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
        <button 
          @click="toggleJsonViewer" 
          class="btn-json-viewer"
          title="Visualizza JSON"
        >
          <i class="fas fa-code"></i> JSON
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
      <!-- JSON Viewer Overlay -->
      <div v-if="showJsonViewer" class="json-viewer-overlay" @click="closeJsonViewer">
        <div class="json-viewer-modal" @click.stop>
          <div class="json-viewer-header">
            <h3><i class="fas fa-code"></i> Dati JSON in Tempo Reale</h3>
            <button @click="closeJsonViewer" class="btn-close-json">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="json-viewer-content">
            <div class="json-stats">
              <span><i class="fas fa-database"></i> Scene: {{ scenes.length }}</span>
              <span><i class="fas fa-clock"></i> Ultimo aggiornamento: {{ formatTime(lastSaveTime) }}</span>
              <button @click="refreshJsonViewer" class="btn-refresh-json">
                <i class="fas fa-sync-alt"></i> Aggiorna
              </button>
            </div>
            <pre class="json-display">{{ formatJson(jsonViewerData) }}</pre>
          </div>
        </div>
      </div>

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
              <!-- Auto-save attivo - salvataggio automatico -->
              <div class="auto-save-info">
                <i class="fas fa-magic"></i>
                Auto-save attivo
              </div>
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

            <!-- Personalizzazione Stili -->
            <div class="form-section">
              <h3><i class="fas fa-palette"></i> Personalizzazione Stili</h3>
              <div class="style-editor">
                <div class="style-group">
                  <label>Stile Titolo:</label>
                  <div class="style-options">
                    <select v-model="selectedScene.titleStyle" @change="debouncedAutoSave">
                      <option value="">Predefinito</option>
                      <option value="dramatic">Drammatico</option>
                      <option value="elegant">Elegante</option>
                      <option value="horror">Horror</option>
                      <option value="sci-fi">Sci-Fi</option>
                      <option value="fantasy">Fantasy</option>
                    </select>
                  </div>
                </div>

                <div class="style-group">
                  <label>Colore Titolo:</label>
                  <div class="color-options">
                    <input 
                      type="color" 
                      v-model="selectedScene.titleColor" 
                      @change="debouncedAutoSave"
                      class="color-picker"
                    >
                    <span class="color-preview" :style="{ color: selectedScene.titleColor || '#ffffff' }">
                      {{ selectedScene.title || 'Anteprima Titolo' }}
                    </span>
                  </div>
                </div>

                <div class="style-group">
                  <label>Tema Sfondo:</label>
                  <div class="theme-options">
                    <div 
                      v-for="theme in backgroundThemes" 
                      :key="theme.value"
                      @click="selectedScene.backgroundTheme = theme.value; debouncedAutoSave()"
                      :class="['theme-option', { active: selectedScene.backgroundTheme === theme.value }]"
                      :style="{ background: theme.preview }"
                    >
                      <span>{{ theme.name }}</span>
                    </div>
                  </div>
                </div>

                <div class="style-group">
                  <label>Effetti Speciali:</label>
                  <div class="effects-options">
                    <label class="checkbox-option">
                      <input 
                        type="checkbox" 
                        v-model="selectedScene.effects.particles" 
                        @change="debouncedAutoSave"
                      >
                      <span>Particelle animate</span>
                    </label>
                    <label class="checkbox-option">
                      <input 
                        type="checkbox" 
                        v-model="selectedScene.effects.glow" 
                        @change="debouncedAutoSave"
                      >
                      <span>Effetto luminoso</span>
                    </label>
                    <label class="checkbox-option">
                      <input 
                        type="checkbox" 
                        v-model="selectedScene.effects.typewriter" 
                        @change="debouncedAutoSave"
                      >
                      <span>Testo macchina da scrivere</span>
                    </label>
                  </div>
                </div>

                <div class="style-preview">
                  <h4>Anteprima Stile:</h4>
                  <div 
                    class="preview-box"
                    :class="['style-' + (selectedScene.titleStyle || 'default')]"
                    :style="{ 
                      background: getThemeBackground(selectedScene.backgroundTheme),
                      color: selectedScene.titleColor || '#ffffff'
                    }"
                  >
                    <h2 :class="{ 'glow-effect': selectedScene.effects?.glow }">
                      {{ selectedScene.title || 'Titolo della Scena' }}
                    </h2>
                    <p>{{ selectedScene.description || 'Descrizione della scena...' }}</p>
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
                    <!-- Pulsante per aggiungere nuova scena -->
                    <div 
                      class="scene-chip add-scene-chip"
                      @click="addNewScene"
                      title="Aggiungi nuova scena"
                    >
                      <span class="chip-id">
                        <i class="fas fa-plus"></i>
                      </span>
                      <span class="chip-title">Nuova</span>
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
                    <!-- Pulsanti rapidi sotto la textbox -->
                    <div class="quick-choice-buttons">
                      <button 
                        @click="setQuickChoiceText(choice, 'Avanti')"
                        class="quick-btn quick-btn-avanti"
                        title="Inserisci 'Avanti'"
                        type="button"
                      >
                        <i class="fas fa-arrow-right"></i> Avanti
                      </button>
                      <button 
                        @click="setQuickChoiceText(choice, 'Continua')"
                        class="quick-btn quick-btn-continua"
                        title="Inserisci 'Continua'"
                        type="button"
                      >
                        <i class="fas fa-play"></i> Continua
                      </button>
                      <button 
                        @click="setQuickChoiceText(choice, 'Procedi')"
                        class="quick-btn quick-btn-procedi"
                        title="Inserisci 'Procedi'"
                        type="button"
                      >
                        <i class="fas fa-step-forward"></i> Procedi
                      </button>
                    </div>
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
                        <!-- Pulsante per aggiungere nuova scena -->
                        <span 
                          class="id-chip add-scene-id-chip"
                          @click="addNewSceneAndConnect(choice)"
                          title="Crea nuova scena e collega"
                        >
                          <i class="fas fa-plus"></i>
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
      autoSaveTimer: null,
      toast: {
        show: false,
        type: '',
        message: '',
        icon: ''
      },
      // Stato del salvataggio
      saveStatus: {
        text: 'Pronto',
        class: 'save-ready',
        icon: 'fas fa-circle'
      },
      lastSaveTime: null,
      // Visualizzatore JSON
      showJsonViewer: false,
      jsonViewerData: null,
      // Opzioni per la personalizzazione degli stili
      // Opzioni per la personalizzazione degli stili
      backgroundThemes: [
        { name: 'Predefinito', value: '', preview: 'linear-gradient(45deg, #2c3e50, #34495e)' },
        { name: 'Fuoco', value: 'fire', preview: 'linear-gradient(45deg, #ff6b35, #ff4757)' },
        { name: 'Acqua', value: 'water', preview: 'linear-gradient(45deg, #3742fa, #2f3542)' },
        { name: 'Natura', value: 'nature', preview: 'linear-gradient(45deg, #2ed573, #1e90ff)' },
        { name: 'Spazio', value: 'space', preview: 'linear-gradient(45deg, #5f27cd, #341f97)' },
        { name: 'Horror', value: 'horror', preview: 'linear-gradient(45deg, #8b0000, #2c0000)' },
        { name: 'Oro', value: 'gold', preview: 'linear-gradient(45deg, #f1c40f, #f39c12)' }
      ]
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
  watch: {
    // Auto-save per il titolo della scena
    'selectedScene.title': {
      handler() {
        if (this.selectedScene && this.selectedScene.id) {
          this.debouncedAutoSave()
        }
      },
      deep: true
    },
    
    // Auto-save per la descrizione della scena
    'selectedScene.description': {
      handler() {
        if (this.selectedScene && this.selectedScene.id) {
          this.debouncedAutoSave()
        }
      },
      deep: true
    },
    
    // Auto-save per le scelte
    'selectedScene.choices': {
      handler() {
        if (this.selectedScene && this.selectedScene.id) {
          this.debouncedAutoSave()
        }
      },
      deep: true
    },
    
    // Auto-save per lo stato finale
    'selectedScene.isFinal': {
      handler() {
        if (this.selectedScene && this.selectedScene.id) {
          this.debouncedAutoSave()
        }
      }
    }
  },
  methods: {
    checkAuth() {
      if (!gameService.isAdminAuthenticated()) {
        this.$router.push('/')
      }
    },

    startAutoRefresh() {
      // Disattivato auto-refresh aggressivo per evitare perdita di dati
      // Solo refresh manuale ora disponibile
      console.log('Auto-refresh disattivato per preservare le modifiche in corso')
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
      // Inizializza gli stili della scena
      this.selectedScene = this.initializeSceneStyles(this.selectedScene)
    },

    async addNewScene() {
      const newScene = {
        id: Math.max(...this.scenes.map(s => s.id), 0) + 1,
        title: 'Nuova Scena',
        description: '',
        image: '',
        video: '',
        choices: [],
        isFinal: false
      }
      
      try {
        // Salva immediatamente la nuova scena
        const savedScene = await gameService.addScene(newScene)
        this.scenes.push(savedScene)
        this.selectScene(savedScene)
        this.showAutoSaveIndicator()
      } catch (error) {
        console.error('Errore creazione scena:', error)
        this.showToast('error', 'Errore nella creazione della scena', 'fas fa-exclamation-triangle')
      }
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
      // Auto-save dopo aggiunta scelta
      this.debouncedAutoSave()
    },

    removeChoice(index) {
      this.selectedScene.choices.splice(index, 1)
      // Auto-save dopo rimozione scelta
      this.debouncedAutoSave()
    },

    // PULSANTI RAPIDI PER SCELTE
    setQuickChoiceText(choice, text) {
      choice.text = text
      // Auto-save immediato quando si usa un pulsante rapido
      this.debouncedAutoSave()
    },

    async uploadImage(event) {
      const file = event.target.files[0]
      if (!file) return

      try {
        console.log('📤 Upload immagine in corso...')
        const filePath = await gameService.uploadFile(file)
        
        if (filePath) {
          this.selectedScene.image = filePath
          console.log('✅ Immagine salvata:', filePath)
          this.showToast('success', 'Immagine caricata con successo', 'fas fa-check')
          
          // Auto-save dopo upload
          this.debouncedAutoSave()
        }
      } catch (error) {
        console.error('❌ Errore upload immagine:', error)
        this.showToast('error', 'Errore nel caricamento dell\'immagine: ' + error.message, 'fas fa-exclamation-triangle')
      }
    },

    async uploadVideo(event) {
      const file = event.target.files[0]
      if (!file) return

      try {
        console.log('📤 Upload video in corso...')
        const filePath = await gameService.uploadFile(file)
        
        if (filePath) {
          this.selectedScene.video = filePath
          console.log('✅ Video salvato:', filePath)
          this.showToast('success', 'Video caricato con successo', 'fas fa-check')
          
          // Auto-save dopo upload
          this.debouncedAutoSave()
        }
      } catch (error) {
        console.error('❌ Errore upload video:', error)
        this.showToast('error', 'Errore nel caricamento del video: ' + error.message, 'fas fa-exclamation-triangle')
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
      
      // Se è un percorso relativo, aggiunge il dominio del backend
      const baseUrl = config.API_BASE_URL || window.location.origin
      return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`
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
    },

    async addNewSceneAndConnect(choice) {
      try {
        // Crea una nuova scena
        const newScene = {
          id: Math.max(...this.scenes.map(s => s.id), 0) + 1,
          title: 'Nuova Scena',
          description: '',
          image: '',
          video: '',
          choices: [],
          isFinal: false
        }
        
        // Salva la nuova scena
        const savedScene = await gameService.addScene(newScene)
        this.scenes.push(savedScene)
        
        // Collega la scelta alla nuova scena
        choice.nextSceneId = savedScene.id
        
        // Auto-save della scena corrente per salvare il collegamento
        await this.autoSave()
        
        // Mostra messaggio di conferma
        this.showSuccess(`Nuova scena ${savedScene.id} creata e collegata!`)
      } catch (error) {
        console.error('Errore creazione e collegamento scena:', error)
        this.showToast('error', 'Errore nella creazione della scena', 'fas fa-exclamation-triangle')
      }
    },

    // Auto-save con debounce migliorato
    debouncedAutoSave() {
      clearTimeout(this.autoSaveTimer)
      this.autoSaveTimer = setTimeout(() => {
        this.autoSave()
      }, 300) // Ridotto a 300ms per essere più reattivo
    },

    async autoSave() {
      if (!this.selectedScene || !this.selectedScene.id) return
      
      try {
        // Aggiorna indicatore di stato
        this.updateSaveStatus('saving', 'Salvando...', 'fas fa-spinner fa-spin')
        
        // Aggiorna timestamp di modifica
        this.selectedScene.lastModified = new Date().toISOString()
        
        console.log('🔄 Auto-save in corso...')
        const sceneData = { ...this.selectedScene }
        
        // Usa il nuovo sistema di salvataggio con coda
        await gameService.saveScene(sceneData)
        
        // Aggiorna la scena nella lista locale immediatamente
        const index = this.scenes.findIndex(s => s.id === sceneData.id)
        if (index !== -1) {
          this.scenes[index] = { ...sceneData }
        }
        
        // Aggiorna indicatore di successo
        this.updateSaveStatus('saved', 'Salvato', 'fas fa-check-circle')
        this.lastSaveTime = new Date()
        
        // Torna a "pronto" dopo 3 secondi
        setTimeout(() => {
          this.updateSaveStatus('ready', 'Pronto', 'fas fa-circle')
        }, 3000)
        
        // Forza il refresh per vedere i cambiamenti in tempo reale
        this.$forceUpdate()
        
        // Aggiorna JSON viewer se aperto
        if (this.showJsonViewer) {
          await this.refreshJsonViewer()
        }
        
      } catch (error) {
        console.error('❌ Errore auto-save:', error)
        this.updateSaveStatus('error', 'Errore', 'fas fa-exclamation-triangle')
        this.showToast('error', 'Errore nel salvataggio automatico', 'fas fa-exclamation-triangle')
      }
    },

    // Auto-save immediato per operazioni critiche
    async forceSave() {
      if (!this.selectedScene || !this.selectedScene.id) return
      
      try {
        this.updateSaveStatus('saving', 'Salvando...', 'fas fa-spinner fa-spin')
        
        console.log('⚡ Salvataggio forzato...')
        this.selectedScene.lastModified = new Date().toISOString()
        
        // Usa il metodo di salvataggio diretto per operazioni immediate
        const data = await gameService.loadGameData()
        const sceneIndex = data.scenes.findIndex(s => s.id === this.selectedScene.id)
        
        if (sceneIndex !== -1) {
          data.scenes[sceneIndex] = { ...this.selectedScene }
        }
        
        data.stats.lastModified = new Date().toISOString()
        await gameService.saveGameData(data)
        
        // Aggiorna anche la lista locale
        const index = this.scenes.findIndex(s => s.id === this.selectedScene.id)
        if (index !== -1) {
          this.scenes[index] = { ...this.selectedScene }
        }
        
        this.updateSaveStatus('saved', 'Salvato!', 'fas fa-check-circle')
        this.showToast('success', 'Modifiche salvate immediatamente!', 'fas fa-save')
        
        // Torna a "pronto" dopo 2 secondi
        setTimeout(() => {
          this.updateSaveStatus('ready', 'Pronto', 'fas fa-circle')
        }, 2000)
        
      } catch (error) {
        console.error('❌ Errore salvataggio forzato:', error)
        this.updateSaveStatus('error', 'Errore', 'fas fa-exclamation-triangle')
        this.showToast('error', 'Errore nel salvataggio', 'fas fa-exclamation-triangle')
      }
    },

    // Aggiorna indicatore di stato
    updateSaveStatus(type, text, icon) {
      this.saveStatus = {
        text,
        icon,
        class: `save-${type}`
      }
    },

    // MEGA FORCE SAVE - Salvataggio garantito
    async megaForceSave() {
      try {
        this.updateSaveStatus('saving', 'FORCE SAVING...', 'fas fa-database fa-spin')
        
        console.log('⚡ MEGA FORCE SAVE iniziato...')
        
        // 1. Salva tutti i dati attuali
        const allData = {
          scenes: this.scenes,
          settings: {
            gameName: "Il Gioco dei Trenta",
            welcomeMessage: "Benvenuto nel gioco!",
            maxScenes: 30,
            theme: "unlock30"
          },
          stats: {
            totalScenes: this.scenes.length,
            lastModified: new Date().toISOString(),
            forceSaveBy: 'admin'
          }
        }
        
        // 2. Force save su API
        await gameService.saveGameData(allData)
        
        // 3. Force save diretto
        await gameService.forceSave()
        
        // 4. Verifica che sia stato salvato
        const verification = await gameService.forceRefresh()
        
        if (verification && verification.scenes.length === this.scenes.length) {
          this.updateSaveStatus('saved', 'FORCE SAVED!', 'fas fa-check-circle')
          this.showToast('success', `✅ FORCE SAVE completato! ${verification.scenes.length} scene salvate`, 'fas fa-database')
          
          // 5. Forza anche localStorage
          localStorage.setItem('ilGiocoDeiTrenta_gameData', JSON.stringify(allData))
          
          console.log('✅ MEGA FORCE SAVE completato con verifica')
        } else {
          throw new Error('Verifica post-salvataggio fallita')
        }
        
        // Torna a "pronto" dopo 5 secondi
        setTimeout(() => {
          this.updateSaveStatus('ready', 'Pronto', 'fas fa-circle')
        }, 5000)
        
      } catch (error) {
        console.error('❌ Errore MEGA FORCE SAVE:', error)
        this.updateSaveStatus('error', 'ERRORE FORCE SAVE', 'fas fa-exclamation-triangle')
        this.showToast('error', '❌ Errore nel FORCE SAVE', 'fas fa-exclamation-triangle')
      }
    },

    // TEST BACKUP GIT
    async testGitBackup() {
      try {
        this.updateSaveStatus('saving', 'Test backup Git...', 'fab fa-github fa-spin')
        
        console.log('🔧 Test backup Git iniziato...')
        
        const result = await gameService.testBackup()
        
        if (result && result.success) {
          this.updateSaveStatus('saved', 'Backup testato!', 'fab fa-github')
          this.showToast('success', `✅ Test backup completato! Config: ${JSON.stringify(result.config)}`, 'fab fa-github')
          console.log('✅ Test backup completato:', result)
        } else {
          throw new Error('Test backup fallito')
        }
        
        // Torna a "pronto" dopo 5 secondi
        setTimeout(() => {
          this.updateSaveStatus('ready', 'Pronto', 'fas fa-circle')
        }, 5000)
        
      } catch (error) {
        console.error('❌ Errore test backup:', error)
        this.updateSaveStatus('error', 'ERRORE BACKUP', 'fas fa-exclamation-triangle')
        this.showToast('error', `❌ Errore test backup: ${error.message}`, 'fas fa-exclamation-triangle')
      }
    },

    // VISUALIZZATORE JSON
    async toggleJsonViewer() {
      this.showJsonViewer = !this.showJsonViewer
      if (this.showJsonViewer) {
        await this.refreshJsonViewer()
      }
    },

    closeJsonViewer() {
      this.showJsonViewer = false
    },

    async refreshJsonViewer() {
      try {
        // Ottieni i dati più aggiornati
        const freshData = await gameService.loadGameData()
        this.jsonViewerData = {
          scenes: freshData.scenes,
          settings: freshData.settings,
          stats: {
            ...freshData.stats,
            lastViewed: new Date().toISOString()
          }
        }
      } catch (error) {
        console.error('Errore nel refresh JSON viewer:', error)
        this.jsonViewerData = { error: 'Impossibile caricare i dati JSON' }
      }
    },

    formatJson(data) {
      if (!data) return 'Caricamento...'
      return JSON.stringify(data, null, 2)
    },

    formatTime(time) {
      if (!time) return 'Mai'
      return new Date(time).toLocaleString('it-IT')
    },

    showAutoSaveIndicator() {
      // Indicatore visivo discreto che scompare dopo 2 secondi
      const indicator = document.createElement('div')
      indicator.innerHTML = '<i class="fas fa-check"></i> Salvato'
      indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 0.9rem;
        z-index: 9999;
        opacity: 0.9;
        transition: opacity 0.3s ease;
      `
      document.body.appendChild(indicator)
      
      setTimeout(() => {
        indicator.style.opacity = '0'
        setTimeout(() => {
          document.body.removeChild(indicator)
        }, 300)
      }, 2000)
    },

    // METODI PER BACKUP CLOUD
    async createBackup() {
      try {
        this.loading = true
        console.log('☁️ Creazione backup...')
        
        const success = await gameService.createBackup()
        
        if (success) {
          this.showNotification('✅ Backup creato con successo su Git!', 'success')
        } else {
          this.showNotification('⚠️ Backup non disponibile (solo in produzione)', 'warning')
        }
      } catch (error) {
        console.error('❌ Errore backup:', error)
        this.showNotification('❌ Errore nella creazione del backup', 'error')
      } finally {
        this.loading = false
      }
    },

    async restoreBackup() {
      if (!confirm('⚠️ Sicuro di voler ripristinare i dati dal JSON? Le modifiche non salvate andranno perse.')) {
        return
      }

      try {
        this.loading = true
        console.log('🔄 Ripristino dal file JSON...')
        
        // Forza il refresh completo dei dati dal backend
        const data = await gameService.forceRefresh()
        
        if (data && data.scenes) {
          this.scenes = data.scenes
          this.selectedScene = null
          
          // Forza anche il salvataggio in localStorage come backup
          localStorage.setItem('ilGiocoDeiTrenta_gameData', JSON.stringify(data))
          
          this.showNotification(`✅ Dati ripristinati! ${data.scenes.length} scene caricate`, 'success')
          console.log('✅ Ripristino completato:', data.scenes.length, 'scene')
        } else {
          this.showNotification('⚠️ Nessun dato da ripristinare', 'warning')
        }
      } catch (error) {
        console.error('❌ Errore ripristino:', error)
        this.showNotification('❌ Errore nel ripristino dei dati', 'error')
      } finally {
        this.loading = false
      }
    },

    showNotification(message, type = 'info') {
      const notification = document.createElement('div')
      notification.innerHTML = message
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 1rem;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        max-width: 400px;
        text-align: center;
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.style.opacity = '0'
        notification.style.transform = 'translate(-50%, -50%) scale(0.9)'
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    },

    // METODI PER LA GESTIONE DEGLI STILI
    getThemeBackground(theme) {
      const themeData = this.backgroundThemes.find(t => t.value === theme)
      return themeData ? themeData.preview : this.backgroundThemes[0].preview
    },

    initializeSceneStyles(scene) {
      // Inizializza le proprietà di stile se non esistono
      if (!scene.titleStyle) scene.titleStyle = ''
      if (!scene.titleColor) scene.titleColor = '#ffffff'
      if (!scene.backgroundTheme) scene.backgroundTheme = ''
      if (!scene.effects) {
        scene.effects = {
          particles: false,
          glow: false,
          typewriter: false
        }
      }
      return scene
    },
  }
}
</script>

<style scoped>
/* STILI INDICATORE DI STATO */
.save-status-left {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.save-ready {
  background: rgba(52, 152, 219, 0.9);
  color: white;
  border-color: rgba(52, 152, 219, 0.5);
}

.save-saving {
  background: rgba(241, 196, 15, 0.9);
  color: white;
  border-color: rgba(241, 196, 15, 0.5);
  animation: pulse 1.5s infinite;
}

.save-saved {
  background: rgba(39, 174, 96, 0.9);
  color: white;
  border-color: rgba(39, 174, 96, 0.5);
  animation: successPulse 0.6s ease;
}

.save-error {
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border-color: rgba(231, 76, 60, 0.5);
  animation: shake 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}

@keyframes successPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.admin-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border-bottom: 3px solid #e74c3c;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn-force-save {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 10px;
}

.btn-force-save:hover:not(:disabled) {
  background: linear-gradient(45deg, #219a52, #27ae60);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
}

.btn-force-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-mega-save {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 10px;
  border: 2px solid rgba(255,255,255,0.2);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.btn-mega-save:hover:not(:disabled) {
  background: linear-gradient(45deg, #c0392b, #a93226);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(231, 76, 60, 0.4);
  border-color: rgba(255,255,255,0.4);
}

.btn-mega-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-git-test {
  background: linear-gradient(45deg, #24292e, #586069);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 10px;
  border: 2px solid rgba(255,255,255,0.2);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.btn-git-test:hover:not(:disabled) {
  background: linear-gradient(45deg, #586069, #6f42c1);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(36, 41, 46, 0.4);
  border-color: rgba(255,255,255,0.4);
}

.btn-git-test:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* LAYOUT HEADER MIGLIORATO */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.admin-header h1 {
  margin: 0;
  color: white;
  font-size: 1.8rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .save-status-left {
    position: relative;
    top: auto;
    left: auto;
    order: -1;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .admin-header {
    flex-direction: column;
    gap: 15px;
  }
}

/* VISUALIZZATORE JSON */
.btn-json-viewer {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-json-viewer:hover {
  background: linear-gradient(45deg, #8e44ad, #732d91);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(142, 68, 173, 0.3);
}

.json-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.json-viewer-modal {
  background: #2c3e50;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  animation: slideInUp 0.3s ease;
}

.json-viewer-header {
  background: linear-gradient(45deg, #34495e, #2c3e50);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.json-viewer-header h3 {
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-close-json {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-json:hover {
  background: rgba(231, 76, 60, 0.3);
}

.json-viewer-content {
  padding: 0;
  max-height: calc(90vh - 100px);
  overflow: auto;
}

.json-stats {
  background: rgba(52, 73, 94, 0.5);
  padding: 15px 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  color: #ecf0f1;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.json-stats span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-refresh-json {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  margin-left: auto;
}

.btn-refresh-json:hover {
  background: linear-gradient(45deg, #2980b9, #1f5f8a);
}

.json-display {
  background: #1e272e;
  color: #00d2d3;
  padding: 20px;
  margin: 0;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* PULSANTI RAPIDI PER SCELTE */
.quick-choice-buttons {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.quick-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.quick-btn-avanti {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
}

.quick-btn-avanti:hover {
  background: linear-gradient(45deg, #219a52, #27ae60);
}

.quick-btn-continua {
  background: linear-gradient(45deg, #f39c12, #e67e22);
}

.quick-btn-continua:hover {
  background: linear-gradient(45deg, #d68910, #f39c12);
}

.quick-btn-procedi {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
}

.quick-btn-procedi:hover {
  background: linear-gradient(45deg, #8e44ad, #732d91);
}

.quick-btn i {
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .quick-choice-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .quick-btn {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}
</style>
