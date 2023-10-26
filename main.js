import Phaser from 'phaser';

import BootScene from './src/scenes/BootScene';
import MainScene from './src/scenes/MainScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [BootScene, MainScene]
};

const game = new Phaser.Game(config);