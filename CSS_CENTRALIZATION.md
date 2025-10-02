# UNLOCK30 - Documentazione Styling

## Struttura CSS Centralizzata

Abbiamo spostato con successo tutti gli stili dai file Vue individuali a un unico file CSS globale per una migliore organizzazione e manutenibilità.

### File modificati:

#### 1. **frontend/src/assets/styles/global.css** (NUOVO)
- Contiene tutti gli stili dell'applicazione
- Animazioni globali (gradientShift, floatPattern, floatSlow, etc.)
- Stili per Home, Game e Admin pages
- Responsive design per tutti i dispositivi
- Tema consistente UNLOCK30 con colori rossi (#ff4757, #ff3838, #ff6b6b)

#### 2. **frontend/src/main.js** (AGGIORNATO)
- Aggiunto import del CSS globale: `import './assets/styles/global.css'`

#### 3. **frontend/src/views/Home.vue** (PULITO)
- Rimosso tutto il tag `<style>`
- Template aggiornato per utilizzare le classi CSS globali
- Utilizzata classe `animated-red-background` per lo sfondo consistente

#### 4. **frontend/src/views/Game.vue** (PULITO)
- Completamente ricreato senza stili inline
- Rimosso tutto il tag `<style>`
- Utilizza le classi CSS globali per il tema UNLOCK30

#### 5. **frontend/src/views/Admin.vue** (PULITO)
- Rimosso tutto il tag `<style>`
- Mantiene tutte le funzionalità responsive e di design
- Utilizza le classi CSS globali

#### 6. **frontend/src/App.vue** (MINIMIZZATO)
- Rimosso tutti gli stili tranne la struttura base
- Container pulito per il router-view

### Vantaggi della centralizzazione:

✅ **Manutenibilità**: Tutti gli stili in un posto
✅ **Consistenza**: Tema unificato UNLOCK30
✅ **Performance**: CSS caricato una sola volta
✅ **Debugging**: Più facile individuare e modificare stili
✅ **Scalabilità**: Facile aggiungere nuovi componenti
✅ **Mobile First**: Design responsive integrato

### Classi principali disponibili:

- `.animated-red-background` - Sfondo animato rosso condiviso
- `.home-container` - Container per homepage
- `.game-container` - Container per game page  
- `.admin-container` - Container per admin panel
- `.btn-play`, `.btn-admin` - Pulsanti principali
- `.scene-content`, `.choices-container` - Elementi del gioco
- `.form-section`, `.editor-content` - Elementi dell'admin

### Come utilizzare:

1. Importare automaticamente tramite main.js
2. Applicare le classi CSS nei template Vue
3. Non più bisogno di tag `<style>` nei componenti singoli
4. Customizzazioni future nel file global.css

L'applicazione mantiene la stessa estetica e funzionalità di prima, ma ora è molto più organizzata e manutenibile!
