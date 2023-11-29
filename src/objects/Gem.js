import Projectile from './Projectile.js';
import Stone from './Stone.js';
import GemData from '../data/GemData.js';

export default class Gem extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, rarity, colorIndex) {
		// Calculate spritesheet frame
		const frame = rarity * 7 + colorIndex;

		super(scene, x, y, 'gems', frame);

		this.scene = scene;
		this.rarity = rarity;
		this.colorIndex = colorIndex;
		this.color = GemData.colors[this.colorIndex];

		this.target = null;

		this.nextShotTime = -1;
		this.shotsFired = 0;

		this.projectiles = [];

		this.range = GemData.calculateRange(rarity, colorIndex);
		this.damage = GemData.calculateRange(rarity, colorIndex);
		this.attackSpeed = GemData.calculateAttackSpeed(rarity, colorIndex);

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

	destroy() {
		this.scene.removeGem(this);
		this.clearTarget();
		this.clearProjectiles();
		super.destroy();
	}
}