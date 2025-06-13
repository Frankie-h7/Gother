export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score || 0;
        this.level = data.level || 1;
    }

    preload() {
        // Caricamento degli assets per la schermata di game over
        this.load.audio('gameOverSound', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/gameover.wav');
    }

    create() {
        // Sfondo scuro
        this.add.rectangle(640, 360, 1280, 720, 0x040218);
        
        // Suono di game over
        this.sound.play('gameOverSound');
        
        // Testo di game over
        this.add.text(640, 200, 'GAME OVER', {
            fontSize: '84px',
            fontStyle: 'bold',
            fill: '#f0c419',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);
        
        // Punteggio finale
        this.add.text(640, 320, 'Punteggio finale: ' + this.score, {
            fontSize: '42px',
            fill: '#f0c419'
        }).setOrigin(0.5);
        
        // Livello raggiunto
        this.add.text(640, 400, 'Livello raggiunto: ' + this.level, {
            fontSize: '36px',
            fill: '#f0c419'
        }).setOrigin(0.5);
        
        // Pulsanti per le opzioni
        const buttonStyle = {
            fontSize: '32px',
            fill: '#f0c419',
            backgroundColor: '#1e1e1e',
            padding: { x: 30, y: 15 },
            borderRadius: 5
        };
        
        // Pulsante per riprovare lo stesso livello
        const retryButton = this.add.text(640, 500, 'Riprova Livello', buttonStyle).setOrigin(0.5).setInteractive();
        
        retryButton.on('pointerdown', () => {
            retryButton.setScale(0.9);
        });
        
        retryButton.on('pointerup', () => {
            retryButton.setScale(1);
            this.scene.start('Game', { level: this.level });
        });
        
        retryButton.on('pointerover', () => {
            retryButton.setStyle({ fill: '#ffffff' });
        });
        
        retryButton.on('pointerout', () => {
            retryButton.setStyle({ fill: '#f0c419' });
            retryButton.setScale(1);
        });
        
        // Pulsante per tornare al menu
        const menuButton = this.add.text(640, 580, 'Menu Principale', buttonStyle).setOrigin(0.5).setInteractive();
        
        menuButton.on('pointerdown', () => {
            menuButton.setScale(0.9);
        });
        
        menuButton.on('pointerup', () => {
            menuButton.setScale(1);
            this.scene.start('Menu');
        });
        
        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#ffffff' });
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#f0c419' });
            menuButton.setScale(1);
        });
    }
}