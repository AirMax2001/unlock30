const fs = require('fs');

// Array degli ID delle scene recuperate dal MEGA RECOVERY
const foundIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111];

// Titoli specifici dalle scene recuperate
const sceneTitles = {
  1: 'La sveglia',
  2: 'Il russare', 
  3: 'In bagno',
  4: 'Il telefono',
  5: 'La protesta',
  6: 'La colazione',
  7: 'I messaggi',
  8: 'La gioia',
  9: 'Il muso',
  10: 'Le scuse',
  11: 'Lasci il lavoro e diventi un maestro di yoga con i leggins verdi',
  12: 'Cornetto e cappuccino',
  13: 'Il cappuccino lo fai tu, ma la schiuma sembra sputo di lontra',
  14: 'La cucina ora puzza di bruciato',
  15: 'La stampante',
  16: 'Metti in funzione la stampante e alle 11 finalmente inizi con la calibrazione',
  17: 'La macchina emette uno sbuffo, si anima e si ribella a te che sei suo padre',
  18: 'Pregusti il tuo cornetto con chantilly e pistacchio',
  19: 'Nuova Scena',
  20: 'Prendi la macchina, parcheggi, alzi lo sguardo e la fila arriva alle poste',
  21: 'Non capisci se i vecchi stiano facendo la fila per la pensione o per il caffè',
  22: 'Sbagli fila, e fai colazione in piedi alle 11 bestemmiando al suono delle tazzine sbattute',
  23: 'Nuova Scena',
  24: 'Pensi ho appena evitato uno scontro mortale con la stampante 3d e di fare la fila alle poste',
  25: 'Non capisci perché te lo stai chiedendo ma non è importante',
  26: 'Ora va iniziata la mattinata!',
  27: 'La mattina',
  29: 'Svolti a sinistra verso il mc donald sperando di aggirarli',
  30: 'La polizia ti fa svoltare a sinistra e torni su via vestina',
  31: 'La percorri cercando di svoltare a destra ma un buco multidimensionale ha reso tutte le stradine a senso unico',
  32: 'Giri in tondo per sempre',
  33: 'Apri ali express e controlli il carrello',
  34: 'Compri tutto',
  35: 'Amazon ti manda un buono sconto e liberi anche il suo carrello',
  36: 'LG ti chiama direttamente e accetti qualsiasi offerta ti propongano',
  37: 'Rimani con il conto in negativo e decidi di trasferirti in messico',
  38: 'Nuova Scena',
  40: 'Decidi che sia arrivato il momento di iscriverti ad una gara clandestina di mattina',
  41: 'Metti la canotta a costine e una collana con una croce e senti già una canzone hip-hop che ti accompagna ad accendere il tuo bolide',
  42: 'Pensi finalmente qualcuno che organizza queste gare di giorno così è più facile partecipare anche se si è astigmatici',
  43: 'Vinci e ti regalano una corona e decidi che la indosserai per tutta la serata della tua festa',
  44: 'La fuga dagli sbirri',
  45: 'tiri una marcia e la macchina si lancia, inquadratura rallenty, capelli al vento',
  46: 'La telecamera immaginaria inquadra il tuo sguardo deciso',
  47: 'Finisci in una sfilata di compleanno di un asilo che blocca la strada',
  48: 'I bimbi pensano tu sia il clown arrivato in ritardo',
  49: 'Gli agenti si fermano per non rovinare la festa: scusa perfetta',
  50: 'Dopo tutte le ore passate a guardare anime e serie tv acquisisci il potere di evocare delle ombre',
  51: 'Preso da improvvise manie di grandezza raggiungi il comune di Montesilvano e urli a gran voce di essere il nuovo re d Italia',
  52: 'Contrari?',
  53: 'Lotta contro Mattarella e Gerry scotti',
  54: 'Sgommi per le strade di Montesilvano con il filobus che ti insegue ingaggiato dalla polizia',
  55: 'Raggiungi il parcheggio di porto allegro e lo completi tutto con il freno a mano tirato finché non raggiungi il ponte',
  56: 'Nuova Scena',
  57: 'La polizia si ferma e, non vedendoti più, interrompe l inseguimento e torna tutto normale',
  58: 'Tiri un sospiro di sollievo ma inali diversi agenti chimici che ti innescano diverse modificazioni genetiche',
  59: 'Ti ritrovi in un supermercato gigante ma noti che tutto quello che ti circonda è vivo',
  60: 'Mattarella ha il potere di congelare i pavimenti con lo sguardo serio, Gerry Scotti lancia banane esplosive che cantano canzoni degli anni 80',
  61: 'Raccogli delle armi: scivoli di gelato, latte acido radioattivo, zucchine volanti',
  62: 'Con una super mossa finale il supermercato esplode in coriandoli fluorescenti e tutti ballano la Macarena su pattini a rotelle ma le fiamme dell esplosione vi inghiottono',
  63: 'Nuova Scena',
  64: 'Mattarella cavalca un carrello gigante armato di cuscini esplosivi, Gerry Scotti guida un divano volante che lancia appendiabiti come boomerang',
  65: 'Tu hai un compito: trovare la combinazione segreta di codici e misure nascosta tra scaffali, letti e lampade per disattivare i boss',
  66: 'Come arma principale, lancia polpette volanti contro i due',
  67: 'Un salmone parlante sospeso nell aria suggerisce le strategie',
  68: 'Vinci e torni a casa sacrificando le tue ombre',
  69: 'Mangi il salmone',
  70: 'Preparazione alla festa',
  71: 'Ti trovi su una collina',
  72: 'Sotto di te senti tremare la terra a 250 bpm',
  73: 'Ti trovi a saltare con 200 000 persone e non sai perché',
  74: 'Un fiore gigantesco si apre davanti a te e rivela gerry scotti nudo che sorride minaccioso',
  75: 'Mattarella è poco al di sotto che grida 3,2,1 continuamente',
  76: 'Afferri dei piatti commestibili e li usi come frisbee per annientarli',
  77: 'Le tue ombre sono distratte dalle farfalle meccaniche che scendono dal soffitto',
  78: 'Vinci ma non torni per tua scelta',
  79: 'YOU DEFEAT',
  80: 'Nuova Scena',
  81: 'Sei incredibilmente abile e nella tua squadra un ex membro dei T1 ti nota e ti scrive in privato',
  82: 'Iniziate a conversare e salta fuori che la nuova squadra abbia bisogno di un jungler',
  83: 'Pensi che sia un ottimo modo per allenarsi e accetti',
  84: 'Purtroppo il mondiale si disputa nello stesso momento della festa',
  85: 'La festa',
  88: 'Niente riesce a svegliarti',
  89: 'Nuova Scena',
  90: 'Ti invitano a disputare il mondiale degli EA sports',
  91: 'Fai il video di presentazione dove elenchi tutte le sventure che hai avuto e che batterai tutti con 60 kg di panca',
  92: 'Perdete al primo girone',
  93: 'Nuova Scena',
  94: 'Alla fine che te ne fai dei milioni',
  95: 'I tuoi cari apprendono la notizia e ti riempiono di botte',
  96: 'L aria freme',
  97: 'Il cielo si fa grigio',
  98: 'Il proprietario del centro commerciale universo dichiara guerra alla Warner di Montesilvano',
  99: 'Nuova Scena',
  100: 'Non puoi non intervenire',
  101: 'Sfoggi tutte le tue conoscenze sugli impianti e gli mostri come esempio un pandino nero',
  102: 'Rimangono sbalorditi, tutto torna normale e tu torni in tempo per la festa',
  103: 'Il regalo',
  104: 'Sei alla festa ma vuoi il regalo',
  105: 'Devi affrontare la sfida del canestro e riuscire a fare centro 3 volte prima del tuo avversario o dovrai affrontare anche la prova successiva',
  106: 'Sei alla festa ma vuoi il regalo',
  107: 'Devi fare 10 flessioni e 7 giri di campo senza campo prima del tuo avversario o se, non riesci, affronta un altra sfida',
  108: 'Sei alla festa ma vuoi il regalo',
  109: 'Risolvi questo indovinello',
  110: 'TANTI AUGURI',
  111: 'Nuova Scena'
};

// Creo le scelte specifiche per alcune scene principali
const sceneChoices = {
  1: [
    { id: 1759521001133, text: 'Ti giri dall altra parte e continui a russare', nextSceneId: 2 },
    { id: 1759521003711, text: 'Ti alzi e vai in bagno a lavarti i denti', nextSceneId: 3 },
    { id: 1759521004781, text: 'Apri il telefono prima ancora di scendere dal letto', nextSceneId: 4 }
  ],
  2: [
    { id: 1759521005001, text: 'Protesti violentemente', nextSceneId: 5 },
    { id: 1759521005002, text: 'Ti alzi di malavoglia', nextSceneId: 3 }
  ],
  3: [
    { id: 1759521005003, text: 'Vai in cucina per la colazione', nextSceneId: 6 },
    { id: 1759521005004, text: 'Controlli il telefono per i messaggi', nextSceneId: 4 }
  ],
  4: [
    { id: 1759521005009, text: 'Rispondi subito a tutti', nextSceneId: 7 },
    { id: 1759521005010, text: 'Vai prima a fare colazione', nextSceneId: 6 }
  ],
  6: [
    { id: 1759521005007, text: 'Sorridi e li ringrazi', nextSceneId: 8 },
    { id: 1759521005008, text: 'Sei ancora assonnato e non reagisci molto', nextSceneId: 9 }
  ],
  7: [
    { id: 1759521005015, text: 'Vai a scusarti', nextSceneId: 10 },
    { id: 1759521005016, text: 'Fai finta di niente e continui col telefono', nextSceneId: 88 }
  ],
  8: [
    { id: 1759521005011, text: 'Lo apri subito entusiasta', nextSceneId: 100 },
    { id: 1759521005012, text: 'Lo metti da parte per aprirlo dopo', nextSceneId: 110 }
  ],
  9: [
    { id: 1759521005013, text: 'Dici che sei solo stanco', nextSceneId: 94 },
    { id: 1759521005014, text: 'Ti scusi e cerchi di essere più allegro', nextSceneId: 8 }
  ],
  10: [
    { id: 1759521005017, text: 'Proponi di aiutare a preparare la festa', nextSceneId: 106 }
  ]
};

// Creo tutte le scene
const scenes = foundIds.map(id => ({
  id: id,
  title: sceneTitles[id] || `Scena ${id}`,
  description: `Questa è la scena ${id}. ${sceneTitles[id] || ''}`,
  image: '',
  video: '',
  choices: sceneChoices[id] || (id === 110 || id === 79 ? [] : [
    {
      id: Date.now() + id,
      text: 'Continua',
      nextSceneId: foundIds.find(nextId => nextId > id) || null
    }
  ]),
  isFinal: id === 110 || id === 79,
  createdAt: '2025-10-03T20:00:00.000Z',
  titleStyle: '',
  titleColor: '#ffffff',
  backgroundTheme: '',
  effects: {
    particles: false,
    glow: false,
    typewriter: false
  },
  lastModified: '2025-10-03T20:00:00.000Z',
  updatedAt: '2025-10-03T20:00:00.000Z'
}));

const gameData = {
  scenes: scenes,
  settings: {
    gameName: 'Il Gioco dei Trenta',
    welcomeMessage: 'Benvenuto nel gioco!',
    maxScenes: 999,
    theme: 'unlock30'
  },
  stats: {
    totalScenes: scenes.length,
    lastModified: new Date().toISOString(),
    recoveredFromCommits: true,
    recoveryVersion: 'ALL_107_SCENES_COMPLETE'
  }
};

fs.writeFileSync('./backend/data/gameData.json', JSON.stringify(gameData, null, 2));
console.log('✅ File creato con', scenes.length, 'scene!');
console.log('Prime 5 scene:');
scenes.slice(0, 5).forEach(s => console.log(`  ID ${s.id}: ${s.title}`));
console.log('Ultime 5 scene:');
scenes.slice(-5).forEach(s => console.log(`  ID ${s.id}: ${s.title}`));
console.log('\nScene con scelte multiple:');
scenes.filter(s => s.choices.length > 1).forEach(s => console.log(`  ID ${s.id}: ${s.choices.length} scelte`));