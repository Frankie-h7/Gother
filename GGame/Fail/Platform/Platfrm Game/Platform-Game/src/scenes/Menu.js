export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        // Caricamento degli assets per il menu
        this.load.image('menuBg', '/api/placeholder/1280/720');
        this.load.audio('menuMusic', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/theme.wav');
    }

    create() {
        // Sfondo e musica
        this.add.rectangle(640, 360, 1280, 720, 0x040218);
        const menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
        menuMusic.play();

        // Titolo del gioco
        this.add.text(640, 160, 'DARK OCRA PLATFORMER', {
            fontSize: '64px',
            fontStyle: 'bold',
            fill: '#f0c419',
        }).setOrigin(0.5);
        
        this.add.text(640, 250, 'Un platform game in stile Super Mario', {
            fontSize: '28px',
            fill: '#f0c419',
        }).setOrigin(0.5);

        // Pulsanti dei livelli
        for (let i = 1; i <= 3; i++) {
            const button = this.add.text(640, 320 + i * 80, 'Livello ' + i, {
                fontSize: '36px',
                fill: '#f0c419',
                backgroundColor: '#1e1e1e',
                padding: { x: 30, y: 15 },
                borderRadius: 5
            }).setOrigin(0.5).setInteractive();
            
            // Effetto popup quando premuto
            button.on('pointerdown', () => {
                button.setScale(0.9);
                this.sound.play('menuClick');
            });
            
            button.on('pointerup', () => {
                button.setScale(1);
                
                // Avvio del livello selezionato
                this.sound.stopAll();
                this.scene.start('Game', { level: i });
            });
            
            // Effetti di hover
            button.on('pointerover', () => {
                button.setStyle({ fill: '#ffffff' });
            });
            
            button.on('pointerout', () => {
                button.setStyle({ fill: '#f0c419' });
                button.setScale(1);
            });
        }

        // Istruzioni
        this.add.text(640, 650, 'Controlli: Frecce o WASD per muoversi\nW o ↑ per saltare, S o ↓ per entrare nei tubi', {
            fontSize: '24px',
            fill: '#f0c419',
            align: 'center'
        }).setOrigin(0.5);

        // Suono per i pulsanti
        this.load.audio('menuClick', 'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/assets/audio/SoundEffects/key.wav');
        this.load.once('complete', () => {
            this.sound.add('menuClick');
        });
        this.load.start();
    }
}