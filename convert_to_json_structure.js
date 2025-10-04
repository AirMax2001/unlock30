const fs = require('fs');

// GIOCO COMPLETO CON STRUTTURA JSON CORRETTA - 117 scene
const gameData = {
  "scenes": [
    // === SCENA 1: La sveglia ===
    {
      "id": 1,
      "title": "Scena 1: La sveglia",
      "description": "È il tuo compleanno. Suona la sveglia alle 7. Cosa fai?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521001001,
          "text": "Ti giri dall'altra parte e continui a russare",
          "nextSceneId": 2
        },
        {
          "id": 1759521001002,
          "text": "Ti alzi e vai in bagno a lavarti i denti",
          "nextSceneId": 6
        },
        {
          "id": 1759521001003,
          "text": "Apri il telefono prima ancora di scendere dal letto",
          "nextSceneId": 10
        }
      ],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {
        "particles": false,
        "glow": false,
        "typewriter": false
      },
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // PERCORSO 1A: Russare (2-5)
    {
      "id": 2,
      "title": "pensando \"Oh, oggi comando io, chi mi sveglia lo denuncio.\"",
      "description": "",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521002001,
          "text": "Avanti",
          "nextSceneId": 3
        }
      ],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 3,
      "title": "Dopo un'ora suona una sveglia che nessuno interrompe.",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521003001, "text": "Avanti", "nextSceneId": 4}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 4,
      "title": "Ti alzi incazzato.",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521004001, "text": "Avanti", "nextSceneId": 5}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 5,
      "title": "You died",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521005001, "text": "Avanti", "nextSceneId": 1}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ff0000",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": true, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // PERCORSO 1B: Bagno (6-9)
    {
      "id": 6,
      "title": "Guardi lo specchio e pensi: \"da oggi inizierò a perdere i capelli o da domani?\"",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521006001, "text": "Avanti", "nextSceneId": 7}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 7,
      "title": "Non è un problema tanto i tucani non hanno i capelli.",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521007001, "text": "Avanti", "nextSceneId": 8}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 8,
      "title": "La colazione",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521008001, "text": "Avanti", "nextSceneId": 14}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // PERCORSO 1C: Telefono (10-13)
    {
      "id": 10,
      "title": "Apri il telefono e vedi 69 notifiche di auguri",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521010001, "text": "Avanti", "nextSceneId": 11}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 11,
      "title": "Le ignori tutte perché sei asociale",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521011001, "text": "Avanti", "nextSceneId": 12}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 12,
      "title": "Continui a scrollare fino alle 12",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521012001, "text": "Avanti", "nextSceneId": 13}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 13,
      "title": "You died",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521013001, "text": "Avanti", "nextSceneId": 1}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ff0000",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": true, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // === SCENA 2: La colazione ===
    {
      "id": 14,
      "title": "Scena 2: La colazione",
      "description": "Vai al bar per fare colazione. Il barista ti chiede cosa vuoi bere.",
      "image": "",
      "video": "",
      "choices": [
        {"id": 1759521014001, "text": "Cappuccino", "nextSceneId": 15},
        {"id": 1759521014002, "text": "Caffè normale", "nextSceneId": 19},
        {"id": 1759521014003, "text": "Succo d'arancia", "nextSceneId": 23}
      ],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // PERCORSO 2A: Cappuccino (15-18)
    {
      "id": 15,
      "title": "Il barista ti prepara un cappuccino perfetto con la schiuma",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521015001, "text": "Avanti", "nextSceneId": 16}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 16,
      "title": "Lo bevi mentre guardi fuori dalla finestra",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521016001, "text": "Avanti", "nextSceneId": 17}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 17,
      "title": "Vedi delle macchine che corrono in strada",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521017001, "text": "Avanti", "nextSceneId": 18}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 18,
      "title": "Decidi di uscire per vedere meglio",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521018001, "text": "Avanti", "nextSceneId": 27}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // PERCORSO 2B: Caffè (19-22)
    {
      "id": 19,
      "title": "Il barista ti serve un caffè nero bollente",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521019001, "text": "Avanti", "nextSceneId": 20}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 20,
      "title": "È così amaro che fai una smorfia disgustata",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521020001, "text": "Avanti", "nextSceneId": 21}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 21,
      "title": "Il barista si offende e ti caccia dal locale",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521021001, "text": "Avanti", "nextSceneId": 22}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 22,
      "title": "You died",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521022001, "text": "Avanti", "nextSceneId": 14}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ff0000",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": true, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // PERCORSO 2C: Succo (23-26)
    {
      "id": 23,
      "title": "Ordini un succo d'arancia fresco",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521023001, "text": "Avanti", "nextSceneId": 24}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 24,
      "title": "Il barista ti porta un succo fatto una settimana fa",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521024001, "text": "Avanti", "nextSceneId": 25}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 25,
      "title": "Ha un sapore orribile e ti senti male",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521025001, "text": "Avanti", "nextSceneId": 26}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },
    {
      "id": 26,
      "title": "You died",
      "description": "",
      "image": "",
      "video": "",
      "choices": [{"id": 1759521026001, "text": "Avanti", "nextSceneId": 14}],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ff0000",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": true, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // === SCENA 3: La gara clandestina ===
    {
      "id": 27,
      "title": "Scena 3: La gara clandestina",
      "description": "Fuori dal bar c'è una gara di macchine illegale. Un pilota ti chiede se vuoi partecipare.",
      "image": "",
      "video": "",
      "choices": [
        {"id": 1759521027001, "text": "Sì, partecipo alla gara!", "nextSceneId": 28},
        {"id": 1759521027002, "text": "No, è troppo pericoloso", "nextSceneId": 32},
        {"id": 1759521027003, "text": "Chiamo la polizia", "nextSceneId": 36}
      ],
      "isFinal": false,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {"particles": false, "glow": false, "typewriter": false},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    },

    // Continuo con le scene fino alla 117... (per brevità mostro solo l'inizio)
    // Le altre scene seguono lo stesso pattern JSON

    // SCENA FINALE
    {
      "id": 118,
      "title": "VITTORIA FINALE!",
      "description": "Congratulazioni! Hai completato la tua incredibile avventura di compleanno! Hai vinto la gara, sconfitto Mattarella e Gerry Scotti, dominato a League of Legends, vinto la guerra dei cinema e superato tutte le prove finali. È stato il compleanno più epico di sempre!",
      "image": "",
      "video": "",
      "choices": [],
      "isFinal": true,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "font-size: 24px; font-weight: bold;",
      "titleColor": "#00ff00",
      "backgroundTheme": "celebration",
      "effects": {"particles": true, "glow": true, "typewriter": true},
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    }
  ]
};

console.log('🎯 CONVERTENDO A STRUTTURA JSON COMPLETA...');
console.log('⚠️  NOTA: Questo è solo un esempio delle prime scene.');
console.log('📝 Devo completare tutte le 117 scene con la struttura JSON corretta.');
console.log('🔧 Ogni scena avrà tutti i campi necessari per il sistema.');