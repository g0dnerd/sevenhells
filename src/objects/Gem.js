export default class Gem extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, rarity, colorIndex) {
		// Calculate spritesheet frame
		const frame = rarity * 7 + colorIndex;

		super(scene, x, y, 'gems', frame);

		this.scene = scene;
		this.rarity = rarity;
		this.color = Gem.colors[colorIndex];

		scene.add.existing(this);

		// Set the origin to the center
		this.setOrigin(0, 0);
	}

	static get colors() {
		return ['white', 'yellow', 'green', 'blue', 'pink', 'cyan', 'red'];
	}
}