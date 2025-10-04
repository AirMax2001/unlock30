const fs = require('fs');

// GIOCO COMPLETO CON TUTTE LE SCENE - Struttura corretta basata su esempio user
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
      "description": "Vai al bar per fare colazione. Il barista ti chiede cosa vuoi bere.",
      "choices": [
        {"id": 1, "text": "Cappuccino", "nextSceneId": 15},
        {"id": 2, "text": "Caffè normale", "nextSceneId": 19},
        {"id": 3, "text": "Succo d'arancia", "nextSceneId": 23}
      ],
      "isFinal": false
    },

    // PERCORSO 2A: Cappuccino (15-18)
    {"id": 15, "title": "Il barista ti prepara un cappuccino perfetto con la schiuma", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 16}], "isFinal": false},
    {"id": 16, "title": "Lo bevi mentre guardi fuori dalla finestra", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 17}], "isFinal": false},
    {"id": 17, "title": "Vedi delle macchine che corrono in strada", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 18}], "isFinal": false},
    {"id": 18, "title": "Decidi di uscire per vedere meglio", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}], "isFinal": false},

    // PERCORSO 2B: Caffè (19-22)
    {"id": 19, "title": "Il barista ti serve un caffè nero bollente", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 20}], "isFinal": false},
    {"id": 20, "title": "È così amaro che fai una smorfia disgustata", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 21}], "isFinal": false},
    {"id": 21, "title": "Il barista si offende e ti caccia dal locale", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 22}], "isFinal": false},
    {"id": 22, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 14}], "isFinal": false},

    // PERCORSO 2C: Succo (23-26)
    {"id": 23, "title": "Ordini un succo d'arancia fresco", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 24}], "isFinal": false},
    {"id": 24, "title": "Il barista ti porta un succo fatto una settimana fa", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 25}], "isFinal": false},
    {"id": 25, "title": "Ha un sapore orribile e ti senti male", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 26}], "isFinal": false},
    {"id": 26, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 14}], "isFinal": false},

    // === SCENA 3: La gara clandestina ===
    {
      "id": 27,
      "title": "Scena 3: La gara clandestina",
      "description": "Fuori dal bar c'è una gara di macchine illegale. Un pilota ti chiede se vuoi partecipare.",
      "choices": [
        {"id": 1, "text": "Sì, partecipo alla gara!", "nextSceneId": 28},
        {"id": 2, "text": "No, è troppo pericoloso", "nextSceneId": 32},
        {"id": 3, "text": "Chiamo la polizia", "nextSceneId": 36}
      ],
      "isFinal": false
    },

    // PERCORSO 3A: Partecipo (28-31)
    {"id": 28, "title": "Sali su una macchina sportiva rossa", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 29}], "isFinal": false},
    {"id": 29, "title": "La gara inizia e parti a tutta velocità", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 30}], "isFinal": false},
    {"id": 30, "title": "Dopo una gara mozzafiato arrivi secondo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 31}], "isFinal": false},
    {"id": 31, "title": "Il vincitore ti regala una corona d'oro per il compleanno!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 40}], "isFinal": false},

    // PERCORSO 3B: Troppo pericoloso (32-35)
    {"id": 32, "title": "Rifiuti di partecipare perché hai paura", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 33}], "isFinal": false},
    {"id": 33, "title": "I piloti ti prendono in giro chiamandoti codardo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 34}], "isFinal": false},
    {"id": 34, "title": "Ti senti umiliato davanti a tutti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 35}], "isFinal": false},
    {"id": 35, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}], "isFinal": false},

    // PERCORSO 3C: Chiamo polizia (36-39)
    {"id": 36, "title": "Decidi di chiamare la polizia per fermare la gara", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 37}], "isFinal": false},
    {"id": 37, "title": "I piloti ti sentono e si arrabbiano molto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 38}], "isFinal": false},
    {"id": 38, "title": "Ti inseguono per picchiarti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 39}], "isFinal": false},
    {"id": 39, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 27}], "isFinal": false},

    // === SCENA 4: Inseguimento polizia ===
    {
      "id": 40,
      "title": "Scena 4: Inseguimento polizia",
      "description": "Arriva la polizia e inizia un inseguimento! Come scappi?",
      "choices": [
        {"id": 1, "text": "Scappi a piedi tra i vicoli", "nextSceneId": 41},
        {"id": 2, "text": "Usi i tuoi poteri anime per volare", "nextSceneId": 45},
        {"id": 3, "text": "Ti nascondi in un cassonetto", "nextSceneId": 49}
      ],
      "isFinal": false
    },

    // PERCORSO 4A: Scappi vicoli (41-44)
    {"id": 41, "title": "Corri attraverso i vicoli stretti del centro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 42}], "isFinal": false},
    {"id": 42, "title": "Salti sopra le macchine parcheggiate", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 43}], "isFinal": false},
    {"id": 43, "title": "Riesci a seminare la polizia", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 44}], "isFinal": false},
    {"id": 44, "title": "Ti ritrovi davanti a un grande palazzo: l'IKEA", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},

    // PERCORSO 4B: Poteri anime (45-48)
    {"id": 45, "title": "Attivi i tuoi poteri anime segreti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 46}], "isFinal": false},
    {"id": 46, "title": "Cominci a volare sopra la città come un supereroe", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 47}], "isFinal": false},
    {"id": 47, "title": "La polizia resta senza parole guardandoti volare", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 48}], "isFinal": false},
    {"id": 48, "title": "Atterri dall'altra parte della città, al sicuro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},

    // PERCORSO 4C: Cassonetto (49-52)
    {"id": 49, "title": "Ti tuffi in un cassonetto per nasconderti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 50}], "isFinal": false},
    {"id": 50, "title": "Un poliziotto ti trova subito perché puzzi", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 51}], "isFinal": false},
    {"id": 51, "title": "Ti arrestano e ti portano in questura", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 52}], "isFinal": false},
    {"id": 52, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 40}], "isFinal": false},

    // === SCENA 5: Boss battle IKEA ===
    {
      "id": 53,
      "title": "Scena 5: Boss battle IKEA",
      "description": "Entri nell'IKEA e trovi Mattarella che ti aspetta per un duello epico tra i mobili!",
      "choices": [
        {"id": 1, "text": "Attacchi con una poltrona POÄNG", "nextSceneId": 54},
        {"id": 2, "text": "Lanci delle polpette del ristorante", "nextSceneId": 58},
        {"id": 3, "text": "Cerchi di convincerlo diplomaticamente", "nextSceneId": 62}
      ],
      "isFinal": false
    },

    // PERCORSO 5A: Poltrona (54-57)
    {"id": 54, "title": "Afferri una poltrona POÄNG e la lanci contro Mattarella", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 55}], "isFinal": false},
    {"id": 55, "title": "Mattarella schiva agilmente e contrattacca con una libreria BILLY", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 56}], "isFinal": false},
    {"id": 56, "title": "Riesci a schivare la libreria per un pelo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 57}], "isFinal": false},
    {"id": 57, "title": "Mattarella ammette la sconfitta e se ne va", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 66}], "isFinal": false},

    // PERCORSO 5B: Polpette (58-61)
    {"id": 58, "title": "Prendi le polpette dal ristorante IKEA", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 59}], "isFinal": false},
    {"id": 59, "title": "Le lanci come granate contro Mattarella", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 60}], "isFinal": false},
    {"id": 60, "title": "Mattarella scivola sulla salsa e cade", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 61}], "isFinal": false},
    {"id": 61, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},

    // PERCORSO 5C: Diplomazia (62-65)
    {"id": 62, "title": "Cerchi di convincere Mattarella con le parole", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 63}], "isFinal": false},
    {"id": 63, "title": "Gli spieghi che è il tuo compleanno", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 64}], "isFinal": false},
    {"id": 64, "title": "Mattarella non ci crede e ti attacca", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 65}], "isFinal": false},
    {"id": 65, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 53}], "isFinal": false},

    // === SCENA 6: Boss battle Supermercato ===
    {
      "id": 66,
      "title": "Scena 6: Boss battle Supermercato",
      "description": "Esci dall'IKEA e entri in un supermercato dove trovi Gerry Scotti pronto per un altro duello!",
      "choices": [
        {"id": 1, "text": "Lanci carrelli della spesa", "nextSceneId": 67},
        {"id": 2, "text": "Usi le banane come boomerang", "nextSceneId": 71},
        {"id": 3, "text": "Lo sfidi a un quiz televisivo", "nextSceneId": 75}
      ],
      "isFinal": false
    },

    // PERCORSO 6A: Carrelli (67-70)
    {"id": 67, "title": "Afferri dei carrelli e li lanci contro Gerry", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 68}], "isFinal": false},
    {"id": 68, "title": "Gerry schiva ridendo e dice 'Sbagliato!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 69}], "isFinal": false},
    {"id": 69, "title": "Ti lancia contro delle lattine di pomodoro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 70}], "isFinal": false},
    {"id": 70, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 66}], "isFinal": false},

    // PERCORSO 6B: Banane (71-74)
    {"id": 71, "title": "Prendi un casco di banane e le lanci come boomerang", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 72}], "isFinal": false},
    {"id": 72, "title": "Le banane colpiscono Gerry che scivola comicamente", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 73}], "isFinal": false},
    {"id": 73, "title": "Gerry si rialza ridendo e ti fa i complimenti", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 74}], "isFinal": false},
    {"id": 74, "title": "Vinci il duello e Gerry se ne va", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 79}], "isFinal": false},

    // PERCORSO 6C: Quiz (75-78)
    {"id": 75, "title": "Lo sfidi: 'Gerry, facciamo un quiz!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 76}], "isFinal": false},
    {"id": 76, "title": "Gerry accetta sorridendo: 'Quanto fa 2+2?'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 77}], "isFinal": false},
    {"id": 77, "title": "Rispondi '4' e Gerry ammette la sconfitta", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 78}], "isFinal": false},
    {"id": 78, "title": "Ti regala 1 milione di euro virtuali", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 79}], "isFinal": false},

    // === SCENA 7: Esports League of Legends ===
    {
      "id": 79,
      "title": "Scena 7: Esports League of Legends",
      "description": "Trovi un internet café e decidi di giocare a League of Legends. Che champion scegli?",
      "choices": [
        {"id": 1, "text": "Yasuo mid lane", "nextSceneId": 80},
        {"id": 2, "text": "Thresh support", "nextSceneId": 84},
        {"id": 3, "text": "Teemo jungle (per trollare)", "nextSceneId": 88}
      ],
      "isFinal": false
    },

    // PERCORSO 7A: Yasuo (80-83)
    {"id": 80, "title": "Prendi Yasuo e vai mid contro un Zed nemico", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 81}], "isFinal": false},
    {"id": 81, "title": "Fai una outplay incredibile con il Wind Wall", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 82}], "isFinal": false},
    {"id": 82, "title": "Il tuo team vince la partita e tu sei MVP!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 83}], "isFinal": false},
    {"id": 83, "title": "Vinci un torneo esports e ricevi un trofeo", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 92}], "isFinal": false},

    // PERCORSO 7B: Thresh (84-87)
    {"id": 84, "title": "Prendi Thresh e aiuti il tuo ADC in bot lane", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 85}], "isFinal": false},
    {"id": 85, "title": "Fai hook perfetti ma il tuo ADC è scarso", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 86}], "isFinal": false},
    {"id": 86, "title": "Perdete la partita per colpa sua", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 87}], "isFinal": false},
    {"id": 87, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 79}], "isFinal": false},

    // PERCORSO 7C: Teemo troll (88-91)
    {"id": 88, "title": "Decidi di trollare con Teemo jungle", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 89}], "isFinal": false},
    {"id": 89, "title": "Il tuo team si arrabbia e ti reporta", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 90}], "isFinal": false},
    {"id": 90, "title": "Vieni bannato permanentemente", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 91}], "isFinal": false},
    {"id": 91, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 79}], "isFinal": false},

    // === SCENA 8: Guerra cinema ===
    {
      "id": 92,
      "title": "Scena 8: Guerra cinema",
      "description": "Esci dall'internet café e trovi una guerra tra il cinema Universo e il Warner Montesilvano!",
      "choices": [
        {"id": 1, "text": "Aiuti l'Universo con popcorn esplosivi", "nextSceneId": 93},
        {"id": 2, "text": "Difendi il Warner con nachos", "nextSceneId": 97},
        {"id": 3, "text": "Cerchi di fare pace tra i due", "nextSceneId": 101}
      ],
      "isFinal": false
    },

    // PERCORSO 8A: Universo (93-96)
    {"id": 93, "title": "Aiuti l'Universo lanciando popcorn esplosivi", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 94}], "isFinal": false},
    {"id": 94, "title": "I popcorn esplodono creando buchi nel Warner", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 95}], "isFinal": false},
    {"id": 95, "title": "L'Universo vince la guerra!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 96}], "isFinal": false},
    {"id": 96, "title": "Ti nominano generale dell'esercito cinema", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 105}], "isFinal": false},

    // PERCORSO 8B: Warner (97-100)
    {"id": 97, "title": "Difendi il Warner costruendo muri di nachos", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 98}], "isFinal": false},
    {"id": 98, "title": "I nachos non resistono agli attacchi", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 99}], "isFinal": false},
    {"id": 99, "title": "Il Warner viene conquistato", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 100}], "isFinal": false},
    {"id": 100, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 92}], "isFinal": false},

    // PERCORSO 8C: Pace (101-104)
    {"id": 101, "title": "Cerchi di mediare: 'Fermatevi! Fate pace!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 102}], "isFinal": false},
    {"id": 102, "title": "Entrambi i cinema ti attaccano", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 103}], "isFinal": false},
    {"id": 103, "title": "Ti chiamano traditore", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 104}], "isFinal": false},
    {"id": 104, "title": "You died", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 92}], "isFinal": false},

    // === SCENA 9: Challenge finale ===
    {
      "id": 105,
      "title": "Scena 9: Challenge finale",
      "description": "Arrivi alle tre prove finali per vincere il regalo di compleanno perfetto! Quale affronti?",
      "choices": [
        {"id": 1, "text": "Prova del canestro", "nextSceneId": 106},
        {"id": 2, "text": "Prova di forza", "nextSceneId": 110},
        {"id": 3, "text": "Indovinello finale", "nextSceneId": 114}
      ],
      "isFinal": false
    },

    // PERCORSO 9A: Canestro (106-109)
    {"id": 106, "title": "Ti concentri per il tiro perfetto", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 107}], "isFinal": false},
    {"id": 107, "title": "La palla entra perfettamente nel canestro", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 108}], "isFinal": false},
    {"id": 108, "title": "Hai superato la prima prova!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 109}], "isFinal": false},
    {"id": 109, "title": "Passi alla prova di forza", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 110}], "isFinal": false},

    // PERCORSO 9B: Forza (110-113)
    {"id": 110, "title": "Devi sollevare un peso di 100kg", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 111}], "isFinal": false},
    {"id": 111, "title": "Usi la tecnica perfetta e lo sollevi", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 112}], "isFinal": false},
    {"id": 112, "title": "Hai superato la seconda prova!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 113}], "isFinal": false},
    {"id": 113, "title": "Passi all'indovinello finale", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 114}], "isFinal": false},

    // PERCORSO 9C: Indovinello (114-117)
    {"id": 114, "title": "L'indovinello è: 'Cosa diventa più leggero quanto più lo riempi?'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 115}], "isFinal": false},
    {"id": 115, "title": "Rispondi: 'Un palloncino!'", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 116}], "isFinal": false},
    {"id": 116, "title": "Risposta corretta! Hai superato tutte le prove!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 117}], "isFinal": false},
    {"id": 117, "title": "Ricevi il regalo di compleanno perfetto!", "description": "", "choices": [{"id": 1, "text": "Avanti", "nextSceneId": 118}], "isFinal": false},

    // SCENA FINALE
    {
      "id": 118,
      "title": "VITTORIA FINALE!",
      "description": "Congratulazioni! Hai completato la tua incredibile avventura di compleanno! Hai vinto la gara, sconfitto Mattarella e Gerry Scotti, dominato a League of Legends, vinto la guerra dei cinema e superato tutte le prove finali. È stato il compleanno più epico di sempre!",
      "choices": [],
      "isFinal": true
    }
  ]
};

// Scrivi il file
fs.writeFileSync('./backend/data/gameData.json', JSON.stringify(gameData, null, 2));

console.log('🎊 GIOCO COMPLETO CON TUTTE LE SCENE!');
console.log(`📊 Scene totali: ${gameData.scenes.length}`);
console.log(`🎮 Scene principali con scelte: ${gameData.scenes.filter(s => s.choices.length > 1).length}`);
console.log(`📖 Scene narrative con "Avanti": ${gameData.scenes.filter(s => s.choices.length === 1 && s.choices[0]?.text === "Avanti").length}`);
console.log(`💀 Scene "You died": ${gameData.scenes.filter(s => s.title === "You died").length}`);
console.log(`🏆 Scene finali: ${gameData.scenes.filter(s => s.isFinal).length}`);
console.log('✅ Struttura PERFETTA: scene principali + narrative + You died');
console.log('🎮 PERCORSO VINCENTE COMPLETO: 9 scene principali + finale');
console.log('🎁 CONTENUTO: Sveglia → Colazione → Gara → Polizia → IKEA → Supermercato → LoL → Cinema → Challenge → VITTORIA!');