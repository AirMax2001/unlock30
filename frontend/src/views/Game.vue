<template>
  <div class="game-container animated-red-background">
    <!-- Header con torna indietro -->
    <div class="game-header">
      <button class="back-button" @click="goHome">
        <i class="fas fa-arrow-left"></i> Torna alla Home
      </button>
      <h2 class="game-title">UNLOCK30</h2>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Caricamento del gioco...</p>
    </div>

    <!-- Errore -->
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Ops! Qualcosa è andato storto</h3>
      <p>{{ error }}</p>
      <button class="restart-button" @click="loadGameData">
        <i class="fas fa-redo"></i> Riprova
      </button>
    </div>

    <!-- Gioco -->
    <div v-else-if="currentScene" class="current-scene">
      <!-- Contenuto scena -->
      <div class="scene-content">
        <h1 class="scene-title">{{ currentScene.title }}</h1>
        
        <!-- Media -->
        <div v-if="currentScene.image || currentScene.video" class="scene-media">
          <img 
            v-if="currentScene.image" 
            :src="getMediaUrl(currentScene.image)" 
            :alt="currentScene.title"
            class="scene-image"
          >
          <video 
            v-if="currentScene.video" 
            :src="getMediaUrl(currentScene.video)" 
            controls
            class="scene-video"
          >
            Il tuo browser non supporta i video.
          </video>
        </div>

        <!-- Descrizione -->
        <p class="scene-description">{{ currentScene.description }}</p>
      </div>

      <!-- Scelte -->
      <div v-if="currentScene.choices && currentScene.choices.length > 0 && !currentScene.isFinal" class="choices-container">
        <button 
          v-for="choice in currentScene.choices" 
          :key="choice.id"
          @click="makeChoice(choice)"
          class="choice-button"
          :disabled="processingChoice"
        >
          {{ choice.text }}
        </button>
      </div>

      <!-- Fine del gioco -->
      <div v-if="(!currentScene.choices || currentScene.choices.length === 0) || currentScene.isFinal" class="game-over">
        <h2>Fine dell'avventura!</h2>
        <p>Grazie per aver giocato a UNLOCK30</p>
        <button class="restart-button" @click="restartGame">
          <i class="fas fa-redo"></i> Ricomincia
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import localGameService from '../services/localGameService'

export default {
  name: 'Game',
  data() {
    return {
      gameData: null,
      currentScene: null,
      currentSceneId: 1,
      loading: true,
      error: null,
      processingChoice: false
    }
  },
  mounted() {
    this.loadGameData()
  },
  methods: {
    async loadGameData() {
      this.loading = true
      this.error = null
      
      try {
        const gameData = await localGameService.getGameData()
        this.gameData = gameData
        this.loadScene(1) // Carica la prima scena
      } catch (error) {
        this.error = 'Impossibile caricare i dati del gioco.'
        console.error('Errore nel caricamento:', error)
      } finally {
        this.loading = false
      }
    },
    
    loadScene(sceneId) {
      if (!this.gameData || !this.gameData.scenes) {
        this.error = 'Dati del gioco non validi'
        return
      }
      
      const scene = this.gameData.scenes.find(s => s.id === sceneId)
      if (!scene) {
        this.error = `Scena con ID ${sceneId} non trovata`
        return
      }
      
      this.currentScene = scene
      this.currentSceneId = sceneId
      console.log('Scena caricata:', scene)
    },
    
    async makeChoice(choice) {
      if (this.processingChoice) return
      
      this.processingChoice = true
      
      try {
        // Simula un piccolo delay per l'effetto
        await new Promise(resolve => setTimeout(resolve, 300))
        
        if (choice.nextSceneId) {
          this.loadScene(choice.nextSceneId)
        } else {
          console.warn('Scelta senza nextSceneId:', choice)
        }
      } catch (error) {
        console.error('Errore nella scelta:', error)
        this.error = 'Errore nel processare la scelta'
      } finally {
        this.processingChoice = false
      }
    },
    
    restartGame() {
      this.currentSceneId = 1
      this.currentScene = null
      this.error = null
      this.processingChoice = false
      this.loadGameData()
    },
    
    goHome() {
      this.$router.push('/')
    },

    getMediaUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      
      // Se è un file locale salvato tramite admin
      if (path.startsWith('local://')) {
        // File locale salvato nel localStorage
        const fileName = path.replace('local://', '')
        const fileData = localGameService.getFileData(fileName)
        return fileData || ''
      }
      return path
    }
  }
}
</script>
