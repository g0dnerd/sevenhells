const gameConfig = {
    type: Phaser.AUTO,
    width: 960,  // adjust as needed
    height: 720, // adjust as needed
    scene: [BootScene, MainMenuScene, GameScene]
};

const game = new Phaser.Game(gameConfig);