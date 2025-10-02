// Configurazione dell'ambiente 
const config = { 
  development: { 
    API_BASE_URL: 'http://localhost:3001', 
    STORAGE_TYPE: 'api' 
  }, 
  production: { 
    API_BASE_URL: window.location.origin, 
    STORAGE_TYPE: 'api' 
  } 
} 
const environment = process.env.NODE_ENV === 'development' ? 'development' : 'production' 
export default config[environment] 
