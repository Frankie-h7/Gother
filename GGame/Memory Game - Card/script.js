// =============================================
// VARIABILI GLOBALI E SELEZIONE ELEMENTI DOM
// =============================================

// Pool di emoji disponibili per il gioco
const EMOJI_POOL = [
  '🐱','🐶','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
  '🐔','🐧','🐦','🐤','🐣','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱',
  '🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🕷','🦂','🐢','🐍','🦎','🦖','🦕',
  '🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🦭','🐅',
  '🐆','🦓','🦍','🦧','🐘','🦣','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂',
  '🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🪶',
  '🐓','🦃','🦤','🦚','🦜','🕊','🐇','🦝','🦨','🦡','🦦','🦥','🐁','🐀','🐿','🦔'
];

// Seleziona gli elementi del DOM
const difficultySelector = document.getElementById('difficulty');
const cardGrid = document.getElementById('card-grid');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
// Aggiungi questa selezione nella sezione delle variabili globali (in alto con le altre)
const toggleGridBtn = document.getElementById('toggleGridBtn');
const toggleRevealBtn = document.getElementById('toggleRevealBtn');

// SUONI WIN E WRONG
const soundMatch = new Audio('sounds/match.mp3');
const soundWrong = new Audio('sounds/wrong.mp3');
const soundWin = new Audio('sounds/win.mp3');
const soundFlip = new Audio('sounds/flip.mp3');
soundFlip.volume = 0.4; // Puoi regolare il volume come preferisci
// Aggiungi questi nuovi suoni
const soundShowCards = new Audio('sounds/show.mp3'); // Primo suono (mostra carte)
const soundHideCards = new Audio('sounds/hide.mp3'); // Secondo suono (nascondi carte)
const soundShuffleShow = new Audio('sounds/shuffleCardShow.mp3');      // Primo suono (scopri carte)
const soundShuffleHiden = new Audio('sounds/shuffleCardHidden.mp3');    // Secondo suono (copri carte)
// Imposta volumi se necessario
soundShowCards.volume = 0.6;
soundHideCards.volume = 0.6;
soundShuffleShow.volume = 0.6;
soundShuffleHiden.volume = 0.6;

// Variabili di stato del gioco
let currentIcons = [];      // Emoji selezionate per la partita corrente
let firstCard = null;       // Prima carta selezionata
let secondCard = null;      // Seconda carta selezionata
let lockBoard = false;      // Blocca il tabellone durante l'animazione
let matchedPairs = 0;       // Numero di coppie trovate
let moves = 0;              // Numero di mosse effettuate
let timerInterval = null;   // Riferimento all'intervallo del timer
let seconds = 0;            // Secondi trascorsi
let minutes = 0;            // Minuti trascorsi

// =============================================
// FUNZIONI DI UTILITÀ
// =============================================

/**
 * Mescola un array usando l'algoritmo Fisher-Yates
 * @param {Array} array - L'array da mescolare
 * @returns {Array} - L'array mescolato
 */
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Seleziona le emoji in base alla difficoltà
 * @returns {Array} - Array di emoji per la partita
 */
function getIconsByDifficulty() {
    const level = difficultySelector.value;
    let pairCount;

    if (level === 'easy') pairCount = 8;       // 16 carte
    else if (level === 'medium') pairCount = 18; // 36 carte
    else if (level === 'hard') pairCount = 32;    // 64 carte

    // Prende un sottoinsieme casuale dal pool
    return shuffle(EMOJI_POOL).slice(0, pairCount);
}

// =============================================
// FUNZIONI PRINCIPALI DEL GIOCO
// =============================================

/**
 * Inizia una nuova partita
 */
function startGame() {
    // Resetta lo stato del gioco
    clearInterval(timerInterval);
    cardGrid.innerHTML = '';
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    minutes = 0;
    updateTimer();
    updateMoves();

    // Seleziona le emoji in base alla difficoltà
    currentIcons = [...getIconsByDifficulty()];
    
    // Crea un array di carte (coppie di emoji) e le mescola
    const gameCards = shuffle([...currentIcons, ...currentIcons]);

    // Crea le carte nel DOM
    gameCards.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front">${icon}</div>
            <div class="back">❓</div>
        `;
        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
    });

        // ... (codice esistente all'inizio della funzione)

    // Imposta lo stato iniziale della griglia
    cardGrid.classList.remove('expanded');
    cardGrid.classList.add('collapsed');
    toggleGridBtn.textContent = '📂 Mostra carte';
    toggleRevealBtn.textContent = '🃏 Scopri carte';

   // ... (resto del codice esistente)

    // Imposta il layout della griglia in base al numero di carte
// Imposta il layout della griglia in base al numero di carte totali
const totalCards = currentIcons.length * 2;

// Calcola automaticamente le colonne in base al numero di carte
let columns;
if (totalCards <= 16) columns = 4;
else if (totalCards <= 36) columns = 6;
else if (totalCards <= 64) columns = 8;
else columns = 10;

cardGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

// =============================================
// FUNZIONI PER GESTIRE I PULSANTI
// =============================================

// Toggle apertura/chiusura della griglia (menu a tendina)
toggleGridBtn.addEventListener('click', () => {
    cardGrid.classList.toggle('collapsed');
    cardGrid.classList.toggle('expanded');

    if (cardGrid.classList.contains('expanded')) {
        toggleGridBtn.textContent = '📁 Nascondi carte';
        soundShowCards.currentTime = 0; // Riavvia il suono se è già in riproduzione
        soundShowCards.play(); // Primo suono per mostra carte
    } else {
        toggleGridBtn.textContent = '📂 Mostra carte';
        soundHideCards.currentTime = 0;
        soundHideCards.play(); // Secondo suono per nascondi carte
    }
});

// Aggiungi queste variabili globali
let autoFlippedCards = [];
let isRevealMode = false;

// Toggle scopri/copri carte
// Rimuovi il doppio event listener per toggleRevealBtn e usa solo questo:
toggleRevealBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card:not(.matched)');

    if (!isRevealMode) {
        isRevealMode = true;
        autoFlippedCards = [];

        cards.forEach(card => {
            if (!card.classList.contains('flip')) {
                card.classList.add('flip');
                card.dataset.autoFlipped = "true"; // MARCA la carta
                autoFlippedCards.push(card);
            }
        });

        toggleRevealBtn.textContent = '🙈 Copri carte';
        soundShuffleShow.currentTime = 0;
        soundShuffleShow.play();
    } else {
        isRevealMode = false;

        autoFlippedCards.forEach(card => {
            card.classList.remove('flip');
            delete card.dataset.autoFlipped;
        });

        autoFlippedCards = [];

        toggleRevealBtn.textContent = '🃏 Scopri carte';
        soundShuffleHiden.currentTime = 0;
        soundShuffleHiden.play();
    }
});

/**=============================
 * Gestisce il click su una carta
 ===============================*/
function flipCard() {
    // Se il tabellone è bloccato o la carta è già girata, esci
    if (lockBoard || this.classList.contains('matched')) return;

    // Se è una carta girata automaticamente
    if (this.classList.contains('flip') && this.dataset.autoFlipped === "true") {
        this.classList.remove('flip');
        delete this.dataset.autoFlipped;

        const index = autoFlippedCards.indexOf(this);
        if (index !== -1) autoFlippedCards.splice(index, 1);
        return; // Solo in questo caso ritorniamo subito
    }

    // Se è già girata normalmente, ignora il click
    if (this.classList.contains('flip')) return;

    // Gira la carta
    this.classList.add('flip');

    // Evita suono flip se è in corso un suono match/wrong
    if (soundMatch.paused && soundWrong.paused) {
    // Suono del flip
    soundFlip.currentTime = 0; // Riavvia se il suono è ancora in riproduzione
    soundFlip.play();
    }

    // Se è la prima carta selezionata
    if (!firstCard) {
        firstCard = this;
        // Avvia il timer al primo click
        if (moves === 0) startTimer();
        return;
    }

    // Se è la seconda carta selezionata
    secondCard = this;
    lockBoard = true; // Blocca il tabellone
    checkMatch();
}

/**
 * Controlla se le due carte selezionate corrispondono
 */
function checkMatch() {
    const isMatch = firstCard.querySelector('.front').textContent === 
                    secondCard.querySelector('.front').textContent;

    if (isMatch) {
        // Suono
        soundMatch.play();
        // Se corrispondono, disabilita le carte
        matchedPairs++;
        disableCards();
        // Controlla se il gioco è finito
        if (matchedPairs === currentIcons.length) endGame();
    } else {
        // Suono
        soundWrong.play();
        // Se non corrispondono, rigira le carte
        unflipCards();
    }

    // Aggiorna il contatore delle mosse
    moves++;
    updateMoves();
}

/**
 * Disabilita le carte corrispondenti
 */
function disableCards() {
    // Aggiungi la classe 'matched' per lo stile visivo
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    // Rimuovi gli event listener per evitare nuovi click
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    // Resetta il tabellone
    resetBoard();
}

/**
 * Rigira le carte che non corrispondono
 */
function unflipCards() {
    firstCard.classList.add('wrong');
    secondCard.classList.add('wrong');

    setTimeout(() => {
        firstCard.classList.remove('flip', 'wrong');
        secondCard.classList.remove('flip', 'wrong');
        resetBoard();
    }, 800);
}

/**
 * Resetta lo stato dopo aver valutato una coppia
 */
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// =============================================
// FUNZIONI DI INTERFACCIA
// =============================================

/**
 * Aggiorna il display dei tentativi
 */
function updateMoves() {
    movesDisplay.textContent = `🎯 Tentativi: ${moves}`;
}

/**
 * Avvia il timer
 */
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        updateTimer();
    }, 1000);
}

/**
 * Aggiorna il display del timer
 */
function updateTimer() {
    timerDisplay.textContent = `⏱️ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Gestisce la fine del gioco
 */
function endGame() {
    clearInterval(timerInterval);
    soundWin.play();

    setTimeout(() => {
        alert(`🎉 Livello completato in ${minutes}m ${seconds}s con ${moves} tentativi!`);

        // Passa al livello successivo
        const nextLevel = {
            easy: 'medium',
            medium: 'hard',
            hard: null
        }[difficultySelector.value];

        if (nextLevel) {
            difficultySelector.value = nextLevel;
            startGame();
        } else {
            alert("🎊 Hai completato tutti i livelli!");
        }
    }, 500);
}

// =============================================
// EVENT LISTENERS
// =============================================

// Bottone per ricominciare
restartBtn.addEventListener('click', startGame);

// Cambio difficoltà
difficultySelector.addEventListener('change', startGame);

// Avvia il gioco all'inizio
startGame();