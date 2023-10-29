export default class Stone {
	constructor(scene, x, y) {
		this.scene = scene;
		this.x = x;
		this.y = y;
        this.sprite = this.scene.add.sprite(x, y, 'stone')
        // Set the origin to the center
        this.sprite.setOrigin(0, 0);
	}
	
}