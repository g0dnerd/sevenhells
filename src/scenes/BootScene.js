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
	    this.load.image('projectile', 'assets/images/projectile.png');
	    this.load.spritesheet('basic_human', 'assets/images/spritesheet_enemy_basic.png',
	        { frameWidth: 32, frameHeight: 32 });
	    this.load.spritesheet('gems', 'assets/images/spritesheet_gems.png',
	        { frameWidth: 32, frameHeight: 32 });
	    
	    // Load the levels.json file
	    this.load.json('levels', 'src/levels.json');
	}

	create () {
		// Load animations
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('basic_human', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('basic_human', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('basic_human', { start: 16, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('basic_human', { start: 24, end: 27 }),
            frameRate: 10,
            repeat: -1
        });

		// Once assets and animations are loaded, transition to the next scene:
		this.scene.start('MainMenuScene');
	}
}