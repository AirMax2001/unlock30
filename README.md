# Il Gioco dei Trenta

Un gioco interattivo a scelte multiple con pannello di amministrazione.

**🌐 Sito Web**:[(https://unlock30.onrender.com))

## Configurazione Automatica

Il gioco si adatta automaticamente all'ambiente:
- **Sviluppo**: `http://localhost:8080` (frontend) + `http://localhost:3001` (backend)
- **Produzione**: `http://maristellacichella.altervista.org/`

## Struttura del Progetto

- `frontend/` - Applicazione Vue.js
- `backend/` - Server Node.js/Express
- `app/` - Progetto Gradle/Groovy (esistente)

## Installazione e Avvio

### Backend (Node.js)

1. Vai nella cartella backend:
```bash
cd backend
```

2. Installa le dipendenze:
```bash
npm install
```

3. Avvia il server:
```bash
npm start
```

Il server sarà disponibile su `http://localhost:3001`

### Frontend (Vue.js)

1. Vai nella cartella frontend:
```bash
cd frontend
```

2. Installa Vue CLI globalmente (se non già installato):
```bash
npm install -g @vue/cli
```

3. Installa le dipendenze:
```bash
npm install
```

4. Avvia l'applicazione:
```bash
npm run serve
```

L'applicazione sarà disponibile su `http://localhost:8080`

## Utilizzo

### Giocatore

1. Vai su `http://localhost:8080`
2. Clicca su "Avvia Gioco" per iniziare a giocare
3. Segui le istruzioni e fai le tue scelte

### Amministratore

1. Dalla pagina principale, clicca su "Admin" in alto a destra
2. Inserisci le credenziali:
   - Username: `000`
   - Password: `000`
3. Gestisci le scene del gioco:
   - Crea nuove scene
   - Modifica titoli e descrizioni
   - Carica immagini e video
   - Configura le scelte e i collegamenti tra scene

## Caratteristiche

- **Interfaccia moderna e responsive**: Design accattivante e mobile-friendly
- **Sistema di autenticazione admin**: Accesso protetto al pannello di controllo
- **Editor visuale**: Interfaccia intuitiva per creare e modificare le scene
- **Upload di media**: Supporto per immagini e video
- **Persistenza locale**: Tutti i dati sono salvati in file JSON locali
- **Anteprima in tempo reale**: Possibilità di testare il gioco direttamente dall'admin

## Struttura Dati

I dati del gioco sono salvati in `backend/data/gameData.json` con la seguente struttura:

```json
{
  "scenes": [
    {
      "id": 1,
      "title": "Titolo della scena",
      "description": "Descrizione della scena",
      "image": "/uploads/immagine.jpg",
      "video": "/uploads/video.mp4",
      "choices": [
        {
          "id": 1,
          "text": "Testo della scelta",
          "nextSceneId": 2
        }
      ]
    }
  ]
}
```

## API Endpoints

### Pubbliche
- `GET /api/game/data` - Ottieni tutti i dati del gioco
- `GET /api/game/scene/:id` - Ottieni una scena specifica

### Admin (richiedono autenticazione)
- `POST /api/admin/login` - Login amministratore
- `PUT /api/admin/game/data` - Aggiorna tutti i dati del gioco
- `POST /api/admin/game/scene` - Crea nuova scena
- `PUT /api/admin/game/scene/:id` - Aggiorna scena esistente
- `DELETE /api/admin/game/scene/:id` - Elimina scena
- `POST /api/admin/upload` - Upload file media

## Sviluppo

Per sviluppare il progetto:

1. Avvia il backend in modalità development:
```bash
cd backend
npm run dev
```

2. Avvia il frontend in modalità development:
```bash
cd frontend
npm run serve
```

3. Entrambi i server si riavvieranno automaticamente quando modifichi i file.

## File Importanti

- `backend/server.js` - Server principale
- `frontend/src/views/Home.vue` - Pagina principale
- `frontend/src/views/Game.vue` - Interfaccia di gioco
- `frontend/src/views/Admin.vue` - Pannello amministratore
- `backend/data/gameData.json` - Dati del gioco
- `backend/uploads/` - File media caricati
