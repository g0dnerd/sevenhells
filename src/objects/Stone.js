export default class Stone extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
        super(scene, x, y, 'stone');

        scene.add.existing(this);
        // Set the origin to the center
        this.setOrigin(0, 0);
	}
	
}