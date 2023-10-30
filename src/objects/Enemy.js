export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
        super(scene, x, y, 'basic_human');

        scene.add.existing(this);
        // Set the origin to the center
        this.setOrigin(0, 0);
	}

	kill() {
		
	}
	
}