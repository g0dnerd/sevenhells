export default class Projectile extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, target, damage) {
		super(scene, x, y, 'projectile');

		this.scene = scene;
		this.target = target;
		this.damage = damage;

		// Add the projectile to the parent scene
		scene.add.existing(this);

		// Set the origin to the center
		this.setOrigin(0, 0);

		// Add physics to the projectile
		this.scene.physics.world.enable(this);
		this.body.setCollideWorldBounds(true);

		this.speed = 300;
		this.isDestroyed = false;

		this.initMovement();
	}	

	initMovement() {
		// Calculate the angle towards the target
		const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
		this.body.setVelocity(
			Math.cos(angle) * this.speed,
			Math.sin(angle) * this.speed
		);
	}

	update() {
		// Check if the projectile has reached its target or needs to update its trajectory
		if (this.target.isHandledForDeath) {
			this.isDestroyed = true;
			this.destroy();
			return;
		}

		// Update the trajectory as the target moves
		const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.body.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
	}

	destroy() {
		console.log("Destroying projectile.");
		this.isDestroyed = true;
		super.destroy();
	}

}