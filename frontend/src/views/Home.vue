<template>
  <div class="home-container">
    <!-- Pulsante Admin in alto a destra -->
    <button class="admin-btn" @click="showLoginModal = true">
      <i class="fas fa-cog"></i> Admin
    </button>

    <!-- Contenuto principale -->
    <div class="main-content">
      <div class="game-title">
        <h1 class="title-text">Il Gioco dei Trenta</h1>
        <p class="subtitle">Un'avventura interattiva che ti aspetta</p>
      </div>
      
      <div class="play-section">
        <button class="play-btn" @click="startGame">
          <i class="fas fa-play"></i>
          <span>Avvia Gioco</span>
        </button>
      </div>
      
      <div class="decorative-elements">
        <div class="floating-icon icon-1"><i class="fas fa-star"></i></div>
        <div class="floating-icon icon-2"><i class="fas fa-gem"></i></div>
        <div class="floating-icon icon-3"><i class="fas fa-crown"></i></div>
        <div class="floating-icon icon-4"><i class="fas fa-magic"></i></div>
      </div>
    </div>

    <!-- Modal Login Admin -->
    <div v-if="showLoginModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Accesso Admin</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Username:</label>
            <input 
              type="text" 
              v-model="loginForm.username" 
              placeholder="Inserisci username"
              @keyup.enter="adminLogin"
            >
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              v-model="loginForm.password" 
              placeholder="Inserisci password"
              @keyup.enter="adminLogin"
            >
          </div>
          <div v-if="loginError" class="error-message">
            {{ loginError }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Annulla</button>
          <button class="btn-login" @click="adminLogin" :disabled="isLogging">
            <i v-if="isLogging" class="fas fa-spinner fa-spin"></i>
            {{ isLogging ? 'Accesso...' : 'Accedi' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import localGameService from '../services/localGameService'

export default {
  name: 'Home',
  data() {
    return {
      showLoginModal: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginError: '',
      isLogging: false
    }
  },
  methods: {
    startGame() {
      this.$router.push('/game')
    },
    closeModal() {
      this.showLoginModal = false
      this.loginForm = { username: '', password: '' }
      this.loginError = ''
    },
    async adminLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        this.loginError = 'Inserisci username e password'
        return
      }

      this.isLogging = true
      this.loginError = ''

      try {
        await localGameService.adminLogin(this.loginForm.username, this.loginForm.password)
        this.$router.push('/admin')
      } catch (error) {
        this.loginError = error.response?.data?.message || 'Errore di accesso'
      } finally {
        this.isLogging = false
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.admin-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.admin-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
}

.game-title {
  margin-bottom: 60px;
  color: white;
}

.title-text {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.5); }
  to { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.8); }
}

.subtitle {
  font-size: 1.3rem;
  font-weight: 300;
  opacity: 0.9;
}

.play-btn {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  color: white;
  padding: 20px 40px;
  font-size: 1.5rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.play-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.play-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-icon {
  position: absolute;
  color: rgba(255, 255, 255, 0.3);
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

.icon-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.icon-2 {
  top: 60%;
  right: 15%;
  animation-delay: 1s;
}

.icon-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 2s;
}

.icon-4 {
  top: 40%;
  right: 30%;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 30px 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
}

.modal-footer {
  padding: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  background: #f8f9fa;
}

.btn-cancel, .btn-login {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e1e5e9;
  color: #666;
}

.btn-cancel:hover {
  background: #d1d5d9;
}

.btn-login {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .title-text {
    font-size: 2.5rem;
  }
  
  .play-btn {
    padding: 15px 30px;
    font-size: 1.2rem;
  }
  
  .admin-btn {
    top: 15px;
    right: 15px;
    padding: 10px 15px;
  }
}
</style>
