import Stone from '../objects/Stone.js';
import Enemy from '../objects/Enemy.js';
import AStar from '../astar.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'GameScene' });
		this.mapgrid = [];
		// init game state variable - game starts in a placement phase
		this.stateWave = false;
	}

	create() {
		// add scene background
		this.add.image(640, 480, 'map');
		this.add.image(640, 480, 'grid');

		// Initialize an empty grid
		this.mapGrid = Array(40).fill(null).map(() => Array(30).fill(0)); 

		// Mouse event listener
		this.input.on('pointerdown', (pointer) => {
			this.mouseDown(pointer.x, pointer.y);
		});

		// Create an instance of the A* pathfinding algorithm
		this.astar = new AStar(this.mapGrid);
		this.startNode = this.astar.nodes[0][6];
		this.checkpointsList = [
			this.astar.nodes[10][6],
			this.astar.nodes[10][15],
			this.astar.nodes[20][15],
			this.astar.nodes[30][15],
			this.astar.nodes[30][6],
			this.astar.nodes[20][6],
			this.astar.nodes[20][24]
		];

		this.spawnEnemy('basic_human', 0, 6);
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

	centerGridCoords (x, y) {
		// returns the center of the grid square the user clicked in
		return [(x-x%32), (y-y%32)];
	}

	spawnEnemy (type, x, y) {
		let enemy = new Enemy(this, x*32, y*32);
		let path = this.astar.findPath(this.startNode, this.checkpointsList);
		enemy.anims.play('walk-right', true);
	}
}