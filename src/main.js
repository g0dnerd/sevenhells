import BootScene from './scenes/BootScene.js'
import MainMenuScene from './scenes/MainMenuScene.js'
import GameScene from './scenes/GameScene.js'

const gameConfig = {
    type: Phaser.AUTO,
    width: 1280,  // adjust as needed
    height: 960, // adjust as needed
    backgroundColor: '#E3E3E3',
    scene: [BootScene, MainMenuScene, GameScene]
};

const game = new Phaser.Game(gameConfig);