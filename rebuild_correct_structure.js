const fs = require('fs');

// Ricostruzione con struttura corretta: ogni punto = scena separata
const gameData = {
  "scenes": [
    // SCENA 1: La sveglia (scena principale con 3 scelte)
    {
      "id": 1,
      "title": "La sveglia",
      "description": "",
      "choices": [
        {
          "id": 1,
          "text": "Ti giri dall altra parte e continui a russare",
          "nextSceneId": 2
        },
        {
          "id": 2, 
          "text": "Ti alzi e vai in bagno a lavarti i denti",
          "nextSceneId": 5
        },
        {
          "id": 3,
          "text": "Apri il telefono prima ancora di scendere dal letto", 
          "nextSceneId": 8
        }
      ],
      "isFinal": false
    },

    // PERCORSO 1: Russare (scene 2-4)
    {
      "id": 2,
      "title": "Ti giri dall altra parte e continui a russare",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 3}],
      "isFinal": false
    },
    {
      "id": 3, 
      "title": "Ti giri dall'altra parte e continui a dormire, ma tua madre ti sveglia urlando \"MASSIMO ALZATI CHE È TARDI!\"",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 4}],
      "isFinal": false
    },
    {
      "id": 4,
      "title": "You died",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 1}],
      "isFinal": false
    },

    // PERCORSO 2: Bagno e denti (scene 5-7)  
    {
      "id": 5,
      "title": "Ti alzi e vai in bagno a lavarti i denti",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 6}],
      "isFinal": false
    },
    {
      "id": 6,
      "title": "Mentre ti guardi allo specchio pensi: \"Oggi è il mio compleanno, chissà che regalo mi faranno!\"",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 7}],
      "isFinal": false
    },
    {
      "id": 7,
      "title": "Vai a fare colazione",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 11}],
      "isFinal": false
    },

    // PERCORSO 3: Telefono (scene 8-10)
    {
      "id": 8,
      "title": "Apri il telefono prima ancora di scendere dal letto",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 9}],
      "isFinal": false
    },
    {
      "id": 9,
      "title": "Vedi centinaia di notifiche di auguri! Tutti i tuoi amici si sono ricordati del tuo compleanno",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 10}],
      "isFinal": false
    },
    {
      "id": 10,
      "title": "You died",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 1}],
      "isFinal": false
    },

    // SCENA 11: Colazione al bar (nuova scena principale con 3 scelte)
    {
      "id": 11,
      "title": "Colazione al bar",
      "description": "",
      "choices": [
        {
          "id": 1,
          "text": "Sì, ma oggi è il mio compleanno, quindi fallo extra buono!",
          "nextSceneId": 12
        },
        {
          "id": 2,
          "text": "Oggi provo qualcosa di diverso",
          "nextSceneId": 15
        },
        {
          "id": 3,
          "text": "Non ho tempo, devo scappare",
          "nextSceneId": 18
        }
      ],
      "isFinal": false
    },

    // PERCORSO 1: Cappuccino speciale (scene 12-14)
    {
      "id": 12,
      "title": "Il barista ti prepara un cappuccino speciale con un cuoricino nella schiuma!",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 13}],
      "isFinal": false
    },
    {
      "id": 13,
      "title": "Mentre lo bevi, senti delle macchine che sgommano fuori dal bar",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 14}],
      "isFinal": false
    },
    {
      "id": 14,
      "title": "Esci a vedere cosa succede",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}],
      "isFinal": false
    },

    // PERCORSO 2: Qualcosa di diverso (scene 15-17)
    {
      "id": 15,
      "title": "Oggi provo qualcosa di diverso",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 16}],
      "isFinal": false
    },
    {
      "id": 16,
      "title": "Il barista ti dà un caffè amaro che sa di bruciato",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 17}],
      "isFinal": false
    },
    {
      "id": 17,
      "title": "You died",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 11}],
      "isFinal": false
    },

    // PERCORSO 3: Scappare (scene 18-20)
    {
      "id": 18,
      "title": "Non ho tempo, devo scappare",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 19}],
      "isFinal": false
    },
    {
      "id": 19,
      "title": "Corri fuori ma inciampi e cadi malamente",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 20}],
      "isFinal": false
    },
    {
      "id": 20,
      "title": "You died",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 11}],
      "isFinal": false
    },

    // SCENA 21: La gara clandestina (nuova scena principale)
    {
      "id": 21,
      "title": "La gara clandestina",
      "description": "",
      "choices": [
        {
          "id": 1,
          "text": "Sì! Oggi è il mio compleanno, devo vincere quella corona!",
          "nextSceneId": 22
        },
        {
          "id": 2,
          "text": "No grazie, sono troppo pericolose",
          "nextSceneId": 25
        },
        {
          "id": 3,
          "text": "Guardo ma non partecipo",
          "nextSceneId": 28
        }
      ],
      "isFinal": false
    },

    // PERCORSO 1: Partecipo alla gara (scene 22-24)
    {
      "id": 22,
      "title": "Sali su una macchina sportiva e parti a tutta velocità",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 23}],
      "isFinal": false
    },
    {
      "id": 23,
      "title": "Dopo una gara mozzafiato, vinci la corona d'oro!",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 24}],
      "isFinal": false
    },
    {
      "id": 24,
      "title": "VITTORIA! Hai completato la tua avventura di compleanno!",
      "description": "",
      "choices": [],
      "isFinal": true
    },

    // PERCORSO 2: Troppo pericolose (scene 25-27)
    {
      "id": 25,
      "title": "No grazie, sono troppo pericolose",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 26}],
      "isFinal": false
    },
    {
      "id": 26,
      "title": "I piloti ti deridono e ti buttano addosso fango",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}],
      "isFinal": false
    },
    {
      "id": 27,
      "title": "You died",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}],
      "isFinal": false
    },

    // PERCORSO 3: Solo guardare (scene 28-30)
    {
      "id": 28,
      "title": "Guardo ma non partecipo",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 29}],
      "isFinal": false
    },
    {
      "id": 29,
      "title": "Ti annoi e te ne vai, perdendo l'occasione della vita",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 30}],
      "isFinal": false
    },
    {
      "id": 30,
      "title": "You died",
      "description": "",
      "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}],
      "isFinal": false
    }
  ]
};

// Scrivi il file
fs.writeFileSync('./backend/data/gameData.json', JSON.stringify(gameData, null, 2));

console.log('✅ GIOCO RICOSTRUITO CON STRUTTURA CORRETTA!');
console.log(`📊 Scene totali: ${gameData.scenes.length}`);
console.log(`🎯 Scene principali con scelte multiple: ${gameData.scenes.filter(s => s.choices.length > 1).length}`);
console.log(`📝 Scene narrative con "Avanti": ${gameData.scenes.filter(s => s.choices.length === 1 && s.choices[0]?.text === "Avanti").length}`);
console.log(`💀 Scene "You died": ${gameData.scenes.filter(s => s.title === "You died").length}`);
console.log(`🏆 Scene finali: ${gameData.scenes.filter(s => s.isFinal).length}`);
console.log('🔄 Ogni punto del testo originale = scena separata');
console.log('💯 Solo contenuto originale, nessuna aggiunta');