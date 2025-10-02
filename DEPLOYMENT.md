# Deployment su maristellacichella.altervista.org

## ⚠️ SOLUZIONE PROBLEMA "Pagina index mancante"

Il messaggio "Pagina index mancante" significa che devi caricare i file compilati sul server Altervista.

### 🚀 Deployment Rapido

#### Passo 1: Build del Progetto
```bash
# Esegui il build automatico
build-production.bat
```

#### Passo 2: Upload su Altervista
1. **Vai al tuo pannello Altervista**
2. **Apri FileManager** o usa FTP
3. **Vai nella cartella `public_html`**
4. **Carica TUTTO il contenuto** della cartella `dist\public_html\` (creata dal build)

#### Passo 3: Configurazione Altervista
1. **Pannello Altervista** → **Risorse** → **Node.js**
2. **Abilita Node.js** per il tuo sito
3. **Imposta file principale**: `server.js`
4. **Salva le modificazioni**

### 📁 Struttura File da Caricare

Dopo il build, carica questi file in `public_html`:

```
public_html/
├── index.html          ← FILE PRINCIPALE (risolve "pagina mancante")
├── css/
│   └── app.xxx.css
├── js/
│   ├── app.xxx.js
│   └── chunk-vendors.xxx.js
├── server.js           ← Backend Node.js
├── package.json        ← Dipendenze
├── data/              ← Dati del gioco (si crea automaticamente)
├── uploads/           ← Media files
└── .htaccess          ← Configurazione server
```

### ✅ Verifica Funzionamento

1. **Frontend**: http://maristellacichella.altervista.org/
2. **API Test**: http://maristellacichella.altervista.org/api/game/data
3. **Admin**: http://maristellacichella.altervista.org/#/admin

### 🔧 Troubleshooting

#### "Pagina index mancante"
- **Causa**: File `index.html` non caricato
- **Soluzione**: Esegui `build-production.bat` e carica tutto in `public_html`

#### "Errore 500" o Backend non funziona
- **Verifica**: Node.js abilitato nel pannello Altervista
- **Verifica**: `server.js` presente in `public_html`
- **Verifica**: `package.json` presente in `public_html`

#### "CORS errors" in console
- **Verifica**: File `.htaccess` presente in `public_html`
- **Verifica**: Headers CORS configurati correttamente

### 📋 Checklist Deployment

- [ ] Eseguito `build-production.bat`
- [ ] Caricato contenuto `dist\public_html\` su Altervista
- [ ] File `index.html` presente in `public_html`
- [ ] Node.js abilitato nel pannello Altervista
- [ ] File `server.js` impostato come principale
- [ ] Sito raggiungibile su maristellacichella.altervista.org

### 🎮 Test Finale

1. **Apri**: http://maristellacichella.altervista.org/
2. **Dovresti vedere**: La homepage del gioco con pulsante "Avvia Gioco"
3. **Test Admin**: Clicca "Admin" → Login 000/000
4. **Test Gioco**: Clicca "Avvia Gioco"

Se tutto funziona, il deployment è completato! 🎉

### Struttura Server

```
maristellacichella.altervista.org/
├── index.html (da frontend/dist/)
├── static/ (da frontend/dist/)
├── api/ (gestito dal backend Node.js)
├── uploads/ (file media)
└── data/ (file JSON del gioco)
```

### URLs del Gioco

- **Gioco**: http://maristellacichella.altervista.org/
- **Admin**: http://maristellacichella.altervista.org/#/admin
- **API**: http://maristellacichella.altervista.org/api/

### Test in Locale

Per testare ancora in locale:
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

Il sistema si adatta automaticamente all'ambiente!

### Note per Altervista

Se usi Altervista, potrebbe essere necessario:

1. **Configurare Node.js** nel pannello di controllo
2. **Impostare la directory pubblica** su `public_html`
3. **Configurare le variabili d'ambiente** nel pannello

### Credenziali Admin

- **Username**: 000
- **Password**: 000

### Supporto

Se hai problemi con il deployment, controlla:
1. Console del browser (F12) per errori frontend
2. Log del server per errori backend
3. Configurazione CORS se ci sono problemi di connessione
