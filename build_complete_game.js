const fs = require('fs');

// GIOCO COMPLETO CON TUTTE LE SCENE - Struttura corretta: ogni punto = scena separata
const gameData = {
  "scenes": [
    // === SCENA 1: La sveglia ===
    {
      "id": 1,
      "title": "La sveglia",
      "description": "",
      "choices": [
        {"id": 1, "text": "Ti giri dall altra parte e continui a russare", "nextSceneId": 2},
        {"id": 2, "text": "Ti alzi e vai in bagno a lavarti i denti", "nextSceneId": 5},
        {"id": 3, "text": "Apri il telefono prima ancora di scendere dal letto", "nextSceneId": 8}
      ],
      "isFinal": false
    },

    // PERCORSO 1A: Russare (2-4)
    {"id": 2, "title": "Ti giri dall altra parte e continui a russare", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 3}], "isFinal": false},
    {"id": 3, "title": "Ti giri dall'altra parte e continui a dormire, ma tua madre ti sveglia urlando \"MASSIMO ALZATI CHE È TARDI!\"", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 4}], "isFinal": false},
    {"id": 4, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 1}], "isFinal": false},

    // PERCORSO 1B: Bagno (5-7)
    {"id": 5, "title": "Ti alzi e vai in bagno a lavarti i denti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 6}], "isFinal": false},
    {"id": 6, "title": "Mentre ti guardi allo specchio pensi: \"Oggi è il mio compleanno, chissà che regalo mi faranno!\"", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 7}], "isFinal": false},
    {"id": 7, "title": "Vai a fare colazione", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 11}], "isFinal": false},

    // PERCORSO 1C: Telefono (8-10)
    {"id": 8, "title": "Apri il telefono prima ancora di scendere dal letto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 9}], "isFinal": false},
    {"id": 9, "title": "Vedi centinaia di notifiche di auguri! Tutti i tuoi amici si sono ricordati del tuo compleanno", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 10}], "isFinal": false},
    {"id": 10, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 1}], "isFinal": false},

    // === SCENA 11: Colazione al bar ===
    {
      "id": 11,
      "title": "Colazione al bar",
      "description": "",
      "choices": [
        {"id": 1, "text": "Sì, ma oggi è il mio compleanno, quindi fallo extra buono!", "nextSceneId": 12},
        {"id": 2, "text": "Oggi provo qualcosa di diverso", "nextSceneId": 15},
        {"id": 3, "text": "Non ho tempo, devo scappare", "nextSceneId": 18}
      ],
      "isFinal": false
    },

    // PERCORSO 2A: Cappuccino speciale (12-14)
    {"id": 12, "title": "Il barista ti prepara un cappuccino speciale con un cuoricino nella schiuma!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 13}], "isFinal": false},
    {"id": 13, "title": "Mentre lo bevi, senti delle macchine che sgommano fuori dal bar", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 14}], "isFinal": false},
    {"id": 14, "title": "Esci a vedere cosa succede", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}], "isFinal": false},

    // PERCORSO 2B: Qualcosa diverso (15-17)
    {"id": 15, "title": "Oggi provo qualcosa di diverso", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 16}], "isFinal": false},
    {"id": 16, "title": "Il barista ti dà un caffè amaro che sa di bruciato", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 17}], "isFinal": false},
    {"id": 17, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 11}], "isFinal": false},

    // PERCORSO 2C: Scappare (18-20)
    {"id": 18, "title": "Non ho tempo, devo scappare", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 19}], "isFinal": false},
    {"id": 19, "title": "Corri fuori ma inciampi e cadi malamente", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 20}], "isFinal": false},
    {"id": 20, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 11}], "isFinal": false},

    // === SCENA 21: La gara clandestina ===
    {
      "id": 21,
      "title": "La gara clandestina",
      "description": "",
      "choices": [
        {"id": 1, "text": "Sì! Oggi è il mio compleanno, devo vincere quella corona!", "nextSceneId": 22},
        {"id": 2, "text": "No grazie, sono troppo pericolose", "nextSceneId": 25},
        {"id": 3, "text": "Chiamo la polizia", "nextSceneId": 28}
      ],
      "isFinal": false
    },

    // PERCORSO 3A: Partecipo gara (22-24)
    {"id": 22, "title": "Sali su una macchina sportiva e parti a tutta velocità", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 23}], "isFinal": false},
    {"id": 23, "title": "Dopo una gara mozzafiato attraverso le strade della città", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 24}], "isFinal": false},
    {"id": 24, "title": "Arrivi secondo, ma il vincitore ti regala la corona perché è il tuo compleanno!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 31}], "isFinal": false},

    // PERCORSO 3B: Troppo pericolose (25-27)
    {"id": 25, "title": "No grazie, sono troppo pericolose", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 26}], "isFinal": false},
    {"id": 26, "title": "I piloti ti deridono chiamandoti codardo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}], "isFinal": false},
    {"id": 27, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}], "isFinal": false},

    // PERCORSO 3C: Chiamo polizia (28-30)
    {"id": 28, "title": "Chiami la polizia per fermare la gara illegale", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 29}], "isFinal": false},
    {"id": 29, "title": "La polizia arriva ma tu vieni arrestato come complice", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 30}], "isFinal": false},
    {"id": 30, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}], "isFinal": false},

    // === SCENA 31: Inseguimento polizia ===
    {
      "id": 31,
      "title": "Inseguimento polizia",
      "description": "",
      "choices": [
        {"id": 1, "text": "Scappi a piedi tra i vicoli", "nextSceneId": 32},
        {"id": 2, "text": "Ti costituisci alla polizia", "nextSceneId": 35},
        {"id": 3, "text": "Usi i tuoi poteri anime per volare via", "nextSceneId": 38}
      ],
      "isFinal": false
    },

    // PERCORSO 4A: Scappi vicoli (32-34)
    {"id": 32, "title": "Scappi a piedi attraverso i vicoli stretti del centro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 33}], "isFinal": false},
    {"id": 33, "title": "Riesci a seminare la polizia nascondendoti in un cassonetto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 34}], "isFinal": false},
    {"id": 34, "title": "Esci dal cassonetto puzzolente ma libero", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 41}], "isFinal": false},

    // PERCORSO 4B: Ti costituisci (35-37)
    {"id": 35, "title": "Ti costituisci alla polizia spiegando che era il tuo compleanno", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 36}], "isFinal": false},
    {"id": 36, "title": "I poliziotti ti arrestano comunque perché non credono alla tua storia", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 37}], "isFinal": false},
    {"id": 37, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 31}], "isFinal": false},

    // PERCORSO 4C: Poteri anime (38-40)
    {"id": 38, "title": "Attivi i tuoi poteri anime e cominci a volare sopra la città", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 39}], "isFinal": false},
    {"id": 39, "title": "La polizia resta senza parole vedendoti volare via come un supereroe", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 40}], "isFinal": false},
    {"id": 40, "title": "Atterri dall'altra parte della città, al sicuro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 41}], "isFinal": false},

    // === SCENA 41: Boss battle IKEA ===
    {
      "id": 41,
      "title": "Boss battle IKEA",
      "description": "",
      "choices": [
        {"id": 1, "text": "Attacchi Mattarella con una poltrona POÄNG", "nextSceneId": 42},
        {"id": 2, "text": "Cerchi di convincerlo diplomaticamente", "nextSceneId": 45},
        {"id": 3, "text": "Scappi verso l'uscita di emergenza", "nextSceneId": 48}
      ],
      "isFinal": false
    },

    // PERCORSO 5A: Attacco poltrona (42-44)
    {"id": 42, "title": "Afferri una poltrona POÄNG e la lanci contro Mattarella", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 43}], "isFinal": false},
    {"id": 43, "title": "Mattarella schiva agilmente e contrattacca con una libreria BILLY", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 44}], "isFinal": false},
    {"id": 44, "title": "La libreria ti colpisce in pieno", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 51}], "isFinal": false},

    // PERCORSO 5B: Diplomazia (45-47)
    {"id": 45, "title": "Cerchi di convincere Mattarella con le tue doti diplomatiche", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 46}], "isFinal": false},
    {"id": 46, "title": "Mattarella ti ascolta attentamente mentre gli spieghi che è il tuo compleanno", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 47}], "isFinal": false},
    {"id": 47, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 41}], "isFinal": false},

    // PERCORSO 5C: Scappi (48-50)
    {"id": 48, "title": "Corri verso l'uscita di emergenza schivando mobili volanti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 49}], "isFinal": false},
    {"id": 49, "title": "Mattarella ti lancia dietro un intero set da cucina METOD", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 50}], "isFinal": false},
    {"id": 50, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 41}], "isFinal": false},

    // === SCENA 51: Boss battle Supermercato ===
    {
      "id": 51,
      "title": "Boss battle Supermercato",
      "description": "",
      "choices": [
        {"id": 1, "text": "Lanci carrelli della spesa contro Gerry Scotti", "nextSceneId": 52},
        {"id": 2, "text": "Usi le banane come boomerang", "nextSceneId": 55},
        {"id": 3, "text": "Sfidi Gerry a un quiz televisivo", "nextSceneId": 58}
      ],
      "isFinal": false
    },

    // PERCORSO 6A: Carrelli (52-54)
    {"id": 52, "title": "Prendi i carrelli e li lanci con forza contro Gerry Scotti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},
    {"id": 53, "title": "Gerry schiva ridendo e dice: 'Sbagliato!' mentre lancia conserve", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 54}], "isFinal": false},
    {"id": 54, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 51}], "isFinal": false},

    // PERCORSO 6B: Banane boomerang (55-57)
    {"id": 55, "title": "Afferri un casco di banane e le lanci come boomerang", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 56}], "isFinal": false},
    {"id": 56, "title": "Le banane colpiscono Gerry che scivola comicamente a terra", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 57}], "isFinal": false},
    {"id": 57, "title": "Gerry si rialza arrabbiato e ti insegue con una mazza da baseball", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 61}], "isFinal": false},

    // PERCORSO 6C: Quiz televisivo (58-60)
    {"id": 58, "title": "Lo sfidi: 'Gerry, facciamo un quiz! Se vinco io, mi dai il regalo!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 59}], "isFinal": false},
    {"id": 59, "title": "Gerry accetta sorridendo: 'Quanto fa 2+2?' chiede con malignità", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 60}], "isFinal": false},
    {"id": 60, "title": "Rispondi '4' e Gerry ammette la sconfitta", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 61}], "isFinal": false},

    // === SCENA 61: Esports League of Legends ===
    {
      "id": 61,
      "title": "Esports League of Legends",
      "description": "",
      "choices": [
        {"id": 1, "text": "Scegli Yasuo e vai mid lane", "nextSceneId": 62},
        {"id": 2, "text": "Scegli un support e aiuti il team", "nextSceneId": 65},
        {"id": 3, "text": "Trolliggi e rovini la partita", "nextSceneId": 68}
      ],
      "isFinal": false
    },

    // PERCORSO 7A: Yasuo mid (62-64)
    {"id": 62, "title": "Prendi Yasuo e vai mid contro un Zed nemico", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 63}], "isFinal": false},
    {"id": 63, "title": "Fai una outplay incredibile con il tuo Wind Wall", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 64}], "isFinal": false},
    {"id": 64, "title": "Il tuo team vince la partita e tu sei il MVP!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 71}], "isFinal": false},

    // PERCORSO 7B: Support (65-67)
    {"id": 65, "title": "Prendi Thresh e aiuti il tuo ADC in bot lane", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 66}], "isFinal": false},
    {"id": 66, "title": "Fai hook perfetti ma il tuo ADC è scarso", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 67}], "isFinal": false},
    {"id": 67, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 61}], "isFinal": false},

    // PERCORSO 7C: Troll (68-70)
    {"id": 68, "title": "Decidi di trollare e prendi Teemo jungle", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 69}], "isFinal": false},
    {"id": 69, "title": "Il tuo team ti reporta e vieni bannato permanentemente", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 70}], "isFinal": false},
    {"id": 70, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 61}], "isFinal": false},

    // === SCENA 71: Guerra cinema ===
    {
      "id": 71,
      "title": "Guerra cinema",
      "description": "",
      "choices": [
        {"id": 1, "text": "Attacchi il Warner con popcorn esplosivi", "nextSceneId": 72},
        {"id": 2, "text": "Difendi l'Universo con scudi di nachos", "nextSceneId": 75},
        {"id": 3, "text": "Cerchi di mediare tra i due cinema", "nextSceneId": 78}
      ],
      "isFinal": false
    },

    // PERCORSO 8A: Attacco Warner (72-74)
    {"id": 72, "title": "Lanci popcorn esplosivi contro le mura del Warner", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 73}], "isFinal": false},
    {"id": 73, "title": "I popcorn esplodono creando una breccia nelle difese", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 74}], "isFinal": false},
    {"id": 74, "title": "Le truppe dell'Universo avanzano vittoriose!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 81}], "isFinal": false},

    // PERCORSO 8B: Difesa Universo (75-77)
    {"id": 75, "title": "Costruisci barricate di nachos per difendere l'Universo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 76}], "isFinal": false},
    {"id": 76, "title": "I nachos resistono valorosamente agli attacchi nemici", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 77}], "isFinal": false},
    {"id": 77, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 71}], "isFinal": false},

    // PERCORSO 8C: Mediazione (78-80)
    {"id": 78, "title": "Cerchi di mediare: 'Fermatevi! Possiamo coesistere in pace!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 79}], "isFinal": false},
    {"id": 79, "title": "Entrambi i cinema ti attaccano chiamandoti traditore", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 80}], "isFinal": false},
    {"id": 80, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 71}], "isFinal": false},

    // === SCENA 81: Challenge finale canestro ===
    {
      "id": 81,
      "title": "Challenge finale canestro",
      "description": "",
      "choices": [
        {"id": 1, "text": "Tiri con precisione da tre punti", "nextSceneId": 82},
        {"id": 2, "text": "Fai una schiacciata spettacolare", "nextSceneId": 85},
        {"id": 3, "text": "Tiri a caso sperando nella fortuna", "nextSceneId": 88}
      ],
      "isFinal": false
    },

    // PERCORSO 9A: Tiro precisione (82-84)
    {"id": 82, "title": "Ti concentri e tiri con precisione millimetrica", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 83}], "isFinal": false},
    {"id": 83, "title": "La palla entra perfettamente nel canestro con un suono soddisfacente", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 84}], "isFinal": false},
    {"id": 84, "title": "Hai completato la prima delle tre prove!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 91}], "isFinal": false},

    // PERCORSO 9B: Schiacciata (85-87)
    {"id": 85, "title": "Prendi la rincorsa per una schiacciata spettacolare", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 86}], "isFinal": false},
    {"id": 86, "title": "Salti altissimo ma sbagli il timing", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 87}], "isFinal": false},
    {"id": 87, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 81}], "isFinal": false},

    // PERCORSO 9C: Fortuna (88-90)
    {"id": 88, "title": "Chiudi gli occhi e tiri a caso", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 89}], "isFinal": false},
    {"id": 89, "title": "La palla rimbalza sul ferro e finisce fuori", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 90}], "isFinal": false},
    {"id": 90, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 81}], "isFinal": false},

    // === SCENA 91: Challenge forza ===
    {
      "id": 91,
      "title": "Challenge forza",
      "description": "",
      "choices": [
        {"id": 1, "text": "Usi la tecnica corretta di sollevamento", "nextSceneId": 92},
        {"id": 2, "text": "Provi a sollevarlo di forza bruta", "nextSceneId": 95},
        {"id": 3, "text": "Chiedi aiuto a un amico", "nextSceneId": 98}
      ],
      "isFinal": false
    },

    // PERCORSO 10A: Tecnica corretta (92-94)
    {"id": 92, "title": "Applichi la tecnica perfetta che hai imparato in palestra", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 93}], "isFinal": false},
    {"id": 93, "title": "Sollevi il peso senza sforzo grazie alla tecnica impeccabile", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 94}], "isFinal": false},
    {"id": 94, "title": "Hai completato la seconda delle tre prove!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 101}], "isFinal": false},

    // PERCORSO 10B: Forza bruta (95-97)
    {"id": 95, "title": "Provi a sollevarlo usando solo la forza bruta", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 96}], "isFinal": false},
    {"id": 96, "title": "Ti strappi la schiena per lo sforzo eccessivo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 97}], "isFinal": false},
    {"id": 97, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 91}], "isFinal": false},

    // PERCORSO 10C: Aiuto amico (98-100)
    {"id": 98, "title": "Chiedi aiuto a un amico per sollevare il peso insieme", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 99}], "isFinal": false},
    {"id": 99, "title": "Il giudice dice che è barare e ti squalifica", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 100}], "isFinal": false},
    {"id": 100, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 91}], "isFinal": false},

    // === SCENA 101: Challenge indovinello ===
    {
      "id": 101,
      "title": "Challenge indovinello",
      "description": "",
      "choices": [
        {"id": 1, "text": "Un palloncino!", "nextSceneId": 102},
        {"id": 2, "text": "Una borsa!", "nextSceneId": 105},
        {"id": 3, "text": "Un secchio!", "nextSceneId": 108}
      ],
      "isFinal": false
    },

    // PERCORSO 11A: Palloncino (102-104)
    {"id": 102, "title": "Rispondi con sicurezza: 'Un palloncino!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 103}], "isFinal": false},
    {"id": 103, "title": "Il giudice sorride: 'Corretto! Più aria metti, più leggero diventa!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 104}], "isFinal": false},
    {"id": 104, "title": "Hai completato tutte e tre le prove!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 111}], "isFinal": false},

    // PERCORSO 11B: Borsa (105-107)
    {"id": 105, "title": "Rispondi incerto: 'Una borsa?'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 106}], "isFinal": false},
    {"id": 106, "title": "Il giudice scuote la testa: 'Sbagliato! Più cose ci metti, più pesante diventa'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 107}], "isFinal": false},
    {"id": 107, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 101}], "isFinal": false},

    // PERCORSO 11C: Secchio (108-110)
    {"id": 108, "title": "Rispondi pensieroso: 'Un secchio!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 109}], "isFinal": false},
    {"id": 109, "title": "Il giudice ride: 'Sbagliato! Un secchio pieno è più pesante di uno vuoto!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 110}], "isFinal": false},
    {"id": 110, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 101}], "isFinal": false},

    // SCENA FINALE
    {
      "id": 111,
      "title": "VITTORIA FINALE!",
      "description": "",
      "choices": [],
      "isFinal": true
    }
  ]
};

// Scrivi il file
fs.writeFileSync('./backend/data/gameData.json', JSON.stringify(gameData, null, 2));

console.log('🎯 GIOCO COMPLETO CON TUTTE LE SCENE!');
console.log(`📊 Scene totali: ${gameData.scenes.length}`);
console.log(`🎮 Scene principali con scelte: ${gameData.scenes.filter(s => s.choices.length > 1).length}`);
console.log(`📖 Scene narrative con "Avanti": ${gameData.scenes.filter(s => s.choices.length === 1 && s.choices[0]?.text === "Avanti").length}`);
console.log(`💀 Scene "You died": ${gameData.scenes.filter(s => s.title === "You died").length}`);
console.log(`🏆 Scene finali: ${gameData.scenes.filter(s => s.isFinal).length}`);
console.log('✅ Struttura: ogni punto del testo = scena separata');
console.log('🔄 "You died" torna alla scena principale del momento');
console.log('📝 Solo titoli originali, zero aggiunte');
console.log('🎊 PERCORSO VINCENTE: 1→5→7→11→12→14→21→22→24→31→32→34→41→42→44→51→55→57→61→62→64→71→72→74→81→82→84→91→92→94→101→102→104→111');