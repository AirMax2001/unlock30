// Configurazione dell'ambiente - SOLO FRONTEND
const config = {
  development: {
    API_BASE_URL: null, // Nessun backend
    STORAGE_TYPE: 'localStorage'
  },
  production: {
    API_BASE_URL: null, // Nessun backend 
    STORAGE_TYPE: 'localStorage'
  }
}

// Sempre modalità standalone (senza backend)
const environment = 'production'

export default config[environment]
