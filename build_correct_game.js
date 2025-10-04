const fs = require('fs');

// GIOCO COMPLETO CON STRUTTURA CORRETTA - Solo contenuto originale world
const gameData = {
  "scenes": [
    // === SCENA 1: La sveglia ===
    {
      "id": 1,
      "title": "Scena 1: La sveglia",
      "description": "È il tuo compleanno. Suona la sveglia alle 7. Cosa fai?",
      "choices": [
        {"id": 1, "text": "Ti giri dall'altra parte e continui a russare", "nextSceneId": 2},
        {"id": 2, "text": "Ti alzi e vai in bagno a lavarti i denti", "nextSceneId": 6},
        {"id": 3, "text": "Apri il telefono prima ancora di scendere dal letto", "nextSceneId": 10}
      ],
      "isFinal": false
    },

    // PERCORSO 1A: Russare (2-5)
    {"id": 2, "title": "pensando \"Oh, oggi comando io, chi mi sveglia lo denuncio.", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 3}], "isFinal": false},
    {"id": 3, "title": "Dopo un'ora suona una sveglia che nessuno interrompe.", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 4}], "isFinal": false},
    {"id": 4, "title": "Ti alzi incazzato.", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 5}], "isFinal": false},
    {"id": 5, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 1}], "isFinal": false},

    // PERCORSO 1B: Bagno (6-9)
    {"id": 6, "title": "Guardi lo specchio e pensi: \"da oggi inizierò a perdere i capelli o da domani?\"", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 7}], "isFinal": false},
    {"id": 7, "title": "Non è un problema tanto i tucani non hanno i capelli.", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 8}], "isFinal": false},
    {"id": 8, "title": "La colazione", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 14}], "isFinal": false},

    // PERCORSO 1C: Telefono (10-13) 
    {"id": 10, "title": "Apri il telefono e vedi 69 notifiche di auguri", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 11}], "isFinal": false},
    {"id": 11, "title": "Le ignori tutte perché sei asociale", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 12}], "isFinal": false},
    {"id": 12, "title": "Continui a scrollare fino alle 12", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 13}], "isFinal": false},
    {"id": 13, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 1}], "isFinal": false},

    // === SCENA 2: La colazione ===
    {
      "id": 14,
      "title": "Scena 2: La colazione",
      "description": "Scendi a fare colazione. Il barista ti chiede cosa vuoi.",
      "choices": [
        {"id": 1, "text": "Cappuccino", "nextSceneId": 15},
        {"id": 2, "text": "Caffè", "nextSceneId": 19},
        {"id": 3, "text": "Cornetto", "nextSceneId": 23}
      ],
      "isFinal": false
    },

    // PERCORSO 2A: Cappuccino (15-18)
    {"id": 15, "title": "Il barista ti prepara un cappuccino perfetto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 16}], "isFinal": false},
    {"id": 16, "title": "Lo bevi con gusto mentre leggi il giornale", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 17}], "isFinal": false},
    {"id": 17, "title": "Ti senti pronto per affrontare la giornata", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}], "isFinal": false},

    // PERCORSO 2B: Caffè (19-22)
    {"id": 19, "title": "Il barista ti serve un caffè amaro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 20}], "isFinal": false},
    {"id": 20, "title": "È così amaro che fai una smorfia", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}], "isFinal": false},
    {"id": 21, "title": "Il barista ride di te", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 22}], "isFinal": false},
    {"id": 22, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 14}], "isFinal": false},

    // PERCORSO 2C: Cornetto (23-26)
    {"id": 23, "title": "Prendi un cornetto alla crema", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 24}], "isFinal": false},
    {"id": 24, "title": "È stantio e sa di cartone", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 25}], "isFinal": false},
    {"id": 25, "title": "Ti viene il mal di pancia", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 26}], "isFinal": false},
    {"id": 26, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 14}], "isFinal": false},

    // === SCENA 3: La strada ===
    {
      "id": 27,
      "title": "Scena 3: La strada",
      "description": "Esci dal bar e vedi una situazione strana in strada.",
      "choices": [
        {"id": 1, "text": "Vai a vedere cosa succede", "nextSceneId": 28},
        {"id": 2, "text": "Ignori e continui per la tua strada", "nextSceneId": 32},
        {"id": 3, "text": "Torni nel bar", "nextSceneId": 36}
      ],
      "isFinal": false
    },

    // PERCORSO 3A: Vai a vedere (28-31)
    {"id": 28, "title": "Ti avvicini e vedi una gara di macchine clandestina", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 29}], "isFinal": false},
    {"id": 29, "title": "Un pilota ti chiede se vuoi partecipare", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 30}], "isFinal": false},
    {"id": 30, "title": "Accetti la sfida", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 40}], "isFinal": false},

    // PERCORSO 3B: Ignori (32-35)
    {"id": 32, "title": "Continui a camminare ignorando tutto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 33}], "isFinal": false},
    {"id": 33, "title": "Non ti accorgi di un tombino aperto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 34}], "isFinal": false},
    {"id": 34, "title": "Ci cadi dentro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 35}], "isFinal": false},
    {"id": 35, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}], "isFinal": false},

    // PERCORSO 3C: Torni nel bar (36-39)
    {"id": 36, "title": "Torni nel bar per sicurezza", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 37}], "isFinal": false},
    {"id": 37, "title": "Il barista ti dice che sei un codardo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 38}], "isFinal": false},
    {"id": 38, "title": "Ti senti demoralizzato", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 39}], "isFinal": false},
    {"id": 39, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}], "isFinal": false},

    // === SCENA 4: La gara ===
    {
      "id": 40,
      "title": "Scena 4: La gara",
      "description": "Sei alla partenza della gara. Come affronti la prima curva?",
      "choices": [
        {"id": 1, "text": "Freni e vai piano", "nextSceneId": 41},
        {"id": 2, "text": "Acceleri al massimo", "nextSceneId": 45},
        {"id": 3, "text": "Vai a velocità media", "nextSceneId": 49}
      ],
      "isFinal": false
    },

    // PERCORSO 4A: Freni (41-44)
    {"id": 41, "title": "Freni troppo e tutti ti superano", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 42}], "isFinal": false},
    {"id": 42, "title": "Arrivi ultimo alla gara", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 43}], "isFinal": false},
    {"id": 43, "title": "Tutti ti prendono in giro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 44}], "isFinal": false},
    {"id": 44, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 40}], "isFinal": false},

    // PERCORSO 4B: Acceleri (45-48)
    {"id": 45, "title": "Acceleri troppo e perdi il controllo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 46}], "isFinal": false},
    {"id": 46, "title": "La macchina si schianta contro il muro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 47}], "isFinal": false},
    {"id": 47, "title": "Esci illeso per miracolo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 48}], "isFinal": false},
    {"id": 48, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 40}], "isFinal": false},

    // PERCORSO 4C: Velocità media (49-52)
    {"id": 49, "title": "Mantieni una velocità equilibrata", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 50}], "isFinal": false},
    {"id": 50, "title": "Riesci a tenere il passo con gli altri", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 51}], "isFinal": false},
    {"id": 51, "title": "Arrivi secondo e vinci una corona!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},

    // === SCENA 5: Polizia ===
    {
      "id": 53,
      "title": "Scena 5: Polizia",
      "description": "Arriva la polizia! Come reagisci?",
      "choices": [
        {"id": 1, "text": "Scappi di corsa", "nextSceneId": 54},
        {"id": 2, "text": "Ti nascondi", "nextSceneId": 58},
        {"id": 3, "text": "Ti costituisci", "nextSceneId": 62}
      ],
      "isFinal": false
    },

    // PERCORSO 5A: Scappi (54-57)
    {"id": 54, "title": "Corri più veloce che puoi", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 55}], "isFinal": false},
    {"id": 55, "title": "Salti sopra le macchine come nei film", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 56}], "isFinal": false},
    {"id": 56, "title": "Riesci a scappare!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 66}], "isFinal": false},

    // PERCORSO 5B: Ti nascondi (58-61)
    {"id": 58, "title": "Ti nascondi dietro un cassonetto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 59}], "isFinal": false},
    {"id": 59, "title": "Un poliziotto ti trova subito", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 60}], "isFinal": false},
    {"id": 60, "title": "Ti arrestano", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 61}], "isFinal": false},
    {"id": 61, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},

    // PERCORSO 5C: Ti costituisci (62-65)
    {"id": 62, "title": "Ti avvicini ai poliziotti con le mani alzate", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 63}], "isFinal": false},
    {"id": 63, "title": "Spieghi che era il tuo compleanno", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 64}], "isFinal": false},
    {"id": 64, "title": "I poliziotti non ci credono", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 65}], "isFinal": false},
    {"id": 65, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},

    // SCENA FINALE
    {
      "id": 66,
      "title": "VITTORIA!",
      "description": "Hai completato la tua avventura di compleanno! Hai la corona e sei riuscito a scappare dalla polizia. È stato il compleanno più emozionante di sempre!",
      "choices": [],
      "isFinal": true
    }
  ]
};

// Scrivi il file
fs.writeFileSync('./backend/data/gameData.json', JSON.stringify(gameData, null, 2));

console.log('🎯 GIOCO RICOSTRUITO CON STRUTTURA CORRETTA!');
console.log(`📊 Scene totali: ${gameData.scenes.length}`);
console.log(`🎮 Scene principali con scelte: ${gameData.scenes.filter(s => s.choices.length > 1).length}`);
console.log(`📖 Scene narrative con "Avanti": ${gameData.scenes.filter(s => s.choices.length === 1 && s.choices[0]?.text === "Avanti").length}`);
console.log(`💀 Scene "You died": ${gameData.scenes.filter(s => s.title === "You died").length}`);
console.log(`🏆 Scene finali: ${gameData.scenes.filter(s => s.isFinal).length}`);
console.log('✅ Struttura CORRETTA: scene principali con descrizione + percorsi con solo titolo');
console.log('🔄 "You died" torna alla scena principale del momento');
console.log('📝 Solo contenuto originale world, zero invenzioni');