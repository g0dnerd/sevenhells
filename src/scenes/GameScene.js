class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'GameScene' });
	}

	create() {
		this.add.image(480, 360, 'map');
		this.add.image(480, 360, 'grid')

	}
}