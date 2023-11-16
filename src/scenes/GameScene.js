import Stone from '../objects/Stone.js';
import Gem from '../objects/Gem.js';
import Enemy from '../objects/Enemy.js';
import AStar from '../astar.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'GameScene' });
		this.mapgrid = [];

		// init game state variable - game starts in a placement phase
		this.isPlacementPhase = true;
	}

	create() {
		// add scene background
		this.add.image(640, 480, 'map');
		this.add.image(640, 480, 'grid');

		// Initialize an empty grid
		this.gridSize = 32;
		this.mapGrid = Array(40).fill(null).map(() => Array(30).fill(0)); 

		// Mouse event listener
		this.input.on('pointerdown', (pointer) => {
			this.mouseDown(pointer.x, pointer.y);
		});

		this.currentLevel = 1;

		// Initialize gem chances
		this.gemChances = [1, 0, 0, 0, 0, 0, 0];

		// Create an instance of the A* pathfinding algorithm and add the spawn point and checkpoints
		this.astar = new AStar(this.mapGrid);
		this.startNode = this.astar.nodes[0][6];
		this.checkpointsList = [
			this.astar.nodes[10][6],
			this.astar.nodes[10][15],
			this.astar.nodes[20][15],
			this.astar.nodes[30][15],
			this.astar.nodes[30][6],
			this.astar.nodes[20][6],
			this.astar.nodes[20][22],
			this.astar.nodes[39][22]
		];

		this.levelsData = this.cache.json.get('levels');

		this.setupLevel(this.currentLevel);
	}

	setupLevel(levelIndex) {
		// Load level data
		// Clear old data if necessary
		// Display stone placement UI
		let levelData = this.levelsData.find(level => level.levelNumber === levelIndex);
		if (levelData) {
			// this.loadMap(levelData.map);
			this.spawnEnemies(levelData.enemies);
		}

		this.isPlacementPhase = true;
	}

	update() {
		if (!this.isPlacementPhase) {
			// Game logic
		}

	}

	mouseDown (x, y) {
	    if (this.isPlacementPhase) {
	        this.placeRandomGem(x, y);
	    }
	}

	placeRandomGem (x, y) {
		let cleanedCoords = this.centerGridCoords(x, y);
		console.log(`trying to place at ${cleanedCoords[0]/32},${cleanedCoords[1]/32}`);
		// if the clicked tile is empty

		if (this.mapGrid[cleanedCoords[0]/32][cleanedCoords[1]/32] == 0) {
			// Randomize rarity based on current chances
			let rarity = this.getRandomRarity(this.gemChances);

			// Randomize gem color indepently of rarity
			let colorIndex = Math.floor(Math.random() * 7);

			// Create a new gem
			let gem = new Gem(this, cleanedCoords[0], cleanedCoords[1], rarity, colorIndex);

			// Mark the grid node as occupied
			this.mapGrid[cleanedCoords[0]/32][cleanedCoords[1]/32] = "1";
		}
		else {
			console.log("tile already full");
		}
	}

	getRandomRarity(chances) {
		let sum = 0;
		let r = Math.random();

		for (let i = 0; i < chances.length; i++) {
			sum += chances[i];
			if (r <= sum) {
				return i; // Return the index as the rarity level
			}
		}

		return chances.length - 1;

	}

	centerGridCoords (x, y) {
		// returns the center of the grid square the user clicked in
		return [(x-x%32), (y-y%32)];
	}

	onStartLevelClicked() {
		this.isPlacementPhase = false;
	}

	onLevelComplete() {
		this.currentLevel++;
		this.setupLevel(this.currentLevel);
	}

	sendOnPath (enemy, astar, checkpoints) {
		console.log('Current checkpoints list:', checkpoints.map(cp => `(${cp.x},${cp.y})`).join(', '));
		// check if there are no checkpoints left to process
		if (checkpoints.length === 0) {
			console.log('All checkpoints reached.');
			enemy.anims.stop();
			return;
		}

		// Get the next checkpoint to move to
		const nextCheckpoint = checkpoints[0];
		console.log('Moving to next checkpoint:', nextCheckpoint);
		console.log(`Enemy current node: x:${enemy.currentNode.x}, y:${enemy.currentNode.y}`);

		// Find the path to the next checkpoint
		const path = astar.findPath(enemy.currentNode, nextCheckpoint);
		console.log('Generated path to next checkpoint:', path.map(node => `(${node.x},${node.y})`).join(', '));

		// If a path is found, move the enemy along it 
		if (path && path.length > 0) {
			
			enemy.moveAlongPath(path, 300, () => {
				// After reaching the next checkpoint, remove it from the list
				// and continue
				checkpoints.shift();
				this.sendOnPath(enemy, astar, checkpoints);
			});
		} else {
			console.log("No path found to the next checkpoint");

		}
	}

	spawnEnemies (enemies, currentIndex = 0, enemyCount = 0) {
		if (currentIndex >= enemies.length) {
			// Stop if there are no more enemies to spawn
			console.log(`No more enemies to spawn.`);
			return;
		}

		// Get the current enemy's data
		const enemyData = enemies[currentIndex];

		console.log(`spawnEnemies called, ${enemyData.amount} to spawn.`);

	    if (enemyCount < enemyData.amount) {
	        // Spawn one enemy and increase the count
	        this.spawnEnemy(enemyData.type, 0, 6);
	        enemyCount++;
	    } else {
	        // Move to the next enemy type and reset the count
	        currentIndex++;
	        enemyCount = 0;
	    }

	    // Wait for 500 ms before spawning the next enemy
	    setTimeout(() => {
	        this.spawnEnemies(enemies, currentIndex, enemyCount);
	    }, 500);

	}

	spawnEnemy (type, x, y) {
		console.log(`Spawning enemy of type ${type} at (${x},${y})`);
		let enemy = new Enemy(this, x*32, y*32);

		let checkpoints = this.checkpointsList.slice();

		this.sendOnPath(enemy, this.astar, checkpoints);
	}
}