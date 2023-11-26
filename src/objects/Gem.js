import Projectile from './Projectile.js';

export default class Gem extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, rarity, colorIndex) {
		// Calculate spritesheet frame
		const frame = rarity * 7 + colorIndex;

		super(scene, x, y, 'gems', frame);

		this.scene = scene;
		this.rarity = rarity;
		this.color = Gem.colors[colorIndex];

		this.nextShotTime = -1;

		this.range = Gem.calculateRange(rarity, colorIndex);
		this.damage = Gem.calculateRange(rarity, colorIndex);
		this.attackSpeed = Gem.calculateRange(rarity, colorIndex);

		scene.add.existing(this);

		// Set the origin to the center
		this.setOrigin(0, 0);
	}

	shoot (target) {
		const projectile = new Projectile(this.scene, this.x, this.y, target);
	}

	stopShooting() {
		console.log("Stopped shooting.");
	}

	static get colors() {
		return ['white', 'yellow', 'green', 'blue', 'pink', 'cyan', 'red'];
	}

	static calculateDamage(rarity, colorIndex) {
		switch(colorIndex) {
			case 0:
				// White gem
				return 10+5*(rarity+1);
			case 1:
				// Yellow gem
				return 5+5*(rarity+1);
			case 2:
				// Green gem
				return 8+5*(rarity+1);
			case 3:
				// Blue gem
				return 8+5*(rarity+1);
			case 4:
				// Pink gem
				return 12+5*(rarity+1);
			case 5:
				// Cyan gem
				return 3+5*(rarity+1);
			case 6:
				// Red gem
				return 10+5*(rarity+1);
		}
	}

	static calculateRange(rarity, colorIndex) {
		switch(colorIndex) {
			case 0:
				// White gem
				return 100+10*(rarity+1);
			case 1:
				// Yellow gem
				return 60+10*(rarity+1);
			case 2:
				// Green gem
				return 100+10*(rarity+1);
			case 3:
				// Blue gem
				return 100+10*(rarity+1);
			case 4:
				// Pink gem
				return 150+10*(rarity+1);
			case 5:
				// Cyan gem
				return 100+10*(rarity+1);
			case 6:
				// Red gem
				return 80+10*(rarity+1);
		}
	}

	static calculateAttackSpeed(rarity, colorIndex) {
		// Returns attack speed in form of a ms delay between attacks
		switch(colorIndex) {
			case 0:
				// White gem
				return 300+10*(rarity+1);
			case 1:
				// Yellow gem
				return 200+10*(rarity+1);
			case 2:
				// Green gem
				return 300+10*(rarity+1);
			case 3:
				// Blue gem
				return 300+10*(rarity+1);
			case 4:
				// Pink gem
				return 250+10*(rarity+1);
			case 5:
				// Cyan gem
				return 250+10*(rarity+1);
			case 6:
				// Red gem
				return 300+10*(rarity+1);
		}
	}
}