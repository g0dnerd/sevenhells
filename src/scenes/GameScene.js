import Stone from '../objects/Stone.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'GameScene' });
	}

	create() {

		this.add.image(640, 480, 'map');
		this.add.image(640, 480, 'grid');

		// init game state variable - game starts in a placement phase
		let stateWave = false;
		let mapGrid = Array(30).fill(null).map(() => Array(40).fill(0)); 

		 //Mouse event listener
		this.input.on('pointerdown', (pointer) => {
			console.log(`pointer coords: ${pointer.x}, ${pointer.y}`);
			this.mouseDown(pointer.x, pointer.y);
		});

	}

	update() {

	}

	mouseDown (x, y) {
	    if (!this.stateWave) {
	        this.placeItem(x, y);
	    }
	}


	placeItem(x, y) {
		let cleanedCoords = this.centerGridCoords(x, y);
		let stone = new Stone(this, cleanedCoords[0], cleanedCoords[1]);


	}

	mapCoordsToGrid (y, x) {
		return [Math.max(29,y % 32), Math.max(39,x % 32)];
	}

	centerGridCoords (x, y) {
		return [(x-x%32), (y-y%32)];
	}
}