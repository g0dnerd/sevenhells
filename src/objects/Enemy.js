export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, type = 'basic_human') {
        super(scene, x, y, type);

        this.scene = scene;

        scene.add.existing(this);
        // Set the origin to the center
        this.setOrigin(0, 0);

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

	    let testDistance = Phaser.Math.Distance.Between(320, 192, 320, 480);

	    /* console.log(`Test distance is ${testDistance}`);
	    console.log(`Enemy coords are ${this.x}, ${this.y}`);
	    console.log(`Target node coords are ${nextNode.x}, ${nextNode.y}`);
	    console.log(`Scene grid size is ${this.scene.gridSize}`);*/

	    let distance = Phaser.Math.Distance.Between(this.x, this.y, nextNode.x * this.scene.gridSize, nextNode.y * this.scene.gridSize);
	    let duration = (distance / speed) * 1000;

	    /* console.log(`Distance is ${distance}`);
	    console.log(`Duration is ${duration}`); */

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
	            console.log(`Reached node (${nextNode.x}, ${nextNode.y})`);
	            // Once the first move is done, remove the node from the path
	            if (path[0] === nextNode) { // Confirm that we've reached the correct node before shifting
	                path.shift(); // Remove the node we've just reached
	            }

	            this.currentNode = nextNode; // Update the enemy's current node

	            if (path.length === 0) {
	                // If there are no more nodes in the path, call onCompleteCallback
	                if (onCompleteCallback) {
	                	console.log("Calling back");
	                	onCompleteCallback();
	                }
	            } else {
	                // If there are more nodes, continue moving along the path
	                this.moveAlongPath(path, speed, onCompleteCallback);
	            }
	        }
	    });
	}

	kill() {
		
	}
	
}