// Configurazione dell'ambiente
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001', // Backend locale
    STORAGE_TYPE: 'api' // Cambiato da localStorage a api
  },
  production: {
    API_BASE_URL: window.location.origin, // Stesso dominio per Render
    STORAGE_TYPE: 'api' // Cambiato da localStorage a api
  },
  standalone: {
    API_BASE_URL: null, // Nessun backend per modalità standalone
    STORAGE_TYPE: 'localStorage'
  }
}

// FORZA MODALITÀ SVILUPPO per testare upload locale
const environment = 'development' // Forzato a development

export default config[environment]
