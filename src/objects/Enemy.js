export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
        super(scene, x, y, 'basic_human');

        this.scene = scene;

        scene.add.existing(this);
        // Set the origin to the center
        this.setOrigin(0, 0);
	}

	moveAlongPath(path, speed = 300) {
	    if (!path || path.length === 0) return;

	    // Extract the first node from the path
	    let node = path.shift();
	    console.log(`Trying to move to ${node.x},${node.y}`);

	    const distance = Phaser.Math.Distance.Between(this.x, this.y, node.x, node.y);
	    const duration = (distance / speed) * 1000;

	    // Create the tween
	    let tween = this.scene.tweens.add({
	        targets: this,
	        x: node.x*32,
	        y: node.y*32,
	        duration: duration,
	        ease: 'Linear',
	        onComplete: () => {
	            // Once this tween is complete, move to the next node in the path
	            this.moveAlongPath(path, speed);
	        }
	    });
	}


	kill() {
		
	}
	
}