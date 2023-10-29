export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        let startButton = this.add.text(640, 480, 'Start Game', {
            fontSize: '32px', fill: '#000' });

        startButton.setOrigin(0.5, 0.5);

        // On button click (or touch), start the GameScene
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
