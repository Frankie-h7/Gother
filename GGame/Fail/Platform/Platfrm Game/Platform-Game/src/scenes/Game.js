export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        
        // Variabili di gioco
        this.player = null;
        this.platforms = null;
        this.coins = null;
        this.enemies = null;
        this.pipes = null;
        this.finishFlag = null;
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        this.gameOver = false;
        this.isInvincible = false;
        this.canEnterPipe = false;
        this.currentPipe = null;
        
        // Suoni
        this.bgMusic = null;
        this.jumpSound = null;
        this.coinSound = null;
        this.deathSound = null;
        this.pipeSound = null;
    }

    init(data) {
        // Imposta il livello iniziale se specificato
        if (data && data.level) {
            this.level = data.level;
        }
        
        // Reset dei valori per nuova partita
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
    }

    preload() {
        // Caricamento delle immagini
        this.load.image('sky', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/skies/space3.png');
        this.load.image('ground', '/api/placeholder/128/32');
        this.load.image('platform', '/api/placeholder/128/16');
        this.load.image('pipe', '/api/placeholder/64/64');
        this.load.image('coin', '/api/placeholder/32/32');
        this.load.image('flag', '/api/placeholder/32/96');
        
        // Spritesheet per personaggi e nemici
        this.load.spritesheet('player', '/api/placeholder/384/48', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('enemy', '/api/placeholder/192/32', { frameWidth: 32, frameHeight: 32 });
        
        // Caricamento dei suoni
        this.load.audio('jump', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/SoundEffects/jump.wav');
        this.load.audio('coin', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/SoundEffects/key.wav');
        this.load.audio('death', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/SoundEffects/death.wav');
        this.load.audio('pipe', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/SoundEffects/pipe.wav');
        this.load.audio('gameMusic', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/gameover.wav');
    }

    create() {
        // Setup della scena
        this.add.image(640, 360, 'sky').setScale(2);
        
        // Creazione delle piattaforme statiche
        this.platforms = this.physics.add.staticGroup();
        
        // Creazione del terreno
        this.platforms.create(640, 704, 'ground').setScale(20, 1).refreshBody();
        
        // Creazione di piattaforme in base al livello
        this.createLevelPlatforms();
        
        // Creazione del traguardo
        this.finishFlag = this.physics.add.sprite(1200, 550, 'flag');
        this.finishFlag.setImmovable(true);
        this.finishFlag.body.allowGravity = false;
        
        // Creazione dei tubi
        this.pipes = this.physics.add.staticGroup();
        this.createLevelPipes();
        
        // Creazione del giocatore
        this.player = this.physics.add.sprite(100, 560, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // Animazioni del giocatore
        this.createPlayerAnimations();
        
        // Creazione delle monete
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 17,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.coins.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(0.5);
        });
        
        // Creazione dei nemici
        this.enemies = this.physics.add.group();
        this.createLevelEnemies();
        
        // Collisioni
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.pipes);
        this.physics.add.collider(this.player, this.pipes, this.checkPipeEntry, null, this);
        
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.finishFlag, this.reachFinish, null, this);
        
        // Controlli
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // UI del gioco
        this.scoreText = this.add.text(16, 16, 'Punteggio: 0', { 
            fontSize: '32px', 
            fill: '#f0c419',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.livesText = this.add.text(1080, 16, 'Vite: 3', { 
            fontSize: '32px', 
            fill: '#f0c419',
            stroke: '#000000',
            strokeThickness: 4
        });
        
        // Tasto per tornare al menu
        const menuButton = this.add.text(1200, 680, 'Menu', { 
            fontSize: '24px', 
            fill: '#f0c419',
            backgroundColor: '#1e1e1e',
            padding: { x: 12, y: 8 },
            borderRadius: 5
        }).setOrigin(1, 1).setInteractive();
        
        menuButton.on('pointerdown', () => {
            menuButton.setScale(0.9);
        });
        
        menuButton.on('pointerup', () => {
            menuButton.setScale(1);
            this.sound.stopAll();
            this.scene.start('Menu');
        });
        
        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#ffffff' });
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#f0c419' });
            menuButton.setScale(1);
        });
        
        // Suoni
        this.jumpSound = this.sound.add('jump');
        this.coinSound = this.sound.add('coin');
        this.deathSound = this.sound.add('death');
        this.pipeSound = this.sound.add('pipe');
        this.bgMusic = this.sound.add('gameMusic', { loop: true, volume: 0.5 });
        this.bgMusic.play();
        
        // Etichetta del livello
        this.add.text(640, 16, 'Livello ' + this.level, { 
            fontSize: '32px', 
            fill: '#f0c419',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0);
    }

    update() {
        if (this.gameOver) return;
        
        // Controlli di movimento
        const isLeftPressed = this.cursors.left.isDown || this.wasdKeys.left.isDown;
        const isRightPressed = this.cursors.right.isDown || this.wasdKeys.right.isDown;
        const isUpPressed = this.cursors.up.isDown || this.wasdKeys.up.isDown;
        const isDownPressed = this.cursors.down.isDown || this.wasdKeys.down.isDown;
        
        if (isLeftPressed) {
            this.player.setVelocityX(-240);
            this.player.anims.play('left', true);
        } else if (isRightPressed) {
            this.player.setVelocityX(240);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if ((isUpPressed) && this.player.body.touching.down) {
            this.player.setVelocityY(-650);
            this.jumpSound.play();
        }
        
        if (isDownPressed && this.canEnterPipe && this.currentPipe) {
            this.enterPipe();
        }
        
        // Movimento dei nemici
        this.enemies.children.iterate((enemy) => {
            if (enemy.body.touching.right || enemy.body.blocked.right) {
                enemy.setVelocityX(-120);
                enemy.anims.play('enemy-left', true);
            } else if (enemy.body.touching.left || enemy.body.blocked.left) {
                enemy.setVelocityX(120);
                enemy.anims.play('enemy-right', true);
            }

            // Se il nemico ha una velocità iniziale pari a 0, assegna una velocità
            if (enemy.body.velocity.x === 0) {
                enemy.setVelocityX(120);
                enemy.anims.play('enemy-right', true);
            }
        });
    }

    // Creazione delle piattaforme in base al livello
    createLevelPlatforms() {
        if (this.level === 1) {
            this.platforms.create(900, 500, 'platform');
            this.platforms.create(150, 400, 'platform');
            this.platforms.create(1100, 320, 'platform');
            this.platforms.create(600, 420, 'platform');
            this.platforms.create(400, 350, 'platform');
        } else if (this.level === 2) {
            this.platforms.create(220, 500, 'platform');
            this.platforms.create(600, 400, 'platform');
            this.platforms.create(900, 540, 'platform');
            this.platforms.create(400, 300, 'platform');
            this.platforms.create(800, 260, 'platform');
            this.platforms.create(1050, 400, 'platform');
        } else if (this.level === 3) {
            this.platforms.create(300, 500, 'platform');
            this.platforms.create(600, 380, 'platform');
            this.platforms.create(900, 260, 'platform');
            this.platforms.create(1100, 420, 'platform');
            this.platforms.create(220, 380, 'platform');
            this.platforms.create(750, 280, 'platform');
            this.platforms.create(450, 220, 'platform');
        }
    }

    // Creazione dei tubi in base al livello
    createLevelPipes() {
        if (this.level === 1) {
            this.pipes.create(400, 640, 'pipe');
            this.pipes.create(800, 640, 'pipe');
        } else if (this.level === 2) {
            this.pipes.create(200, 640, 'pipe');
            this.pipes.create(600, 640, 'pipe');
            this.pipes.create(1000, 640, 'pipe');
        } else if (this.level === 3) {
            this.pipes.create(300, 640, 'pipe');
            this.pipes.create(600, 640, 'pipe');
            this.pipes.create(900, 640, 'pipe');
        }
    }

    // Creazione dei nemici in base al livello
    createLevelEnemies() {
        const enemiesCount = this.level * 3;
        
        for (let i = 0; i < enemiesCount; i++) {
            let x = Phaser.Math.Between(300, 1100);
            let enemy = this.enemies.create(x, 560, 'enemy');
            enemy.setBounce(0.2);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocityX(Phaser.Math.Between(-120, 120));
            
            if (enemy.body.velocity.x > 0) {
                enemy.anims.play('enemy-right', true);
            } else {
                enemy.anims.play('enemy-left', true);
            }
        }
    }

    // Creazione delle animazioni
    createPlayerAnimations() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'enemy-left',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'enemy-right',
            frames: this.anims.generateFrameNumbers('enemy', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    // Funzione per raccogliere monete
    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.coinSound.play();
        
        this.score += 10;
        this.scoreText.setText('Punteggio: ' + this.score);
    }

    // Controlla se il giocatore può entrare in un tubo
    checkPipeEntry(player, pipe) {
        if (player.body.touching.down && player.x > pipe.x - 25 && player.x < pipe.x + 25) {
            this.canEnterPipe = true;
            this.currentPipe = pipe;
        } else {
            this.canEnterPipe = false;
            this.currentPipe = null;
        }
    }

    // Entra nel tubo
    enterPipe() {
        this.pipeSound.play();
        this.player.setTint(0x777777);
        
        this.tweens.add({
            targets: this.player,
            y: this.player.y + 60,
            duration: 500,
            onComplete: () => {
                // Teletrasporto ad un punto casuale della mappa
                this.player.clearTint();
                this.player.x = Phaser.Math.Between(200, 1000);
                this.player.y = 100;
            }
        });
    }

    // Funzione per gestire la collisione con nemici
    hitEnemy(player, enemy) {
        if (this.isInvincible) return;
        
        // Se il player salta sul nemico
        if (player.body.velocity.y > 0 && player.y < enemy.y - 20) {
            enemy.disableBody(true, true);
            player.setVelocityY(-400);
            this.score += 20;
            this.scoreText.setText('Punteggio: ' + this.score);
            return;
        }
        
        this.deathSound.play();
        this.lives--;
        this.livesText.setText('Vite: ' + this.lives);
        
        if (this.lives <= 0) {
            this.gameOver = true;
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            
            // Game over e transizione alla scena di Game Over
            this.time.delayedCall(1000, () => {
                this.sound.stopAll();
                this.scene.start('GameOver', { 
                    score: this.score,
                    level: this.level
                });
            });
            
            return;
        }
        
        // Invincibilità temporanea
        this.isInvincible = true;
        player.setTint(0xff0000);
        
        this.time.delayedCall(1500, () => {
            this.isInvincible = false;
            player.clearTint();
        });
        
        // Rinculo
        if (player.x < enemy.x) {
            player.setVelocityX(-300);
        } else {
            player.setVelocityX(300);
        }
        player.setVelocityY(-400);
    }

    // Raggiungimento del traguardo
    reachFinish(player, flag) {
        if (this.level < 3) {
            // Avanza al livello successivo
            this.sound.stopAll();
            this.scene.start('Game', { level: this.level + 1 });
        } else {
            // Hai completato il gioco
            this.add.text(640, 360, 'Congratulazioni!\nHai completato il gioco!', {
                fontSize: '48px',
                fontStyle: 'bold',
                fill: '#f0c419',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5);
            
            this.physics.pause();
            this.gameOver = true;
            
            // Ritorno al menu dopo un po'
            this.time.delayedCall(5000, () => {
                this.sound.stopAll();
                this.scene.start('Menu');
            });
        }
    }
}