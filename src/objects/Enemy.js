export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
        super(scene, x, y, 'basic_human');

        scene.add.existing(this);
        this.setOrigin(0, 0);

        // this.anims.play('walk-right', true);
	}

	kill() {
		
	}

	
}