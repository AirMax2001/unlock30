import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import localGameService from './services/localGameService'

const app = createApp(App)

// Rendi il servizio disponibile globalmente
app.config.globalProperties.$gameService = localGameService

app.use(router)
app.mount('#app')
