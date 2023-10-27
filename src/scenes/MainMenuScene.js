class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        let startButton = this.add.text(400, 300, 'Start Game', {
            fontSize: '32px', fill: '#fff' });

        // On button click (or touch), start the GameScene
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
