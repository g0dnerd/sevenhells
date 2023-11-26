export default class Projectile extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, target, damage) {
		super(scene, x, y, 'projectile');

		this.scene = scene;
		this.damage = damage;
		scene.add.existing(this);

		// Set the origin to the center
		this.setOrigin(0, 0);

		// Set up the tween animation to move the projectile to the target
		this.scene.tweens.add({
			targets: this,
			x: target.x,
			y: target.y,
			duration: 500,
			onComplete: () => {
				// Code to execute when the projectile reaches the target
				this.destroy();
			},
		});
	}	

}