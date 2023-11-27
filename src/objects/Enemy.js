export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, checkpoints, id = 0, lifeCost = 1) {
        super(scene, x, y, Enemy.type[id]);

        this.scene = scene;

        scene.add.existing(this);

        // Set the origin to the center
        this.setOrigin(0, 0);

        this.checkpoints = checkpoints;
        this.finalX = this.checkpoints[this.checkpoints.length - 1].x
        this.finalY = this.checkpoints[this.checkpoints.length - 1].y

		// Set various flags and parameters
		this.progress = 0;
        this.isHandledForDeath = false;

        this.lifeCost = lifeCost;
        this.maxHealth = Enemy.calculateHealthByID(id);
		this.currentHealth = this.maxHealth;
        this.goldValue = Enemy.calculateGoldValueByID(id);

		// Health bar setup
		this.healthBar = scene.add.graphics();
		this.updateHealthBar();

        // Initialize the current node based on given pixel coordinates
        this.currentNode = { x: Math.floor(x / 32), y: Math.floor(y / 32) };
	}

	moveAlongPath(path, speed = 300, onCompleteCallback) {
	    // console.log('moveAlongPath called.');

	    // Ensure there is a path to follow
	    if (!path || path.length === 0) {
	        console.log('Path is empty or undefined. Exiting moveAlongPath.');
	        return;
	    }

	    // Extract the first node from the path to avoid altering the original path array
	    let nextNode = path[0];

	    let distance = Phaser.Math.Distance.Between(this.x, this.y, nextNode.x * this.scene.gridSize, nextNode.y * this.scene.gridSize);
	    let duration = (distance / speed) * 1000;

	    // Determine the direction
		let xDirection = nextNode.x*32 - this.x;
		let yDirection = nextNode.y*32 - this.y;

		// Normalize directions to get either -1, 0, or 1
		xDirection = Math.sign(xDirection);
		yDirection = Math.sign(yDirection);

		// Choose the correct animation based on the direction of movement
		if (xDirection < 0) {
		  this.anims.play('walk-left', true);
		} else if (xDirection > 0) {
		  this.anims.play('walk-right', true);
		} else if (yDirection < 0) {
		  this.anims.play('walk-up', true);
		} else if (yDirection > 0) {
		  this.anims.play('walk-down', true);
		}

	    // Convert grid coordinates to pixel coordinates for the tween
	    let pixelX = nextNode.x * 32;
	    let pixelY = nextNode.y * 32;

	    // Set up the tween animation
	    let tween = this.scene.tweens.add({
	        targets: this,
	        x: pixelX,
	        y: pixelY,
	        duration: speed,
	        ease: 'Linear',
	        onComplete: () => {
	        	// Check if the object still exists
	        	if (!this.scene) {
	        		return;
	        	}

				this.updateProgress();

	            if ((this.x/32 == this.finalX) && (this.y/32 == this.finalY)) {
	            	this.hasReachedTarget()
	            }
	            // Once the first move is done, remove the node from the path
	            if (path[0] === nextNode) { // Confirm that we've reached the correct node before shifting
	                path.shift(); // Remove the node we've just reached
	            }

	            this.currentNode = nextNode; // Update the enemy's current node

	            if (path.length === 0) {
	                // If there are no more nodes in the path, call onCompleteCallback
	                if (onCompleteCallback) {
	                	onCompleteCallback();
	                }
	            } else {
	                // If there are more nodes, continue moving along the path
	                this.moveAlongPath(path, speed, onCompleteCallback);
	            }
	        }
	    });
	}

	takeDamage(amount) {
		this.currentHealth -= amount;
		this.updateHealthBar();
	}

	updateProgress() {
		this.progress++;
	}

	hasReachedTarget() {
		// If the enemy has reached its target, deduct life,
		// remove it, mark it for death and destroy it
		this.scene.deductLife(this.lifeCost);
		this.scene.removeEnemy(this);
		this.markAsDead();
		super.destroy();
	}

	static get type() {
		// Returns the enemy type name by ID as an index
		return ['basic_human', 'consultant'];
	}

	static calculateHealthByID(id) {
		switch(id) {
			case 0:
				// Basic human
				return 100;
			case 1:
				// Consultant
				return 80;
		}
	}

	static calculateGoldValueByID(id) {
		switch (id) {
			case 0:
				// Basic human
				return 10;
			case 1:
				// Consultant
				return 20;
		}
	}

	markAsDead() {
		this.isHandledForDeath = true;
	}
	
	updateHealthBar() {
		this.healthBar.clear();

		// Position of the health bar
        const barWidth = 40;
        const barHeight = 5;
        const barX = this.x - barWidth / 2 + 24;
        const barY = this.y - 10; // Adjust to place it above the enemy's head

        // Draw the total health (green part)
        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(barX, barY, barWidth, barHeight);

        // Calculate the width of the missing health (red part)
        const missingHealthWidth = barWidth * (1 - this.currentHealth / this.maxHealth);

        // Draw the missing health (red part)
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(barX, barY, missingHealthWidth, barHeight);
	}

	destroy() {
		// Modify the destroy method to also destroy the health bar
		if (this.healthBar) {
			this.healthBar.clear();
			this.healthBar.destroy()
		}

		super.destroy();
	}
	
}