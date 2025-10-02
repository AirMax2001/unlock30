<template>
  <div class="game-container">
    <!-- Header con torna indietro -->
    <div class="game-header">
      <button class="back-btn" @click="goHome">
        <i class="fas fa-arrow-left"></i> Torna alla Home
      </button>
      <h2 class="game-title">Il Gioco dei Trenta</h2>
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
      <button class="retry-btn" @click="loadGameData">
        <i class="fas fa-redo"></i> Riprova
      </button>
    </div>

    <!-- Gioco -->
    <div v-else-if="currentScene" class="game-content">
      <div class="scene-container">
        <!-- Titolo scena -->
        <div class="scene-header">
          <h1 class="scene-title">
            {{ currentScene.title }}
            <span v-if="currentScene.isFinal" class="final-indicator">
              <i class="fas fa-flag-checkered"></i>
            </span>
          </h1>
        </div>

        <!-- Media (immagine o video) -->
        <div v-if="currentScene.image || currentScene.video" class="media-container">
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
        <div class="description-container">
          <div class="description-box">
            <p class="scene-description">{{ currentScene.description }}</p>
          </div>
        </div>

        <!-- Scelte -->
        <div v-if="currentScene.choices && currentScene.choices.length > 0 && !currentScene.isFinal" class="choices-container">
          <h3 class="choices-title">Cosa vuoi fare?</h3>
          <div class="choices-grid">
            <button 
              v-for="choice in currentScene.choices" 
              :key="choice.id"
              @click="makeChoice(choice)"
              class="choice-btn"
              :disabled="processingChoice"
            >
              <span class="choice-text">{{ choice.text }}</span>
              <i class="fas fa-arrow-right choice-arrow"></i>
            </button>
          </div>
        </div>

        <!-- Fine del gioco -->
        <div v-if="(!currentScene.choices || currentScene.choices.length === 0) || currentScene.isFinal" class="game-end">
          <div class="end-message">
            <i class="fas fa-flag-checkered"></i>
            <h3>Fine dell'avventura!</h3>
            <p>Grazie per aver giocato a "Il Gioco dei Trenta"</p>
            <button class="restart-btn" @click="restartGame">
              <i class="fas fa-redo"></i> Ricomincia
            </button>
          </div>
        </div>
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
      
      if (scene) {
        this.currentScene = scene
        this.currentSceneId = sceneId
      } else {
        this.error = `Scena ${sceneId} non trovata`
      }
    },
    
    async makeChoice(choice) {
      if (!choice.nextSceneId) {
        // Fine del gioco o scelta senza prossima scena
        this.currentScene = { ...this.currentScene, choices: [] }
        return
      }
      
      this.processingChoice = true
      
      // Piccola animazione di transizione
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.loadScene(choice.nextSceneId)
      this.processingChoice = false
    },
    
    restartGame() {
      this.currentSceneId = 1
      this.loadScene(1)
    },
    
    goHome() {
      this.$router.push('/')
    },
    
    getMediaUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
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

<style scoped>
.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
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

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.game-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: 20px;
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

.error-container i {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 20px;
}

.retry-btn {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.game-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.scene-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.scene-header {
  text-align: center;
  margin-bottom: 30px;
}

.scene-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.final-indicator {
  background: linear-gradient(45deg, #f1c40f, #f39c12);
  color: #2c3e50;
  padding: 8px 15px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(241, 196, 15, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.media-container {
  margin-bottom: 30px;
  text-align: center;
}

.scene-image, .scene-video {
  max-width: 100%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.scene-video {
  max-height: 400px;
}

.description-container {
  margin-bottom: 40px;
}

.description-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  backdrop-filter: blur(5px);
}

.scene-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0;
}

.choices-container {
  margin-top: 40px;
}

.choices-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 25px;
  font-weight: 600;
}

.choices-grid {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.choice-btn {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  border: none;
  color: white;
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.choice-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.choice-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.choice-text {
  flex: 1;
  text-align: left;
}

.choice-arrow {
  transition: transform 0.3s ease;
}

.choice-btn:hover .choice-arrow {
  transform: translateX(5px);
}

.game-end {
  text-align: center;
  padding: 40px 20px;
}

.end-message {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.end-message i {
  font-size: 4rem;
  color: #f1c40f;
  margin-bottom: 20px;
}

.end-message h3 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.restart-btn {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  border: none;
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 25px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.restart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .scene-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .final-indicator {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
  
  .choices-grid {
    grid-template-columns: 1fr;
  }
  
  .game-content {
    padding: 15px;
  }
  
  .scene-container {
    padding: 20px;
  }
}
</style>
