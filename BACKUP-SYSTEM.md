# 🔒 UNLOCK30 - SISTEMA DI BACKUP AUTOMATICO

## 🚨 PROBLEMA RISOLTO
**Prima**: I dati si perdevano quando chiudevi il browser o Render riavviava il server
**Ora**: I dati sono salvati permanentemente su Git e sincronizzati automaticamente

## 📡 COME FUNZIONA

### 🔄 BACKUP AUTOMATICO
1. **Ogni volta che salvi** una scena → Backup su Git
2. **Ogni volta che carichi** un'immagine → Backup su Git  
3. **All'avvio del server** → Backup iniziale su Git

### ☁️ CONTROLLI MANUALI (Pulsanti nell'Admin)
- **🟢 Backup**: Forza un backup immediato su Git
- **🟠 Ripristina**: Recupera gli ultimi dati da Git

## 📁 DOVE SONO I DATI

### 🌐 Su Render (Produzione)
```
https://tuo-app.onrender.com/
├── Dati salvati automaticamente su Git
├── Immagini/video sincronizzate
└── Backup automatico ogni modifica
```

### 💻 In Locale (Sviluppo)
```
C:\Users\AirMax\Documents\GitHub\unlock30\
├── backend\data\gameData.json     ← I tuoi dati
├── backend\uploads\               ← Immagini/video
├── backup\                        ← Backup automatici
└── .git\                          ← Storia completa
```

## 🎯 COSA CAMBIA PER TE

### ✅ VANTAGGI
- **Mai più dati persi** - tutto salvato su Git
- **Sincronizzazione cross-device** - stesso account ovunque
- **Backup automatico** - non devi pensarci
- **Storia completa** - puoi tornare a versioni precedenti
- **Immagini persistent** - non spariscono più

### 📱 COME USARLO
1. **Sviluppo**: Usa `start-backend-persistent.bat` per lavoro locale
2. **Produzione**: Deploy con `deploy-render.bat` 
3. **Backup**: Pulsanti "Backup" e "Ripristina" nell'admin
4. **Sync**: I dati si sincronizzano automaticamente

## 🛠 COMANDI UTILI

### Per lo sviluppo locale:
```bash
start-backend-persistent.bat    # Avvia backend locale
check-data-persistence.bat      # Verifica dati salvati
stop-backend.bat               # Ferma backend locale
```

### Per il deploy:
```bash
deploy-render.bat              # Deploy completo su Render
```

## 🔧 CONFIGURAZIONE RENDER

### Variabili d'ambiente da impostare:
```
NODE_ENV=production
PORT=3001
```

### Build settings:
```
Build Command: cd frontend && npm install && npm run build
Start Command: cd backend && npm install && node server-with-backup.js
```

## 📞 SUPPORTO

Se hai problemi:
1. Controlla che Git sia configurato
2. Verifica la connessione internet
3. Usa `check-data-persistence.bat` per diagnosi
4. I backup sono in `backup\gameData_backup_*.json`

## 🎉 RISULTATO FINALE

✅ **Dati sempre al sicuro**
✅ **Backup automatico su Git** 
✅ **Sincronizzazione cross-device**
✅ **Immagini/video persistenti**
✅ **Nessuna perdita di dati**

**Non dovrai più preoccuparti di perdere il tuo lavoro!** 🚀
