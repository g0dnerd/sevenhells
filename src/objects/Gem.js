import Projectile from './Projectile.js';
import Stone from './Stone.js';

export default class Gem extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, rarity, colorIndex) {
		// Calculate spritesheet frame
		const frame = rarity * 7 + colorIndex;

		super(scene, x, y, 'gems', frame);

		this.scene = scene;
		this.rarity = rarity;
		this.colorIndex = colorIndex;
		this.color = Gem.colors[this.colorIndex];

		this.target = null;

		this.nextShotTime = -1;
		this.shotsFired = 0;

		this.projectiles = [];

		this.range = Gem.calculateRange(rarity, colorIndex);
		this.damage = Gem.calculateRange(rarity, colorIndex);
		this.attackSpeed = Gem.calculateAttackSpeed(rarity, colorIndex);

		scene.add.existing(this);

		// Set the origin to the center
		this.setOrigin(0, 0);

		// Use phaser's interactive functionality to make things clickable
		this.setInteractive();
		this.on('pointerdown', function (pointer) {
			scene.handleGemClick(this);
		});
	}

	turnToStone() {
		const stone = new Stone(this.scene, this.x, this.y);
		this.scene.stones.push(stone);
		this.destroy();
	}

	shoot() {
		if (!this.target || this.target.isHandledForDeath) {
			this.target = null;
			return;
		}

		const projectile = new Projectile(
			this.scene, this.x + 16, this.y + 16, this.target, this.damage);
		this.projectiles.push(projectile);
		this.scene.projectileSprites.add(projectile);
		this.scene.projectiles.push(projectile);
	}

	clearTarget() {
		this.target = null;
	}

	clearProjectiles() {
		this.projectiles.forEach(projectile => {
			projectile.destroy();
		})
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
				return 1000-50*(rarity+1);
			case 1:
				// Yellow gem
				return 800-50*(rarity+1);
			case 2:
				// Green gem
				return 1000-50*(rarity+1);
			case 3:
				// Blue gem
				return 1000-50*(rarity+1);
			case 4:
				// Pink gem
				return 900-50*(rarity+1);
			case 5:
				// Cyan gem
				return 900-50*(rarity+1);
			case 6:
				// Red gem
				return 1000-50*(rarity+1);
		}
	}

	destroy() {
		this.scene.removeGem(this);
		this.clearTarget();
		this.clearProjectiles();
		super.destroy();
	}
}