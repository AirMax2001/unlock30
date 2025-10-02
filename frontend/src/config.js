// Configurazione dell'ambiente
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001', // Backend locale
    STORAGE_TYPE: 'localStorage'
  },
  production: {
    API_BASE_URL: window.location.origin, // Stesso dominio per Render
    STORAGE_TYPE: 'localStorage'
  },
  standalone: {
    API_BASE_URL: null, // Nessun backend per modalità standalone
    STORAGE_TYPE: 'localStorage'
  }
}

// Determina l'ambiente in base alla presenza del backend
const environment = process.env.NODE_ENV === 'development' ? 'development' : 'production'

export default config[environment]
