import Stone from '../objects/Stone.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'GameScene' });
		this.mapgrid = [];
		this.stateWave = false;
	}

	create() {
		// add scene background
		this.add.image(640, 480, 'map');
		this.add.image(640, 480, 'grid');

		// init game state variable - game starts in a placement phase
		this.mapGrid = Array(30).fill(null).map(() => Array(40).fill(0)); 

		// Mouse event listener
		this.input.on('pointerdown', (pointer) => {
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


	placeItem (x, y) {
		let cleanedCoords = this.centerGridCoords(x, y);
		console.log(`trying to place at ${cleanedCoords[0]/32},${cleanedCoords[1]/32}`);
		// if the clicked tile is empty
		if (this.mapGrid[cleanedCoords[0]/32][cleanedCoords[1]/32] == 0) {
			let stone = new Stone(this, cleanedCoords[0], cleanedCoords[1]);
			this.mapGrid[cleanedCoords[0]/32][cleanedCoords[1]/32] = "1";
		}
		else {
			console.log("tile already full");
		}
	}

	/* mapCoordsToGrid (y, x) {
		// converts map coordinates to indices on the 32x32px grid
		console.log(`Returning max of ${y}, ${x}`);
		return [Math.max(29,y % 32), Math.max(39,x % 32)];
	} */

	centerGridCoords (x, y) {
		// returns the center of the grid square the user clicked in
		return [(x-x%32), (y-y%32)];
	}
}