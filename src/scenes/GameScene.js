import Projectile from '../objects/Projectile.js';
import Gem from '../objects/Gem.js';
import Enemy from '../objects/Enemy.js';
import AStar from '../astar.js';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({key: 'GameScene' });
		this.mapgrid = [];

		// init game state variable - game does not start in a placement phase
		this.isPlacementPhase = false;
	}

	create() {
		// add scene background
		this.add.image(640, 480, 'map');
		this.add.image(640, 480, 'grid');

		this.currentLevel = 1;

		// Initialize an empty grid
		this.gridSize = 32;
		this.mapGrid = Array(40).fill(0).map(() => Array(30).fill(0)); 

		this.projectileSprites = this.physics.add.group({
			classType: Projectile,
			runChildUpdate: true
		});
 
		// Mouse event listener
		this.input.on('pointerdown', (pointer) => {
			this.mouseDown(pointer.x, pointer.y);
		});

		this.gemTiers = 
		['Primitive', 'Fiery', 'Infernal', 'Hellforged', 'Demonic', 'Abyssal', 'Diabolical'];

		// Initialize gem chances
		this.gemChances = [0.8, 0.15, 0.05, 0, 0, 0, 0];


		// TEXT & UI

		// Create a 'start level' button
		this.startButton = this.add.text(1300, 20, 'Start Level', 
			{ font: '20px Arial', fill: '#0000FF' });
		this.startButton.setInteractive();
		this.startButton.on('pointerdown', () => {
			this.startLevel(this.currentLevel);
		});

		// Create a 'start placement' button
		this.placementButton = this.add.text(1300, 260, 'Start gem placement',
			{ font: '18px Arial', fill: '#0000FF' });
		this.placementButton.setInteractive();
		this.placementButton.on('pointerdown', () => {
			this.startPlacementPhase();
		});

		// Initialize gem chance text
		this.add.text(1300, 50, 'Gem Chances:',
			{ font: '18px Arial', fill: '#000000'});

		this.gemTier0Text = this.add.text(1300, 75, `${this.gemTiers[0]}: ${this.gemChances[0]*100}%`,
			{ font: '16px Arial', fill: '#000000' });

		this.gemTier1Text = this.add.text(1300, 100, `${this.gemTiers[1]}: ${this.gemChances[1]*100}%`,
			{ font: '16px Arial', fill: '#000000' });

		this.gemTier2Text = this.add.text(1300, 125, `${this.gemTiers[2]}: ${this.gemChances[2]*100}%`,
		{ font: '16px Arial', fill: '#000000' });

		this.gemTier3Text = this.add.text(1300, 150, `${this.gemTiers[3]}: ${this.gemChances[3]*100}%`,
			{ font: '16px Arial', fill: '#000000' });

		this.gemTier4Text = this.add.text(1300, 175, `${this.gemTiers[4]}: ${this.gemChances[4]*100}%`,
			{ font: '16px Arial', fill: '#000000' });

		this.gemTier5Text = this.add.text(1300, 200, `${this.gemTiers[5]}: ${this.gemChances[5]*100}%`,
		{ font: '16px Arial', fill: '#000000' });

		this.gemTier6Text = this.add.text(1300, 225, `${this.gemTiers[6]}: ${this.gemChances[6]*100}%`,
		{ font: '16px Arial', fill: '#000000' });

		// Initialize keep gem button
		this.keepGemButton = this.add.text(1300, 350, 'Keep Gem',
			{ font: '18px Arial', fill: '#0000FF' });
		this.keepGemButton.setInteractive();
		this.keepGemButton.on('pointerdown', () => {
			this.keepGem();
		})

		// Initialize HP text
		this.hpText = this.add.text(1300, 375, 'Lives: 0',
			{ font: '18px Arial', fill: '#000000' });

		// Initialize embers text
		this.goldText = this.add.text(1300, 400, 'Embers: 0',
			{ font: '18px Arial', fill: '#000000' });

		// Initialize text object for displaying gem information
		this.gemInfoText = this.add.text(1300, 450, '',
			{ font: '16px Arial', fill: '#000000' });

		// Create a graphics object for drawing the range indicator
		this.rangeIndicator = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });

		this.levelsData = this.cache.json.get('levels');
		this.mapsData = this.cache.json.get('maps');

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
		this.hpText.setText(`Lives: ${this.lives}`);
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
	}

	placeRandomGem (x, y) {
		if (!this.isPlacementPhase) {
			// If the game is not in a placement phase, don't do anything
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
				this.currentPhaseGems.push(gem);

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
		let enemy = new Enemy(this, x*32, y*32, this.checkpointsList);
		this.enemies.push(enemy);

		let checkpoints = this.checkpointsList.slice();

		this.sendOnPath(enemy, this.astar, checkpoints);
	}

	deductLife (amount) {
		this.lives = this.lives - amount;
		this.hpText.setText(`Lives: ${this.lives}`);
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
		console.log(`Enemy at ${Math.floor(enemy.x/32)}, ${Math.floor(enemy.y/32)} has died.`);
		// Add gold and update gold text
		this.gold += enemy.goldValue;
		this.goldText.setText(`Embers: ${this.gold}`);
		enemy.destroy();

		// Remove the dead enemy from the scene's enemies array
		this.removeEnemy(enemy);

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
		const info = `${this.gemTiers[gem.rarity]} ${gem.color}\nDamage: ${gem.damage}\nRange: ${gem.range}\nAttack Speed: ${gem.attackSpeed}`;
		this.gemInfoText.setText(info);

		// Draw a circle indicating gem range
		this.rangeIndicator.clear();
		this.rangeIndicator.strokeCircle(gem.x + 16, gem.y + 16, gem.range);
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
}
