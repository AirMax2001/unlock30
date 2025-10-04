const fs = require('fs');
const path = require('path');

// Funzione per creare scene narrative con solo "Avanti"
function createNarrativeScene(id, title) {
  return {
    "id": id,
    "title": title,
    "description": "",
    "image": "",
    "video": "",
    "choices": [
      {
        "id": parseInt(`1759521${id.toString().padStart(3, '0')}001`),
        "text": "Avanti",
        "nextSceneId": id + 1
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
  };
}

// Funzione per creare scene "You died"
function createYouDiedScene(id, returnSceneId) {
  return {
    "id": id,
    "title": "You died",
    "description": "",
    "image": "",
    "video": "",
    "choices": [
      {
        "id": parseInt(`1759521${id.toString().padStart(3, '0')}001`),
        "text": "Riprova",
        "nextSceneId": returnSceneId
      }
    ],
    "isFinal": false,
    "createdAt": "2025-10-04T20:00:00.000Z",
    "titleStyle": "font-weight: bold; color: #ff0000;",
    "titleColor": "#ff0000",
    "backgroundTheme": "",
    "effects": {
      "particles": false,
      "glow": true,
      "typewriter": false
    },
    "lastModified": "2025-10-04T20:00:00.000Z",
    "updatedAt": "2025-10-04T20:00:00.000Z"
  };
}

// Crea la struttura completa del gioco
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
    },

    // Scene 2-5: Conseguenze del russare
    createNarrativeScene(2, "Tua mamma grida dal piano di sotto"),
    createNarrativeScene(3, "Ti arrabbi con lei"),
    createNarrativeScene(4, "Discutete"),
    createYouDiedScene(5, 1),

    // === SCENA 6: In bagno ===
    {
      "id": 6,
      "title": "Scena 2: In bagno",
      "description": "Ti alzi e vai in bagno. Cosa fai?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521006001,
          "text": "Vai in cucina per la colazione",
          "nextSceneId": 7
        },
        {
          "id": 1759521006002,
          "text": "Ti fai la doccia",
          "nextSceneId": 8
        },
        {
          "id": 1759521006003,
          "text": "Ti guardi allo specchio e ti fai i selfie",
          "nextSceneId": 9
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
    },

    // Scene 7-9: Conseguenze delle scelte in bagno
    createNarrativeScene(7, "Vai in cucina e fai colazione con tua mamma"),
    createNarrativeScene(8, "Ti fai la doccia e ti senti rinfresco"),
    createYouDiedScene(9, 6),

    // === SCENA 10: Telefono ===
    {
      "id": 10,
      "title": "Scena 3: Telefono",
      "description": "Prendi il telefono. Cosa fai?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521010001,
          "text": "Vai su TikTok",
          "nextSceneId": 11
        },
        {
          "id": 1759521010002,
          "text": "Controlli WhatsApp",
          "nextSceneId": 14
        },
        {
          "id": 1759521010003,
          "text": "Apri Instagram",
          "nextSceneId": 17
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
    },

    // Scene 11-13: TikTok
    createNarrativeScene(11, "Apri TikTok e vedi un video divertente"),
    createNarrativeScene(12, "Continui a scrollare per un'ora"),
    createYouDiedScene(13, 10),

    // Scene 14-16: WhatsApp
    createNarrativeScene(14, "Controlli WhatsApp e vedi i messaggi degli amici"),
    createNarrativeScene(15, "Rispondi a tutti i messaggi"),
    createNarrativeScene(16, "Ti senti connesso con gli amici"),

    // Scene 17-19: Instagram
    createNarrativeScene(17, "Apri Instagram e vedi le storie"),
    createNarrativeScene(18, "Fai una storia per il tuo compleanno"),
    createYouDiedScene(19, 10),

    // === SCENA 20: A scuola ===
    {
      "id": 20,
      "title": "Scena 4: A scuola",
      "description": "Arrivi a scuola. È il tuo compleanno! Cosa fai?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521020001,
          "text": "Vai dai tuoi amici e gli dici che è il tuo compleanno",
          "nextSceneId": 21
        },
        {
          "id": 1759521020002,
          "text": "Non dici niente a nessuno",
          "nextSceneId": 25
        },
        {
          "id": 1759521020003,
          "text": "Organizzi una piccola festa in classe",
          "nextSceneId": 29
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
    },

    // Scene 21-24: Dici agli amici del compleanno
    createNarrativeScene(21, "I tuoi amici sono felici per te"),
    createNarrativeScene(22, "Ti cantano tanti auguri"),
    createNarrativeScene(23, "Ti senti amato e apprezzato"),
    createNarrativeScene(24, "La giornata a scuola passa velocemente"),

    // Scene 25-28: Non dici niente
    createNarrativeScene(25, "Nessuno sa che è il tuo compleanno"),
    createNarrativeScene(26, "Ti senti un po' triste"),
    createNarrativeScene(27, "La giornata sembra più lunga"),
    createYouDiedScene(28, 20),

    // Scene 29-32: Organizzi festa
    createNarrativeScene(29, "Organizzi una piccola festa in classe"),
    createNarrativeScene(30, "Tutti sono felici di partecipare"),
    createNarrativeScene(31, "È una giornata memorabile"),
    createNarrativeScene(32, "Ti senti il protagonista"),

    // === SCENA 33: Dopo scuola ===
    {
      "id": 33,
      "title": "Scena 5: Dopo scuola",
      "description": "La scuola è finita. Cosa fai?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521033001,
          "text": "Torni a casa subito",
          "nextSceneId": 34
        },
        {
          "id": 1759521033002,
          "text": "Vai al parco con gli amici",
          "nextSceneId": 38
        },
        {
          "id": 1759521033003,
          "text": "Vai al centro commerciale",
          "nextSceneId": 42
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
    },

    // Scene 34-37: Torni a casa
    createNarrativeScene(34, "Torni a casa e trovi una sorpresa"),
    createNarrativeScene(35, "I tuoi genitori hanno preparato una torta"),
    createNarrativeScene(36, "Festeggi in famiglia"),
    createNarrativeScene(37, "È un momento dolce e intimo"),

    // Scene 38-41: Parco con amici
    createNarrativeScene(38, "Vai al parco con i tuoi amici"),
    createNarrativeScene(39, "Giocate insieme e vi divertite"),
    createNarrativeScene(40, "È un pomeriggio spensierato"),
    createNarrativeScene(41, "I tuoi amici ti fanno un regalo"),

    // Scene 42-45: Centro commerciale
    createNarrativeScene(42, "Vai al centro commerciale"),
    createNarrativeScene(43, "Giri per i negozi"),
    createNarrativeScene(44, "Ti compri qualcosa di bello"),
    createYouDiedScene(45, 33),

    // === SCENA 46: Sera ===
    {
      "id": 46,
      "title": "Scena 6: Sera",
      "description": "È sera e stai preparando la festa di compleanno. Cosa fai?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521046001,
          "text": "Inviti pochi amici intimi",
          "nextSceneId": 47
        },
        {
          "id": 1759521046002,
          "text": "Organizzi una grande festa",
          "nextSceneId": 51
        },
        {
          "id": 1759521046003,
          "text": "Decidi di passare la serata da solo",
          "nextSceneId": 55
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
    },

    // Scene 47-50: Festa intima
    createNarrativeScene(47, "Inviti i tuoi amici più cari"),
    createNarrativeScene(48, "Passate una serata tranquilla e divertente"),
    createNarrativeScene(49, "Parlate e ridete insieme"),
    createNarrativeScene(50, "È una festa perfetta per te"),

    // Scene 51-54: Grande festa
    createNarrativeScene(51, "Organizzi una grande festa"),
    createNarrativeScene(52, "Arrivano tantissime persone"),
    createNarrativeScene(53, "La festa è un successo"),
    createYouDiedScene(54, 46),

    // Scene 55-58: Serata da solo
    createNarrativeScene(55, "Decidi di passare la serata da solo"),
    createNarrativeScene(56, "Ti rilassi e rifletti sull'anno passato"),
    createNarrativeScene(57, "È un momento di pace interiore"),
    createYouDiedScene(58, 46),

    // === SCENA 59: Mezzanotte ===
    {
      "id": 59,
      "title": "Scena 7: Mezzanotte",
      "description": "È mezzanotte e il tuo compleanno sta finendo. Cosa fai?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521059001,
          "text": "Esprimi un desiderio",
          "nextSceneId": 60
        },
        {
          "id": 1759521059002,
          "text": "Vai a dormire soddisfatto",
          "nextSceneId": 64
        },
        {
          "id": 1759521059003,
          "text": "Continui a festeggiare",
          "nextSceneId": 68
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
    },

    // Scene 60-63: Esprimi desiderio
    createNarrativeScene(60, "Chiudi gli occhi ed esprimi un desiderio"),
    createNarrativeScene(61, "Speri che si avveri nel prossimo anno"),
    createNarrativeScene(62, "Senti che è stato un compleanno speciale"),
    createNarrativeScene(63, "Ti senti grato per tutto quello che hai"),

    // Scene 64-67: Vai a dormire
    createNarrativeScene(64, "Vai a dormire soddisfatto della giornata"),
    createNarrativeScene(65, "Ripensi a tutti i momenti belli"),
    createNarrativeScene(66, "Ti addormenti con il sorriso"),
    createNarrativeScene(67, "Sogni il tuo prossimo compleanno"),

    // Scene 68-71: Continui a festeggiare
    createNarrativeScene(68, "Continui a festeggiare oltre mezzanotte"),
    createNarrativeScene(69, "La festa diventa ancora più divertente"),
    createNarrativeScene(70, "Ballate e cantate fino all'alba"),
    createYouDiedScene(71, 59),

    // === SCENA 72: Il giorno dopo ===
    {
      "id": 72,
      "title": "Scena 8: Il giorno dopo",
      "description": "È il giorno dopo il tuo compleanno. Come ti senti?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521072001,
          "text": "Ti senti felice e soddisfatto",
          "nextSceneId": 73
        },
        {
          "id": 1759521072002,
          "text": "Sei un po' nostalgico",
          "nextSceneId": 77
        },
        {
          "id": 1759521072003,
          "text": "Pensi già al prossimo anno",
          "nextSceneId": 81
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
    },

    // Scene 73-76: Felice e soddisfatto
    createNarrativeScene(73, "Ti senti felice per come è andato tutto"),
    createNarrativeScene(74, "Ripensando alla giornata sorridi"),
    createNarrativeScene(75, "È stato davvero un compleanno perfetto"),
    createNarrativeScene(76, "Ti senti più maturo e consapevole"),

    // Scene 77-80: Nostalgico
    createNarrativeScene(77, "Sei un po' nostalgico che sia già finito"),
    createNarrativeScene(78, "Vorresti che durasse ancora"),
    createNarrativeScene(79, "Ma capisci che i momenti belli sono preziosi proprio perché finiscono"),
    createYouDiedScene(80, 72),

    // Scene 81-84: Pensi al prossimo anno
    createNarrativeScene(81, "Pensi già a cosa farai il prossimo anno"),
    createNarrativeScene(82, "Immagini come sarai cresciuto"),
    createNarrativeScene(83, "È eccitante pensare al futuro"),
    createNarrativeScene(84, "Ogni compleanno è un nuovo inizio"),

    // === SCENA 85: Riflessioni ===
    {
      "id": 85,
      "title": "Scena 9: Riflessioni",
      "description": "Rifletti su questo compleanno. Quale è stata la parte più importante?",
      "image": "",
      "video": "",
      "choices": [
        {
          "id": 1759521085001,
          "text": "Il tempo trascorso con la famiglia",
          "nextSceneId": 86
        },
        {
          "id": 1759521085002,
          "text": "Il divertimento con gli amici",
          "nextSceneId": 90
        },
        {
          "id": 1759521085003,
          "text": "I momenti di riflessione personale",
          "nextSceneId": 94
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
    },

    // Scene 86-89: Famiglia
    createNarrativeScene(86, "La famiglia è la cosa più importante"),
    createNarrativeScene(87, "Sono le persone che ti amano di più"),
    createNarrativeScene(88, "Ti hanno sempre sostenuto"),
    createNarrativeScene(89, "Sei grato di averli nella tua vita"),

    // Scene 90-93: Amici
    createNarrativeScene(90, "Gli amici rendono tutto più divertente"),
    createNarrativeScene(91, "Con loro puoi essere te stesso"),
    createNarrativeScene(92, "Condividete momenti indimenticabili"),
    createNarrativeScene(93, "L'amicizia è un tesoro prezioso"),

    // Scene 94-97: Riflessione personale
    createNarrativeScene(94, "I momenti di solitudine ti hanno fatto crescere"),
    createNarrativeScene(95, "Hai imparato a conoscerti meglio"),
    createNarrativeScene(96, "La riflessione è importante quanto il divertimento"),
    createYouDiedScene(97, 85),

    // Scene finali narrative che portano alla conclusione
    createNarrativeScene(98, "Questo compleanno ti ha insegnato molto"),
    createNarrativeScene(99, "Hai capito cosa è davvero importante nella vita"),
    createNarrativeScene(100, "Sei cresciuto come persona"),
    createNarrativeScene(101, "Ora sei pronto per affrontare il futuro"),
    createNarrativeScene(102, "Con la consapevolezza di chi sei"),
    createNarrativeScene(103, "E di cosa vuoi dalla vita"),
    createNarrativeScene(104, "I compleanni non sono solo feste"),
    createNarrativeScene(105, "Sono momenti di crescita e riflessione"),
    createNarrativeScene(106, "Ogni anno che passa ti rende più saggio"),
    createNarrativeScene(107, "E questo compleanno rimarrà sempre nel tuo cuore"),
    createNarrativeScene(108, "Come un momento speciale"),
    createNarrativeScene(109, "Che ti ha fatto diventare chi sei oggi"),
    createNarrativeScene(110, "Grazie per aver condiviso questa giornata"),
    createNarrativeScene(111, "È stato un viaggio incredibile"),
    createNarrativeScene(112, "Pieno di scelte e scoperte"),
    createNarrativeScene(113, "Di gioie e riflessioni"),
    createNarrativeScene(114, "Di amici e famiglia"),
    createNarrativeScene(115, "Di crescita e consapevolezza"),
    createNarrativeScene(116, "Buon compleanno!"),
    createNarrativeScene(117, "Che sia l'inizio di un anno meraviglioso"),

    // SCENA FINALE
    {
      "id": 118,
      "title": "🎉 Buon Compleanno! 🎂",
      "description": "Hai completato la tua giornata di compleanno! Ogni scelta che hai fatto ti ha portato qui, in questo momento perfetto. Hai imparato, cresciuto, amato e sei stato amato. Questo è il vero significato dei compleanni: celebrare non solo il passare del tempo, ma la persona meravigliosa che stai diventando. Auguri di cuore! 🎈✨",
      "image": "",
      "video": "",
      "choices": [],
      "isFinal": true,
      "createdAt": "2025-10-04T20:00:00.000Z",
      "titleStyle": "font-weight: bold; font-size: 1.5em; text-align: center;",
      "titleColor": "#00ff00",
      "backgroundTheme": "",
      "effects": {
        "particles": true,
        "glow": true,
        "typewriter": true
      },
      "lastModified": "2025-10-04T20:00:00.000Z",
      "updatedAt": "2025-10-04T20:00:00.000Z"
    }
  ]
};

// Aggiorna i nextSceneId per i collegamenti corretti
// Le scene narrative fluiscono verso le scene principali appropriate
gameData.scenes[5].choices[0].nextSceneId = 20;  // Da scena 6 a scuola
gameData.scenes[6].choices[0].nextSceneId = 20;  // Da colazione a scuola  
gameData.scenes[7].choices[0].nextSceneId = 20;  // Da doccia a scuola
gameData.scenes[15].choices[0].nextSceneId = 20; // Da WhatsApp a scuola
gameData.scenes[17].choices[0].nextSceneId = 20; // Da Instagram story a scuola

gameData.scenes[23].choices[0].nextSceneId = 33; // Da amici a dopo scuola
gameData.scenes[26].choices[0].nextSceneId = 33; // Da silenzio a dopo scuola  
gameData.scenes[31].choices[0].nextSceneId = 33; // Da festa classe a dopo scuola

gameData.scenes[36].choices[0].nextSceneId = 46; // Da casa a sera
gameData.scenes[40].choices[0].nextSceneId = 46; // Da parco a sera
gameData.scenes[43].choices[0].nextSceneId = 46; // Da centro commerciale a sera

gameData.scenes[49].choices[0].nextSceneId = 59; // Da festa intima a mezzanotte
gameData.scenes[52].choices[0].nextSceneId = 59; // Da grande festa a mezzanotte
gameData.scenes[56].choices[0].nextSceneId = 59; // Da solo a mezzanotte

gameData.scenes[62].choices[0].nextSceneId = 72; // Da desiderio a giorno dopo
gameData.scenes[66].choices[0].nextSceneId = 72; // Da dormire a giorno dopo
gameData.scenes[69].choices[0].nextSceneId = 72; // Da festa continua a giorno dopo

gameData.scenes[75].choices[0].nextSceneId = 85; // Da soddisfatto a riflessioni
gameData.scenes[78].choices[0].nextSceneId = 85; // Da nostalgico a riflessioni
gameData.scenes[83].choices[0].nextSceneId = 85; // Da futuro a riflessioni

gameData.scenes[88].choices[0].nextSceneId = 98; // Da famiglia a conclusione
gameData.scenes[92].choices[0].nextSceneId = 98; // Da amici a conclusione
gameData.scenes[95].choices[0].nextSceneId = 98; // Da riflessione a conclusione

// Catena finale verso ending
for(let i = 97; i < 116; i++) {
  gameData.scenes[i].choices[0].nextSceneId = i + 2;
}
gameData.scenes[116].choices[0].nextSceneId = 118; // Ultima scene va al finale

// Path to gameData.json
const filePath = path.join(__dirname, 'backend', 'data', 'gameData.json');

console.log('🔧 Forzando aggiornamento del file JSON...');
console.log(`📁 Percorso: ${filePath}`);

try {
  // Forza la scrittura del file
  fs.writeFileSync(filePath, JSON.stringify(gameData, null, 2), { encoding: 'utf8' });
  console.log('✅ FILE JSON AGGIORNATO CON SUCCESSO!');
  
  // Verifica che il file sia stato scritto
  const verification = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`📊 Verificato: ${verification.scenes.length} scene nel file`);
  console.log(`🎮 Scene principali: ${verification.scenes.filter(s => s.choices.length > 1).length}`);
  console.log(`📖 Scene narrative: ${verification.scenes.filter(s => s.choices.length === 1 && s.choices[0]?.text === "Avanti").length}`);
  console.log(`💀 Scene "You died": ${verification.scenes.filter(s => s.title === "You died").length}`);
  console.log(`🏆 Scene finali: ${verification.scenes.filter(s => s.isFinal).length}`);
  console.log('🎯 Struttura completa implementata con tutti i campi richiesti!');
  
} catch (error) {
  console.error('❌ ERRORE nella scrittura del file:', error);
}