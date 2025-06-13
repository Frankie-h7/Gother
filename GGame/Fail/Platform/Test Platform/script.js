// script.js

// Configurazione di base per il gioco con Phaser.js
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;

// Funzione di preload per caricare asset
function preload() {
  this.load.image('sky', 'assets/sky.png'); // sfondo
  this.load.image('ground', 'assets/platform.png'); // piattaforme
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 }); // personaggio
}

// Funzione create per creare gli oggetti nel gioco
function create() {
  // Sfondo
  this.add.image(400, 250, 'sky');

  // Piattaforma
  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 500, 'ground').setScale(2).refreshBody();

  // Creazione del giocatore
  player = this.physics.add.sprite(100, 450, 'dude');

  // Proprio il fisico del personaggio
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  
  // Movimento con le frecce
  cursors = this.input.keyboard.createCursorKeys();

  // Aggiungi la collisione tra il giocatore e la piattaforma
  this.physics.add.collider(player, platforms);
}

// Funzione update per aggiornare lo stato del gioco
function update() {
  // Movimento del giocatore
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  // Salto del giocatore
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
