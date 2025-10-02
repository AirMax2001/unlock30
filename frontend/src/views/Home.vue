<template>
  <div class="home-container animated-red-background">
    <!-- Elementi fluttuanti a tema unlock -->
    <div class="unlock-elements">
      <div class="unlock-element">🔓</div>
      <div class="unlock-element">🗝️</div>
      <div class="unlock-element">🚪</div>
    </div>

    <!-- Contenuto principale -->
    <div class="hero-content">
      <h1 class="title-text">UNLOCK30</h1>
      <p class="subtitle">Un'avventura interattiva che ti aspetta. Riuscirai a risolvere tutti gli enigmi e sbloccare i segreti nascosti?</p>
      
      <div class="home-buttons">
        <button class="btn-play" @click="startGame">
          <i class="fas fa-play"></i>
          Gioca Ora
        </button>
        <button class="btn-admin" @click="showLoginModal = true">
          <i class="fas fa-cog"></i>
          Admin
        </button>
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
