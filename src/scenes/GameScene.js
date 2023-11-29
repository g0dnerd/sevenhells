import GameUI from '../GameUI.js';
import Projectile from '../objects/Projectile.js';
import Gem from '../objects/Gem.js';
import Enemy from '../objects/Enemy.js';
import AStar from '../astar.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'GameScene' });
		this.mapgrid = [];
		this.gemPreview = null;

		// init game state variable - game does not start in a placement phase
		this.isPlacementPhase = false;
	}

	create() {
		this.gameUI = new GameUI(this);

		// add scene background
		this.add.image(640, 480, 'map');
		// this.add.image(640, 480, 'grid');

		this.currentLevel = 1;

		// Initialize an empty grid
		this.GRID_SIZE = 32;
		this.mapGrid = Array(40).fill(0).map(() => Array(30).fill(0)); 

		this.projectileSprites = this.physics.add.group({
			classType: Projectile,
			runChildUpdate: true
		});
 
		// Mouse event listener
		this.input.on('pointerdown', (pointer) => {
			this.mouseDown(pointer.x, pointer.y);
		});

		// Store gem tier names as a lookup array
		this.gemTiers = 
		['Primitive', 'Fiery', 'Infernal', 'Hellforged', 'Demonic', 'Abyssal', 'Diabolical'];

		// Initialize gem chances
		this.gemChances = [0.8, 0.15, 0.05, 0, 0, 0, 0];

		// Create a graphics object for drawing the range indicator
		this.rangeIndicator = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });

		this.levelsData = this.cache.json.get('levels');
		this.mapsData = this.cache.json.get('maps');

		this.gemPreview = this.add.sprite(0, 0, 'gem_hover').setVisible(false);
		this.gemPreview.setOrigin(0, 0);

		// Initialize game object arrays
		this.gems = [];
		this.enemies = [];
		this.projectiles = [];
		this.stones = [];
		this.currentPhaseGems = [];

		this.selectedGem = null;

		this.placementsPerPhase = 0;
		this.remainingPlacements = 0;
		this.lives = 0;
		this.gold = 0;

		this.gameUI.setup();
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

	startPlacementPhase() {
		this.isPlacementPhase = true;
        this.input.on('pointermove', this.updateGemPreview, this);
	}

	setupLevel(levelIndex) {

		let levelData = this.levelsData.find(level => level.levelNumber === levelIndex);
		let mapIndex = levelData.map;
		let mapData = this.mapsData.find(map => map.mapName === mapIndex);

		if (levelData && mapData) {
			// Mark visual checkpoints as blocked squares in the map grid
			// so that player can't place on checkpoints
			mapData.checkpoints_visual.forEach(checkpoint => {
				this.mapGrid[checkpoint.x][checkpoint.y] = 'c';
			});
		}

		// Update the amount of allowed gem placements
		this.placementsPerPhase = levelData.placements_per_phase;
		this.remainingPlacements = this.placementsPerPhase;

		// Update amount of lives
		this.lives = levelData.lives;
		this.gameUI.updateHpText(this.lives);
	}

	startLevel(levelIndex) {
		// Once a wave starts, disable placement phase
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

			// Note current time to check attack speed cooldowns against
			const currentTime = this.time.now;

			// Assign each gem a target if one is available
			this.gems.forEach(gem => {
				const targetEnemy = this.findNextTarget(gem);
				if (targetEnemy) {
					gem.target = targetEnemy;
					// If the gems attack is off cooldown, shoot the target
					if (gem.nextShotTime <= currentTime) {
						gem.shoot(targetEnemy);
						gem.nextShotTime = currentTime + gem.attackSpeed;
					}
				} else {
					gem.clearTarget();
				}
	
			});

			// Check for projectile collisions with enemies
			this.projectiles.forEach(projectile => {
				this.enemies.forEach(enemy => {
					if (projectile.target === enemy) {
						// Only handle the hit if it was the intended target
						if (!enemy.isHandledForDeath && Phaser.Geom.Intersects.RectangleToRectangle(projectile.getBounds(), enemy.getBounds())) {
							this.handleProjectileHit(projectile, enemy);
						}
					}
				})
			});

			// Update health bar positions
			this.enemies.forEach(enemy => {
				enemy.updateHealthBar();
			});

			// Clean up destroyed projectiles
			this.projectiles = this.projectiles.filter(proj => !proj.isDestroyed);
		}

	}

	mouseDown (x, y) {
	    if (this.isPlacementPhase && x <= 1280) {
	        this.placeRandomGem(x, y);
	    }
		/* let cleanedCoords = this.centerGridCoords(x, y);
		if (this.isPlacementPhase && this.mapGrid[cleanedCoords[0]/this.GRID_SIZE][cleanedCoords[1]/this.GRID_SIZE] == 0) {
            // Hide the preview sprite when a gem is placed
            this.gemPreview.setVisible(false);
        } */
	}

	placeRandomGem(x, y) {
		if (!this.isPlacementPhase || this.remainingPlacements <= 0) {
			console.log("Cannot place gem: Not in placement phase or no placements remaining");
			return;
		}
	
		let cleanedCoords = this.centerGridCoords(x, y);
		let gridX = cleanedCoords[0] / this.GRID_SIZE;
		let gridY = cleanedCoords[1] / this.GRID_SIZE;
	
		if (this.mapGrid[gridX][gridY] !== 0) {
			console.log("Cannot place gem: Tile is not empty");
			return;
		}
	
		// Temporarily mark the position as blocked
		this.mapGrid[gridX][gridY] = '1';
		this.astar.nodes[gridX][gridY].wall = true;
	
		// Check if there is still a valid path for each checkpoint
		let pathBlocked = this.checkpointsList.some((checkpoint, index, checkpoints) => {
			let startNode = index === 0 ? this.startNode : checkpoints[index - 1];
			return !this.astar.findPath(startNode, checkpoint);
		});
	
		// Revert the grid if path is blocked
		if (pathBlocked) {
			this.mapGrid[gridX][gridY] = '0';
			this.astar.nodes[gridX][gridY].wall = false;
			console.log("Cannot place gem: Path is blocked");
			return;
		}
	
		// Place the gem if the path is not blocked
		let rarity = this.getRandomRarity(this.gemChances);
		let colorIndex = Math.floor(Math.random() * 7);
		let gem = new Gem(this, cleanedCoords[0], cleanedCoords[1], rarity, colorIndex);
		this.gems.push(gem);
		this.currentPhaseGems.push(gem);
	
		// Update remaining placements
		this.remainingPlacements--;
		if (this.remainingPlacements === 0) {
			this.endPlacementPhase();
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
		return [(x-x%this.GRID_SIZE), (y-y%this.GRID_SIZE)];
	}

	keepGem() {
		if (!this.selectedGem) {
			return;
		}

		// Remove all other gems from the current placement phase from their game objects array
		// Iterate over the array backwards so that splicing doesn't affect the array
		// while working on it
		for (let i = this.currentPhaseGems.length - 1; i >= 0; i--) {
			const gem = this.currentPhaseGems[i];
			if (gem !== this.selectedGem) {
				gem.turnToStone();
				this.currentPhaseGems.splice(i, 1);
			}
		}
		this.currentPhaseGems = [];
	}

	combineGems() {
		// Only work if the currently selected gem has a duplicate
		// from the current placement phase
		let duplicateGems = this.checkForDuplicates(this.selectedGem);
		if (duplicateGems.length === 0) {
			return;
		}

		// When combining two duplicates
		console.log(`Combining gems from rarity ${this.selectedGem.rarity} and color ${this.selectedGem.color}`);
		if (duplicateGems.length >= 1 && duplicateGems.length < 3) {
			let newGem = new Gem(
				this, this.selectedGem.x, this.selectedGem.y, this.selectedGem.rarity + 1, this.selectedGem.colorIndex);
			this.gems.push(newGem);
			this.currentPhaseGems.push(newGem);
			const index = this.gems.indexOf(this.selectedGem);
			if (index !== -1) {
				this.gems.splice(index, 1);
				this.currentPhaseGems.splice(index, 1);
			}
			this.selectedGem.destroy();
			this.handleGemClick(newGem);
			this.keepGem();
		}
		
		
	}

	onStartLevelClicked() {
		this.isPlacementPhase = false;
	}

	completeLevel() {
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
		let enemy = new Enemy(this, x*this.GRID_SIZE, y*this.GRID_SIZE, this.checkpointsList);
		this.enemies.push(enemy);

		let checkpoints = this.checkpointsList.slice();

		this.sendOnPath(enemy, this.astar, checkpoints);
	}

	deductLife (amount) {
		this.lives = this.lives - amount;
		this.gameUI.updateHpText(this.lives);
		if (this.lives <= 0) {
			this.handlePlayerDeath();
		}
	}

	getEnemiesInTurretRange(turret) {
		// Returns all enemies in range of turret
		return this.enemies.filter((enemy) => 
			Phaser.Math.Distance.Between(turret.x, turret.y, enemy.x, enemy.y) <= turret.range);
	}

	findNextTarget(gem) {
		const enemiesInRange = this.getEnemiesInTurretRange(gem);

		// Continue targetting the current target if its still in range
		if (gem.target && enemiesInRange.includes(gem.target)) {
			return gem.target;
		}
		
		// If not, target the enemy in range that has advanced the furthest
		return this.getFurthestEnemyInMaze(enemiesInRange);
	}

	getFurthestEnemyInMaze(enemies) {
		if (enemies.length === 0) {
			return null;
		}

		enemies.sort((a, b) => b.progress - a.progress);
	
		return enemies[0];
	}

	handleProjectileHit(projectile, enemy) {
		// Enemy takes damage
		enemy.takeDamage(projectile.damage);
		if (enemy.currentHealth <= 0) {
			// Enemy gets handled for death if HP is at or below 0
			this.handleEnemyDeath(enemy);
		}
		// Projectile gets cleaned up
		projectile.destroy();
	}

	removeEnemy(enemy) {
		// Remove the enemy from the list of enemies
		const index = this.enemies.indexOf(enemy);
		if (index !== -1) {
			this.enemies.splice(index, 1);
		}

		console.log(`Enemy removed. ${this.enemies.length} enemies remain on the map.`);
	}

	handleEnemyDeath(enemy) {
		console.log(`Enemy at ${Math.floor(enemy.x/this.GRID_SIZE)}, ${Math.floor(enemy.y/this.GRID_SIZE)} has died.`);
		// Add gold and update gold text
		this.gold += enemy.goldValue;
		this.gameUI.updateGoldText(this.gold);

		// Remove the dead enemy from the scene's enemies array
		this.removeEnemy(enemy);
		enemy.destroy();

		// Clears the target for all gems targeting it
		this.gems.forEach(gem => {
			if (gem.target === enemy) {
				gem.clearTarget();
				gem.clearProjectiles();
			}
		});

		// If there are no more enemies on the map, complete the level
		if (this.enemies.length === 0) {
			console.log("Level completed successfully.");
			this.completeLevel();
		}
	}

	handleGemClick(gem) {
		this.selectedGem = gem;
		// Update the gem info text in the reserved UI space
		this.gameUI.updateGemInfoText(gem);

		// Draw a circle indicating gem range
		this.rangeIndicator.clear();
		this.rangeIndicator.strokeCircle(gem.x + 16, gem.y + 16, gem.range);

		// Check if the clicked gem has duplicates and set the button to active if so
		let duplicateGems = this.checkForDuplicates(gem);
		this.gameUI.setCombineButtonActive(duplicateGems.length > 0);
	}

	checkForDuplicates(selectedGem) {
		// Returns the amount of duplicates the currently selected gem has
		// in the current placement phase
		let duplicateGems = [];
		this.gems.forEach(gem => {
			if (selectedGem.color == gem.color && selectedGem.rarity == gem.rarity) {
				if (selectedGem != gem) {
					duplicateGems.push(gem);
				}
			}
		});
		console.log(`Found ${duplicateGems.length} duplicates for selected gem.`);

		return duplicateGems;
	}

	removeGem(gem) {
		const index = this.gems.indexOf(gem);
		if (index !== -1) {
			this.gems.splice(index, 1);
		}
	}

	handlePlayerDeath() {
		// TODO
	}

	updateGemPreview(pointer) {
		if (pointer.x > 1280 || pointer.y > 960) {
			this.gemPreview.setVisible(false);
			return;
		}
        const [x, y] = this.centerGridCoords(pointer.x, pointer.y);
        const gridX = x / this.GRID_SIZE;
        const gridY = y / this.GRID_SIZE;

        // Only show the preview on non-checkpoint and non-occupied squares
        if (gridX <= 40 && gridY <= 30) {
			if (this.isPlacementPhase && this.mapGrid[gridX][gridY] === 0) {
				this.gemPreview.setPosition(x, y).setVisible(true);
			} else {
				this.gemPreview.setVisible(false);
			}
		}
	}

	endPlacementPhase() {
		this.isPlacementPhase = false;
		this.input.off('pointermove', this.updateGemPreview, this);
		this.gemPreview.setVisible(false);
	}
}
