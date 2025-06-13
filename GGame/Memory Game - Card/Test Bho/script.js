const cards = ["🐱", "🐶", "🐱", "🐶"];
let flippedCards = [];

function shuffleCards(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const board = document.getElementById("game-board");
  shuffleCards(cards).forEach((emoji, index) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (flippedCards.length < 2) {
    card.innerText = card.dataset.emoji;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  if (flippedCards[0].dataset.emoji !== flippedCards[1].dataset.emoji) {
    flippedCards.forEach(card => card.innerText = "");
  }
  flippedCards = [];
}

createBoard();