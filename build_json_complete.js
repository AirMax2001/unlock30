const fs = require('fs');

// Leggo la struttura attuale per capire il formato
const currentData = JSON.parse(fs.readFileSync('./backend/data/gameData.json', 'utf8'));

// Creo tutte le 117 scene con struttura JSON completa
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
      "titleStyle": "font-weight: bold;",
      "titleColor": "#ffffff",
      "backgroundTheme": "",
      "effects": {
        "particles": false,
        "glow": false,
        "typewriter": false
      },
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    }
  ]
};

// Aggiungo tutte le altre 116 scene programmaticamente
const scenes = [
  // PERCORSO 1A: Russare (2-5)
  {id: 2, title: "pensando \"Oh, oggi comando io, chi mi sveglia lo denuncio.\"", next: 3},
  {id: 3, title: "Dopo un'ora suona una sveglia che nessuno interrompe.", next: 4},
  {id: 4, title: "Ti alzi incazzato.", next: 5},
  {id: 5, title: "You died", next: 1, youDied: true},

  // PERCORSO 1B: Bagno (6-9)
  {id: 6, title: "Guardi lo specchio e pensi: \"da oggi inizierò a perdere i capelli o da domani?\"", next: 7},
  {id: 7, title: "Non è un problema tanto i tucani non hanno i capelli.", next: 8},
  {id: 8, title: "La colazione", next: 14},

  // PERCORSO 1C: Telefono (10-13)
  {id: 10, title: "Apri il telefono e vedi 69 notifiche di auguri", next: 11},
  {id: 11, title: "Le ignori tutte perché sei asociale", next: 12},
  {id: 12, title: "Continui a scrollare fino alle 12", next: 13},
  {id: 13, title: "You died", next: 1, youDied: true},

  // === SCENA 2: La colazione ===
  {
    id: 14, 
    title: "Scena 2: La colazione",
    description: "Vai al bar per fare colazione. Il barista ti chiede cosa vuoi bere.",
    choices: [
      {id: 1759521014001, text: "Cappuccino", nextSceneId: 15},
      {id: 1759521014002, text: "Caffè normale", nextSceneId: 19},
      {id: 1759521014003, text: "Succo d'arancia", nextSceneId: 23}
    ],
    mainScene: true
  },

  // PERCORSO 2A: Cappuccino (15-18)
  {id: 15, title: "Il barista ti prepara un cappuccino perfetto con la schiuma", next: 16},
  {id: 16, title: "Lo bevi mentre guardi fuori dalla finestra", next: 17},
  {id: 17, title: "Vedi delle macchine che corrono in strada", next: 18},
  {id: 18, title: "Decidi di uscire per vedere meglio", next: 27},

  // PERCORSO 2B: Caffè (19-22)
  {id: 19, title: "Il barista ti serve un caffè nero bollente", next: 20},
  {id: 20, title: "È così amaro che fai una smorfia disgustata", next: 21},
  {id: 21, title: "Il barista si offende e ti caccia dal locale", next: 22},
  {id: 22, title: "You died", next: 14, youDied: true},

  // PERCORSO 2C: Succo (23-26)
  {id: 23, title: "Ordini un succo d'arancia fresco", next: 24},
  {id: 24, title: "Il barista ti porta un succo fatto una settimana fa", next: 25},
  {id: 25, title: "Ha un sapore orribile e ti senti male", next: 26},
  {id: 26, title: "You died", next: 14, youDied: true},

  // === SCENA 3: La gara clandestina ===
  {
    id: 27,
    title: "Scena 3: La gara clandestina", 
    description: "Fuori dal bar c'è una gara di macchine illegale. Un pilota ti chiede se vuoi partecipare.",
    choices: [
      {id: 1759521027001, text: "Sì, partecipo alla gara!", nextSceneId: 28},
      {id: 1759521027002, text: "No, è troppo pericoloso", nextSceneId: 32},
      {id: 1759521027003, text: "Chiamo la polizia", nextSceneId: 36}
    ],
    mainScene: true
  },

  // PERCORSO 3A: Partecipo (28-31)
  {id: 28, title: "Sali su una macchina sportiva rossa", next: 29},
  {id: 29, title: "La gara inizia e parti a tutta velocità", next: 30},
  {id: 30, title: "Dopo una gara mozzafiato arrivi secondo", next: 31},
  {id: 31, title: "Il vincitore ti regala una corona d'oro per il compleanno!", next: 40},

  // PERCORSO 3B: Troppo pericoloso (32-35)
  {id: 32, title: "Rifiuti di partecipare perché hai paura", next: 33},
  {id: 33, title: "I piloti ti prendono in giro chiamandoti codardo", next: 34},
  {id: 34, title: "Ti senti umiliato davanti a tutti", next: 35},
  {id: 35, title: "You died", next: 27, youDied: true},

  // PERCORSO 3C: Chiamo polizia (36-39)
  {id: 36, title: "Decidi di chiamare la polizia per fermare la gara", next: 37},
  {id: 37, title: "I piloti ti sentono e si arrabbiano molto", next: 38},
  {id: 38, title: "Ti inseguono per picchiarti", next: 39},
  {id: 39, title: "You died", next: 27, youDied: true},

  // === SCENA 4: Inseguimento polizia ===
  {
    id: 40,
    title: "Scena 4: Inseguimento polizia",
    description: "Arriva la polizia e inizia un inseguimento! Come scappi?",
    choices: [
      {id: 1759521040001, text: "Scappi a piedi tra i vicoli", nextSceneId: 41},
      {id: 1759521040002, text: "Usi i tuoi poteri anime per volare", nextSceneId: 45},
      {id: 1759521040003, text: "Ti nascondi in un cassonetto", nextSceneId: 49}
    ],
    mainScene: true
  },

  // PERCORSO 4A: Scappi vicoli (41-44)
  {id: 41, title: "Corri attraverso i vicoli stretti del centro", next: 42},
  {id: 42, title: "Salti sopra le macchine parcheggiate", next: 43},
  {id: 43, title: "Riesci a seminare la polizia", next: 44},
  {id: 44, title: "Ti ritrovi davanti a un grande palazzo: l'IKEA", next: 53},

  // PERCORSO 4B: Poteri anime (45-48)
  {id: 45, title: "Attivi i tuoi poteri anime segreti", next: 46},
  {id: 46, title: "Cominci a volare sopra la città come un supereroe", next: 47},
  {id: 47, title: "La polizia resta senza parole guardandoti volare", next: 48},
  {id: 48, title: "Atterri dall'altra parte della città, al sicuro", next: 53},

  // PERCORSO 4C: Cassonetto (49-52)
  {id: 49, title: "Ti tuffi in un cassonetto per nasconderti", next: 50},
  {id: 50, title: "Un poliziotto ti trova subito perché puzzi", next: 51},
  {id: 51, title: "Ti arrestano e ti portano in questura", next: 52},
  {id: 52, title: "You died", next: 40, youDied: true},

  // === SCENA 5: Boss battle IKEA ===
  {
    id: 53,
    title: "Scena 5: Boss battle IKEA",
    description: "Entri nell'IKEA e trovi Mattarella che ti aspetta per un duello epico tra i mobili!",
    choices: [
      {id: 1759521053001, text: "Attacchi con una poltrona POÄNG", nextSceneId: 54},
      {id: 1759521053002, text: "Lanci delle polpette del ristorante", nextSceneId: 58},
      {id: 1759521053003, text: "Cerchi di convincerlo diplomaticamente", nextSceneId: 62}
    ],
    mainScene: true
  },

  // PERCORSO 5A: Poltrona (54-57)
  {id: 54, title: "Afferri una poltrona POÄNG e la lanci contro Mattarella", next: 55},
  {id: 55, title: "Mattarella schiva agilmente e contrattacca con una libreria BILLY", next: 56},
  {id: 56, title: "Riesci a schivare la libreria per un pelo", next: 57},
  {id: 57, title: "Mattarella ammette la sconfitta e se ne va", next: 66},

  // PERCORSO 5B: Polpette (58-61)
  {id: 58, title: "Prendi le polpette dal ristorante IKEA", next: 59},
  {id: 59, title: "Le lanci come granate contro Mattarella", next: 60},
  {id: 60, title: "Mattarella scivola sulla salsa e cade", next: 61},
  {id: 61, title: "You died", next: 53, youDied: true},

  // PERCORSO 5C: Diplomazia (62-65)
  {id: 62, title: "Cerchi di convincere Mattarella con le parole", next: 63},
  {id: 63, title: "Gli spieghi che è il tuo compleanno", next: 64},
  {id: 64, title: "Mattarella non ci crede e ti attacca", next: 65},
  {id: 65, title: "You died", next: 53, youDied: true},

  // === SCENA 6: Boss battle Supermercato ===
  {
    id: 66,
    title: "Scena 6: Boss battle Supermercato",
    description: "Esci dall'IKEA e entri in un supermercato dove trovi Gerry Scotti pronto per un altro duello!",
    choices: [
      {id: 1759521066001, text: "Lanci carrelli della spesa", nextSceneId: 67},
      {id: 1759521066002, text: "Usi le banane come boomerang", nextSceneId: 71},
      {id: 1759521066003, text: "Lo sfidi a un quiz televisivo", nextSceneId: 75}
    ],
    mainScene: true
  },

  // PERCORSO 6A: Carrelli (67-70)
  {id: 67, title: "Afferri dei carrelli e li lanci contro Gerry", next: 68},
  {id: 68, title: "Gerry schiva ridendo e dice 'Sbagliato!'", next: 69},
  {id: 69, title: "Ti lancia contro delle lattine di pomodoro", next: 70},
  {id: 70, title: "You died", next: 66, youDied: true},

  // PERCORSO 6B: Banane (71-74)
  {id: 71, title: "Prendi un casco di banane e le lanci come boomerang", next: 72},
  {id: 72, title: "Le banane colpiscono Gerry che scivola comicamente", next: 73},
  {id: 73, title: "Gerry si rialza ridendo e ti fa i complimenti", next: 74},
  {id: 74, title: "Vinci il duello e Gerry se ne va", next: 79},

  // PERCORSO 6C: Quiz (75-78)
  {id: 75, title: "Lo sfidi: 'Gerry, facciamo un quiz!'", next: 76},
  {id: 76, title: "Gerry accetta sorridendo: 'Quanto fa 2+2?'", next: 77},
  {id: 77, title: "Rispondi '4' e Gerry ammette la sconfitta", next: 78},
  {id: 78, title: "Ti regala 1 milione di euro virtuali", next: 79},

  // === SCENA 7: Esports League of Legends ===
  {
    id: 79,
    title: "Scena 7: Esports League of Legends",
    description: "Trovi un internet café e decidi di giocare a League of Legends. Che champion scegli?",
    choices: [
      {id: 1759521079001, text: "Yasuo mid lane", nextSceneId: 80},
      {id: 1759521079002, text: "Thresh support", nextSceneId: 84},
      {id: 1759521079003, text: "Teemo jungle (per trollare)", nextSceneId: 88}
    ],
    mainScene: true
  },

  // PERCORSO 7A: Yasuo (80-83)
  {id: 80, title: "Prendi Yasuo e vai mid contro un Zed nemico", next: 81},
  {id: 81, title: "Fai una outplay incredibile con il Wind Wall", next: 82},
  {id: 82, title: "Il tuo team vince la partita e tu sei MVP!", next: 83},
  {id: 83, title: "Vinci un torneo esports e ricevi un trofeo", next: 92},

  // PERCORSO 7B: Thresh (84-87)
  {id: 84, title: "Prendi Thresh e aiuti il tuo ADC in bot lane", next: 85},
  {id: 85, title: "Fai hook perfetti ma il tuo ADC è scarso", next: 86},
  {id: 86, title: "Perdete la partita per colpa sua", next: 87},
  {id: 87, title: "You died", next: 79, youDied: true},

  // PERCORSO 7C: Teemo troll (88-91)
  {id: 88, title: "Decidi di trollare con Teemo jungle", next: 89},
  {id: 89, title: "Il tuo team si arrabbia e ti reporta", next: 90},
  {id: 90, title: "Vieni bannato permanentemente", next: 91},
  {id: 91, title: "You died", next: 79, youDied: true},

  // === SCENA 8: Guerra cinema ===
  {
    id: 92,
    title: "Scena 8: Guerra cinema",
    description: "Esci dall'internet café e trovi una guerra tra il cinema Universo e il Warner Montesilvano!",
    choices: [
      {id: 1759521092001, text: "Aiuti l'Universo con popcorn esplosivi", nextSceneId: 93},
      {id: 1759521092002, text: "Difendi il Warner con nachos", nextSceneId: 97},
      {id: 1759521092003, text: "Cerchi di fare pace tra i due", nextSceneId: 101}
    ],
    mainScene: true
  },

  // PERCORSO 8A: Universo (93-96)
  {id: 93, title: "Aiuti l'Universo lanciando popcorn esplosivi", next: 94},
  {id: 94, title: "I popcorn esplodono creando buchi nel Warner", next: 95},
  {id: 95, title: "L'Universo vince la guerra!", next: 96},
  {id: 96, title: "Ti nominano generale dell'esercito cinema", next: 105},

  // PERCORSO 8B: Warner (97-100)
  {id: 97, title: "Difendi il Warner costruendo muri di nachos", next: 98},
  {id: 98, title: "I nachos non resistono agli attacchi", next: 99},
  {id: 99, title: "Il Warner viene conquistato", next: 100},
  {id: 100, title: "You died", next: 92, youDied: true},

  // PERCORSO 8C: Pace (101-104)
  {id: 101, title: "Cerchi di mediare: 'Fermatevi! Fate pace!'", next: 102},
  {id: 102, title: "Entrambi i cinema ti attaccano", next: 103},
  {id: 103, title: "Ti chiamano traditore", next: 104},
  {id: 104, title: "You died", next: 92, youDied: true},

  // === SCENA 9: Challenge finale ===
  {
    id: 105,
    title: "Scena 9: Challenge finale",
    description: "Arrivi alle tre prove finali per vincere il regalo di compleanno perfetto! Quale affronti?",
    choices: [
      {id: 1759521105001, text: "Prova del canestro", nextSceneId: 106},
      {id: 1759521105002, text: "Prova di forza", nextSceneId: 110},
      {id: 1759521105003, text: "Indovinello finale", nextSceneId: 114}
    ],
    mainScene: true
  },

  // PERCORSO 9A: Canestro (106-109)
  {id: 106, title: "Ti concentri per il tiro perfetto", next: 107},
  {id: 107, title: "La palla entra perfettamente nel canestro", next: 108},
  {id: 108, title: "Hai superato la prima prova!", next: 109},
  {id: 109, title: "Passi alla prova di forza", next: 110},

  // PERCORSO 9B: Forza (110-113)
  {id: 110, title: "Devi sollevare un peso di 100kg", next: 111},
  {id: 111, title: "Usi la tecnica perfetta e lo sollevi", next: 112},
  {id: 112, title: "Hai superato la seconda prova!", next: 113},
  {id: 113, title: "Passi all'indovinello finale", next: 114},

  // PERCORSO 9C: Indovinello (114-117)
  {id: 114, title: "L'indovinello è: 'Cosa diventa più leggero quanto più lo riempi?'", next: 115},
  {id: 115, title: "Rispondi: 'Un palloncino!'", next: 116},
  {id: 116, title: "Risposta corretta! Hai superato tutte le prove!", next: 117},
  {id: 117, title: "Ricevi il regalo di compleanno perfetto!", next: 118},

  // SCENA FINALE
  {
    id: 118,
    title: "VITTORIA FINALE!",
    description: "Congratulazioni! Hai completato la tua incredibile avventura di compleanno! Hai vinto la gara, sconfitto Mattarella e Gerry Scotti, dominato a League of Legends, vinto la guerra dei cinema e superato tutte le prove finali. È stato il compleanno più epico di sempre!",
    choices: [],
    isFinal: true,
    mainScene: true
  }
];

// Genero tutte le scene con struttura JSON completa
scenes.forEach(scene => {
  const sceneData = {
    "id": scene.id,
    "title": scene.title,
    "description": scene.description || "",
    "image": "",
    "video": "",
    "choices": scene.choices || (scene.isFinal ? [] : [{
      "id": 1759521000000 + scene.id,
      "text": "Avanti",
      "nextSceneId": scene.next
    }]),
    "isFinal": scene.isFinal || false,
    "createdAt": "2025-10-04T20:00:00.000Z",
    "titleStyle": scene.mainScene ? "font-weight: bold;" : "",
    "titleColor": scene.youDied ? "#ff0000" : (scene.isFinal ? "#00ff00" : "#ffffff"),
    "backgroundTheme": scene.isFinal ? "celebration" : "",
    "effects": {
      "particles": scene.isFinal || false,
      "glow": scene.youDied || scene.isFinal || false,
      "typewriter": scene.isFinal || false
    },
    "lastModified": "2025-10-04T20:00:00.000Z",
    "updatedAt": "2025-10-04T20:00:00.000Z"
  };

  gameData.scenes.push(sceneData);
});

// Scrivi il file
fs.writeFileSync('./backend/data/gameData.json', JSON.stringify(gameData, null, 2));

console.log('✅ TUTTE LE 118 SCENE CONVERTITE A STRUTTURA JSON!');
console.log(`📊 Scene totali: ${gameData.scenes.length}`);
console.log(`🎮 Scene principali con scelte: ${gameData.scenes.filter(s => s.choices.length > 1).length}`);
console.log(`📖 Scene narrative con "Avanti": ${gameData.scenes.filter(s => s.choices.length === 1 && s.choices[0]?.text === "Avanti").length}`);
console.log(`💀 Scene "You died": ${gameData.scenes.filter(s => s.title === "You died").length}`);
console.log(`🏆 Scene finali: ${gameData.scenes.filter(s => s.isFinal).length}`);
console.log('🔧 Struttura JSON completa con tutti i campi necessari');
console.log('✨ Effetti speciali: You died (rosso + glow), Finale (verde + particles + typewriter)');