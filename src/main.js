import BootScene from './scenes/BootScene.js'
import MainMenuScene from './scenes/MainMenuScene.js'
import GameScene from './scenes/GameScene.js'

const gameConfig = {
    type: Phaser.AUTO,
    width: 1480,  // adjust as needed
    height: 960, // adjust as needed
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    backgroundColor: '#E3E3E3',
    scene: [BootScene, MainMenuScene, GameScene]
};

const game = new Phaser.Game(gameConfig);