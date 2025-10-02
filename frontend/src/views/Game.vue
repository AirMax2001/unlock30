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
      <button class="retry-btn" @click="loadGameData">
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
.game-container {
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  position: relative;
  overflow: hidden;
  color: white;
}

.game-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(220, 20, 60, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 90% 70%, rgba(255, 20, 147, 0.25) 0%, transparent 50%);
  animation: floatingOrbs 20s ease-in-out infinite;
  pointer-events: none;
}

.game-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, transparent 79%, rgba(255, 255, 255, 0.03) 81%, transparent 82%),
    linear-gradient(0deg, transparent 79%, rgba(255, 255, 255, 0.03) 81%, transparent 82%);
  background-size: 50px 50px;
  animation: gridMove 25s linear infinite;
  pointer-events: none;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes floatingOrbs {
  0%, 100% { 
    transform: translateX(0px) translateY(0px) scale(1);
    opacity: 0.7;
  }
  25% { 
    transform: translateX(30px) translateY(-20px) scale(1.1);
    opacity: 0.9;
  }
  50% { 
    transform: translateX(-20px) translateY(30px) scale(0.9);
    opacity: 0.8;
  }
  75% { 
    transform: translateX(20px) translateY(-10px) scale(1.05);
    opacity: 0.6;
  }
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Floating game elements */
.floating-game-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-game-icon {
  position: absolute;
  font-size: 2.2rem;
  animation: gameFloat 5s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
}

.icon-g1 {
  top: 25%;
  left: 5%;
  animation-delay: 0s;
  color: rgba(255, 69, 0, 0.5);
}

.icon-g2 {
  top: 65%;
  right: 8%;
  animation-delay: 1.5s;
  color: rgba(220, 20, 60, 0.5);
}

.icon-g3 {
  bottom: 35%;
  left: 12%;
  animation-delay: 3s;
  color: rgba(255, 20, 147, 0.5);
}

.icon-g4 {
  top: 45%;
  right: 20%;
  animation-delay: 2.2s;
  color: rgba(255, 99, 71, 0.5);
}

@keyframes gameFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
    opacity: 0.5;
  }
  25% { 
    transform: translateY(-30px) rotate(8deg) scale(1.1);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-20px) rotate(-5deg) scale(0.9);
    opacity: 0.8;
  }
  75% { 
    transform: translateY(-35px) rotate(12deg) scale(1.05);
    opacity: 0.6;
  }
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
}

.back-btn {
  background: linear-gradient(45deg, #ff4757, #ff3838);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
}

.back-btn:hover {
  background: linear-gradient(45deg, #ff3838, #ff4757);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.5);
  filter: brightness(1.1);
}

.game-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 69, 0, 0.5);
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% { 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 69, 0, 0.5);
  }
  100% { 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 30px rgba(220, 20, 60, 0.8);
  }
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
  background: linear-gradient(45deg, #ff4757, #ff3838);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 14px 28px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(45deg, #ff3838, #ff4757);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.6);
  filter: brightness(1.1);
}

.game-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 5;
}

.scene-container {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 35px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(255, 69, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.scene-header {
  text-align: center;
  margin-bottom: 30px;
}

.scene-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 69, 0, 0.6),
    0 0 40px rgba(255, 20, 147, 0.4);
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
  animation: sceneGlow 4s ease-in-out infinite alternate;
}

@keyframes sceneGlow {
  0% { 
    text-shadow: 
      2px 2px 4px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 69, 0, 0.6),
      0 0 40px rgba(255, 20, 147, 0.4);
  }
  100% { 
    text-shadow: 
      2px 2px 4px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(220, 20, 60, 0.8),
      0 0 60px rgba(255, 99, 71, 0.6);
  }
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
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(255, 69, 0, 0.1);
}

.scene-description {
  font-size: 1.3rem;
  line-height: 1.7;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(45deg, #ff4757, #ff3838, #ff6b6b, #ffa726);
  background-size: 200% 200%;
  animation: choiceGradient 3s ease infinite;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 22px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 
    0 4px 15px rgba(255, 71, 87, 0.4),
    0 0 30px rgba(255, 69, 0, 0.2);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes choiceGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.choice-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 8px 25px rgba(255, 71, 87, 0.6),
    0 0 40px rgba(255, 20, 147, 0.3);
  filter: brightness(1.1);
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
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 45px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(255, 69, 0, 0.2);
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
  background: linear-gradient(45deg, #ff4757, #e73c7e, #ff6b6b);
  background-size: 200% 200%;
  animation: restartGradient 3s ease infinite;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 16px 32px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.2rem;
  margin-top: 25px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 
    0 6px 20px rgba(255, 71, 87, 0.4),
    0 0 30px rgba(255, 20, 147, 0.3);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes restartGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.restart-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 8px 25px rgba(255, 71, 87, 0.6),
    0 0 40px rgba(255, 20, 147, 0.4);
  filter: brightness(1.1);
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 15px;
  }
  
  .back-btn {
    align-self: center;
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .game-title {
    font-size: 1.5rem;
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
    gap: 12px;
  }
  
  .game-content {
    padding: 15px;
  }
  
  .scene-container {
    padding: 20px;
  }
  
  .scene-description {
    font-size: 1.1rem;
  }
  
  .floating-game-icon {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .game-header {
    padding: 10px;
  }
  
  .back-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
    gap: 6px;
  }
  
  .game-title {
    font-size: 1.3rem;
  }
  
  .scene-title {
    font-size: 1.5rem;
  }
  
  .game-content {
    padding: 10px;
  }
  
  .scene-container {
    padding: 15px;
  }
  
  .scene-description {
    font-size: 1rem;
  }
  
  .choice-btn {
    padding: 16px;
    font-size: 0.95rem;
  }
  
  .floating-game-icon {
    font-size: 1.5rem;
  }
  
  .media-container {
    margin-bottom: 20px;
  }
  
  .scene-image, .scene-video {
    border-radius: 10px;
  }
  
  .loading-container, .error-container {
    padding: 15px;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
  }
}
</style>
