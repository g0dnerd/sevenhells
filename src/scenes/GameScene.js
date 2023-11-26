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

		this.currentLevel = 1;

		// Initialize an empty grid
		this.gridSize = 32;
		this.mapGrid = Array(40).fill(0).map(() => Array(30).fill(0)); 

		// Create a 'start level' button
		this.startButton = this.add.text(1300, 20, 'Start Level', 
			{font: '16px Arial', fill: '#000000'});
		this.startButton.setInteractive();
		this.startButton.on('pointerdown', () => {
			this.startLevel(this.currentLevel);
		});

		// Initialize game object arrays
		this.gems = [];
		this.enemies = [];
		this.projectiles = [];
 
		// Mouse event listener
		this.input.on('pointerdown', (pointer) => {
			this.mouseDown(pointer.x, pointer.y);
		});

		this.gemTiers = ['Primitive', 'Fiery', 'Infernal', 'Hellforged', 'Demonic', 'Abyssal', 'Diabolical'];

		// Initialize gem chances
		this.gemChances = [0.8, 0.15, 0.05, 0, 0, 0, 0];
		// Show gem chances in the UI panel
		this.add.text(1300, 50, 'Gem Chances:',
			{ font: '18px Arial', fill: '#000000'});
		this.gemChances.forEach((chance, index) => {
			this.add.text(1300, 75 + (index * 20),
				`${this.gemTiers[index]}: ${chance*100}%`, 
				{ font: '16px Arial', fill: '#000000' });
		});


		this.levelsData = this.cache.json.get('levels');
		this.placementsPerPhase = 0;
		this.remainingPlacements = 0;
		this.lives = 0;
		this.gold = 0;

		// Initialize lives
		this.hpText = this.add.text(1300, 250, 'Lives: 0',
			{ font: '18px Arial', fill: '#000000' });

		// Initialize embers
		this.goldText = this.add.text(1300, 300, 'Embers: 0',
			{ font: '18px Arial', fill: '#000000' });

		this.setupLevel(this.currentLevel);


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
	}

	setupLevel(levelIndex) {

		let levelData = this.levelsData.find(level => level.levelNumber === levelIndex);

		if (levelData) {
			// Mark visual checkpoints as blocked squares in the map grid
			// so that player can't place on checkpoints
			levelData.checkpoints_visual.forEach(checkpoint => {
				this.mapGrid[checkpoint.x][checkpoint.y] = 'c';
			});
		}

		// Update the amount of allowed gem placements
		this.placementsPerPhase = levelData.placements_per_phase;
		this.remainingPlacements = this.placementsPerPhase;

		// Update amount of lives
		this.lives = levelData.lives;
		this.hpText.setText(`Lives: ${this.lives}`);

		// Enable placement phase once done

		this.isPlacementPhase = true;
	}

	startLevel(levelIndex) {
		this.isPlacementPhase = false;

		let levelData = this.levelsData.find(level => level.levelNumber === levelIndex);
		if (levelData) {
			// this.loadMap(levelData.map);
			this.spawnEnemies(levelData.enemies);
		}

	}

	update() {
		if (!this.isPlacementPhase) {
			// Game logic
			const currentTime = this.time.now;

			this.gems.forEach(gem => {
				if (gem.nextShotTime <= currentTime) {
					const enemiesInRange = this.getEnemiesInTurretRange(gem);

					if (enemiesInRange.length > 0) {
						const targetEnemy = enemiesInRange[0];
						gem.shoot(targetEnemy);

						gem.nextShotTime = currentTime + gem.attackSpeed;
						// console.log(`Next shot to be fired at ${gem.nextShotTime}`);
					} else {
						gem.stopShooting();
					}
				}
			});

			this.checkProjectileHits();
		}

	}

	mouseDown (x, y) {
	    if (this.isPlacementPhase) {
	        this.placeRandomGem(x, y);
	    }
	}

	placeRandomGem (x, y) {
		if (!this.isPlacementPhase) {
			return;
		}
		let cleanedCoords = this.centerGridCoords(x, y);
		console.log(`trying to place at ${cleanedCoords[0]/32},${cleanedCoords[1]/32}`);
		// if the clicked tile is empty

		if (this.remainingPlacements > 0) {
			if (this.mapGrid[cleanedCoords[0]/32][cleanedCoords[1]/32] == 0) {
				// Randomize rarity based on current chances
				let rarity = this.getRandomRarity(this.gemChances);

				// Randomize gem color indepently of rarity
				let colorIndex = Math.floor(Math.random() * 7);

				// Create a new gem
				let gem = new Gem(this, cleanedCoords[0], cleanedCoords[1], rarity, colorIndex);
				console.log(`Placed ${this.gemTiers[gem.rarity].toLowerCase()} ${gem.color} gem with range ${gem.range}, dmg ${gem.damage} and AS delay ${gem.attackSpeed}`);
				this.gems.push(gem);

				// Mark the grid node as occupied
				this.mapGrid[cleanedCoords[0]/32][cleanedCoords[1]/32] = "1";
				this.astar.nodes[cleanedCoords[0]/32][cleanedCoords[1]/32].wall = true;

				// Update remaining placements
				this.remainingPlacements--;			}
			else {
				if (this.mapGrid[cleanedCoords[0]/32][cleanedCoords[1]/32] == 'c') {
					console.log("tile is a checkpoint.");
				}
				else {
					console.log("tile already full");	
				}
			}
		}
		else {
			console.log("maximum placements reached");
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
		// console.log('Current checkpoints list:', checkpoints.map(cp => `(${cp.x},${cp.y})`).join(', '));
		// check if there are no checkpoints left to process
		if (checkpoints.length === 0) {
			console.log('All checkpoints reached.');
			enemy.anims.stop();
			return;
		}

		// Get the next checkpoint to move to
		const nextCheckpoint = checkpoints[0];
		// console.log('Moving to next checkpoint:', nextCheckpoint);
		// console.log(`Enemy current node: x:${enemy.currentNode.x}, y:${enemy.currentNode.y}`);

		// Find the path to the next checkpoint
		const path = astar.findPath(enemy.currentNode, nextCheckpoint);
		// console.log('Generated path to next checkpoint:', path.map(node => `(${node.x},${node.y})`).join(', '));

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
			// console.log(`No more enemies to spawn.`);
			return;
		}

		// Get the current enemy's data
		const enemyData = enemies[currentIndex];

		// console.log(`spawnEnemies called, ${enemyData.amount} to spawn.`);

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
		// console.log(`Spawning enemy of type ${type} at (${x},${y})`);
		let enemy = new Enemy(this, x*32, y*32, this.checkpointsList);
		this.enemies.push(enemy);

		let checkpoints = this.checkpointsList.slice();

		this.sendOnPath(enemy, this.astar, checkpoints);
	}

	deductLife (amount) {
		this.lives = this.lives - amount;
		this.hpText.setText(`Lives: ${this.lives}`);
	}

	getEnemiesInTurretRange(turret) {
		return this.enemies.filter((enemy) => 
			Phaser.Math.Distance.Between(turret.x, turret.y, enemy.x, enemy.y) <= turret.range);
	}

	checkProjectileHits() {
	    this.projectiles.forEach(projectile => {
	        this.enemies.forEach(enemy => {
	            if (Phaser.Geom.Intersects.RectangleToRectangle(projectile.getBounds(), enemy.getBounds())) {
	                enemy.health -= projectile.damage;
	                projectile.destroy(); // Destroy the projectile after it hits

	                // Check if the enemy is dead
	                if (enemy.health <= 0) {
	                    this.handleEnemyDeath(enemy);
	                }
	            }
	        });
	    });
	}

	handleEnemyDeath(enemy) {
		this.gold += enemy.goldValue;
		this.goldText.setText(`Embers: ${this.gold}`);
		enemy.destroy();
	}
}
