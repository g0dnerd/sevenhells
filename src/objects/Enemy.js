export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
        super(scene, x, y, 'basic_human');

        this.scene = scene;

        scene.add.existing(this);
        // Set the origin to the center
        this.setOrigin(0, 0);
	}

	moveAlongPath(path, speed = 300) {
	    console.log('moveAlongPath called.');

	    if (!path || path.length === 0) {
	        console.log('Path is empty or undefined. Exiting moveAlongPath.');
	        return;
	    }

	    // Extract the first node from the path
	    let node = path.shift();

	    console.log(`Moving to node (${node.x}, ${node.y})`);

	    const distance = Phaser.Math.Distance.Between(this.x, this.y, node.x, node.y);
	    const duration = 1000;

	    console.log(`Distance to node: ${distance}`);
	    console.log(`Duration for tween: ${duration} ms`);

	    // Create the tween
	    let tween = this.scene.tweens.add({
	        targets: this,
	        x: node.x * 32,
	        y: node.y * 32,
	        duration: duration,
	        ease: 'Linear',
	        onStart: () => {
	            console.log('Tween started.');
	        },
	        onUpdate: () => {
	            console.log('Tween updated.');
	            console.log(`Current position: (${this.x}, ${this.y})`);
	        },
	        onComplete: () => {
	            console.log('Tween completed.');

	            // Once this tween is complete, move to the next node in the path
	            this.moveAlongPath(path, speed);
	        }
	    });
	}




	kill() {
		
	}
	
}