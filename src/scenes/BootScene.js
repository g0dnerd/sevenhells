export default class BootScene extends Phaser.Scene {
	constructor() {
		super({key: 'BootScene' });
	}

	preload() {
	    // Display a loading text
	    let loadingText = this.add.text(400, 300, 'Loading...', {
	    	fontSize: '32px', fill: '#fff'});

		// Import image assets
	    this.load.image('map', 'assets/images/map.png');
	    this.load.image('grid', 'assets/images/grid.png');
	    this.load.image('stone', 'assets/images/stone.png');
	    this.load.spritesheet('basic_human', 'assets/images/spritesheet_enemy_basic.png',
	        { frameWidth: 32, frameHeight: 32 });
	    this.load.spritesheet('gems', 'assets/images/spritesheet_gems',
	        { frameWidth: 32, frameHeight: 32 });


	}

	create () {
		// Once assets are loaded, transition to the next scene:
		this.scene.start('MainMenuScene');
	}
}