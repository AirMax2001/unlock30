# 🧪 GUIDA AL TEST DEL SISTEMA UPLOAD

## 🚀 **COME TESTARE IL SISTEMA COMPLETO**

### 1. **AVVIO DEL SISTEMA**
```bash
# Opzione A: Script automatico
start-backend-persistent.bat

# Opzione B: Manuale
cd backend
node server-with-backup.js
```

### 2. **APERTURA FRONTEND**
1. Apri il browser
2. Vai su `http://localhost:8080` (frontend)
3. Clicca "Pannello Admin"

### 3. **TEST UPLOAD IMMAGINI**
1. **Seleziona una scena** dalla lista a sinistra
2. **Scorri fino alla sezione "Media"**
3. **Clicca "Carica Immagine"**
4. **Seleziona un'immagine** (jpg, png, gif)
5. **VERIFICA**: L'immagine dovrebbe apparire subito nell'anteprima
6. **Auto-save**: Si salva automaticamente (vedrai "Salvato" in alto a destra)

### 4. **TEST UPLOAD VIDEO**
1. **Nella stessa sezione Media**
2. **Clicca "Carica Video"**
3. **Seleziona un video** (mp4, webm, mov)
4. **VERIFICA**: Il video dovrebbe apparire nell'anteprima
5. **Auto-save**: Si salva automaticamente

### 5. **VERIFICA VISUALIZZAZIONE NEL GIOCO**
1. **Clicca "Anteprima Gioco"** nell'header
2. **Naviga fino alla scena** con immagine/video
3. **VERIFICA**: Immagine e video devono essere visibili
4. **VERIFICA**: Video deve essere riproducibile

### 6. **TEST PERSISTENZA**
1. **Chiudi tutto** (browser, terminali)
2. **Riavvia il sistema** con `start-backend-persistent.bat`
3. **Riapri l'admin**
4. **VERIFICA**: Le immagini/video devono essere ancora là

### 7. **TEST BACKUP (OPZIONALE)**
1. **Nell'admin, clicca "Backup"** (pulsante verde)
2. **Dovrebbe apparire** "Backup creato con successo"
3. **Modifica qualcosa**
4. **Clicca "Ripristina"** (pulsante arancione)
5. **VERIFICA**: Torna allo stato precedente

---

## 🔍 **COSA VERIFICARE**

### ✅ **FUNZIONA SE:**
- ✅ Immagini si caricano e appaiono nell'anteprima
- ✅ Video si caricano e sono riproducibili
- ✅ Nel gioco immagini/video sono visibili
- ✅ Dopo riavvio tutto rimane salvato
- ✅ Auto-save funziona (nessun pulsante "Salva" manuale)

### ❌ **PROBLEMI SE:**
- ❌ Upload fallisce con errore
- ❌ Immagini/video non appaiono nell'anteprima
- ❌ Nel gioco le immagini sono rotte
- ❌ Dopo riavvio i media spariscono

---

## 🛠 **RISOLUZIONE PROBLEMI**

### **Upload fallisce:**
1. Controlla che il backend sia attivo (`http://localhost:3001/api/health`)
2. Verifica la cartella `backend/uploads/` esista
3. File troppo grandi? Prova con file più piccoli

### **Immagini non si vedono:**
1. Controlla la console del browser (F12)
2. Verifica che i percorsi inizino con `/uploads/`
3. Prova a ricaricare la pagina

### **Backup non funziona:**
1. Backup è disabilitato in sviluppo (normale)
2. Su Render funzionerà automaticamente
3. Per testarlo in locale: imposta `FORCE_BACKUP=true`

---

## 📁 **DOVE SONO I FILE**

### **Immagini/Video caricati:**
```
backend/uploads/
├── 1234567890-immagine.jpg
├── 1234567891-video.mp4
└── README.md
```

### **Dati delle scene:**
```
backend/data/gameData.json
{
  "scenes": [{
    "image": "/uploads/1234567890-immagine.jpg",
    "video": "/uploads/1234567891-video.mp4"
  }]
}
```

---

## 🎯 **RISULTATO ATTESO**

Dopo il test completo dovresti avere:
1. **Sistema upload funzionante** ✅
2. **Immagini/video persistenti** ✅ 
3. **Auto-save attivo** ✅
4. **Backup automatico** ✅
5. **Cross-device ready** ✅

**Se tutto funziona = Sistema pronto per deploy su Render!** 🚀
