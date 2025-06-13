// Riferimenti agli elementi del DOM
const startScreen = document.getElementById('start-screen');
const playButton = document.getElementById('play-button');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const eatSound = document.getElementById('eat-sound');

// Impostazioni di gioco
const gridSize = 20;  // Dimensione della griglia
const tileCount = canvas.width / gridSize;  // Numero di tiles nel canvas
let snake = [{ x: 9 * gridSize, y: 9 * gridSize }];  // Inizializza il serpente
let direction = 'RIGHT';  // Direzione iniziale
let apple = generateApple();  // Posizione iniziale della mela
let score = 0;  // Punteggio iniziale
let gameInterval;

// Funzione per iniziare il gioco
function startGame() {
  score = 0;
  snake = [{ x: 9 * gridSize, y: 9 * gridSize }];
  direction = 'RIGHT';
  apple = generateApple();
  scoreDisplay.textContent = `Punteggio: ${score}`;
  startScreen.style.display = 'none';  // Nascondi la schermata iniziale
  canvas.style.display = 'block';  // Mostra il canvas del gioco
  gameInterval = setInterval(gameLoop, 100);  // Avvia il ciclo del gioco
}

// Funzione per fermare il gioco
function endGame() {
  clearInterval(gameInterval);  // Ferma il ciclo del gioco
  const gameOverText = document.createElement('div');
  gameOverText.id = 'game-over';
  gameOverText.textContent = `Game Over! Punteggio finale: ${score}`;
  document.body.appendChild(gameOverText);
  setTimeout(() => {
    gameOverText.classList.add('show');
  }, 100);
  setTimeout(() => {
    document.location.reload();  // Ricarica la pagina per iniziare un nuovo gioco
  }, 3000);
}

// Funzione per disegnare il serpente e la mela
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Pulisce la canvas

  // Disegna il serpente
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#ffcc00' : '#2d2d2d';  // Giallo ocra per la testa
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  // Disegna la mela
  ctx.fillStyle = '#ff0000';  // Rosso per la mela
  ctx.fillRect(apple.x, apple.y, gridSize, gridSize);
}

// Funzione per aggiornare la posizione del serpente
function update() {
  // Muove il serpente in base alla direzione
  const head = { ...snake[0] };

  if (direction === 'UP') head.y -= gridSize;
  if (direction === 'DOWN') head.y += gridSize;
  if (direction === 'LEFT') head.x -= gridSize;
  if (direction === 'RIGHT') head.x += gridSize;

  snake.unshift(head);  // Aggiungi la nuova testa

  // Controlla se il serpente mangia la mela
  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    scoreDisplay.textContent = `Punteggio: ${score}`;
    eatSound.play();  // Suono quando mangia la mela
    apple = generateApple();  // Genera una nuova mela
  } else {
    snake.pop();  // Rimuove l'ultima parte del corpo
  }

  // Controlla le collisioni con le pareti o con se stesso
  if (
    head.x < 0 || head.x >= canvas.width ||  // Collisione con le pareti
    head.y < 0 || head.y >= canvas.height ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)  // Collisione con il corpo
  ) {
    endGame();
  }
}

// Funzione per generare una nuova mela in una posizione casuale
function generateApple() {
  const x = Math.floor(Math.random() * tileCount) * gridSize;
  const y = Math.floor(Math.random() * tileCount) * gridSize;
  return { x, y };
}

// Funzione per gestire i controlli della tastiera
function changeDirection(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') {
    direction = 'UP';
  }
  if (event.key === 'ArrowDown' && direction !== 'UP') {
    direction = 'DOWN';
  }
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
    direction = 'LEFT';
  }
  if (event.key === 'ArrowRight' && direction !== 'LEFT') {
    direction = 'RIGHT';
  }
}

// Ciclo di gioco principale
function gameLoop() {
  update();
  draw();
}

// Aggiungi l'event listener per i tasti
document.addEventListener('keydown', changeDirection);

// Avvia il gioco quando si clicca il bottone "Play Game"
playButton.addEventListener('click', startGame);
