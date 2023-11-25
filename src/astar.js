export default class AStar {
    constructor(grid) {
        // The game's grid representation
        this.grid = grid;
        // Convert the grid into nodes for pathfinding
        this.nodes = this.createNodes(grid);
    }


    /**
     * Convert the map grid into nodes for the A* algorithm.
     * @param {Array} grid - The map grid.
     * @return {Array} nodes - The converted nodes.
     */

    resetNodes() {
      for (let x = 0; x < this.nodes.length; x++) {
        for (let y = 0; y < this.nodes[x].length; y++) {
          this.nodes[x][y].cost = Infinity;
          this.nodes[x][y].heuristic = null;
          this.nodes[x][y].previous = null;
          this.nodes[x][y].visited = false;
        }
      }
    }


    createNodes(grid) {
        let nodes = [];
        for (let x = 0; x < 40; x++) {
            let rowNodes = [];
            for (let y = 0; y < 30; y++) {
                let node = {
                    x: x,
                    y: y,
                    cost: Infinity,  // The cost to reach this node
                    heuristic: null,  // Estimated cost from this node to the end
                    previous: null,  // The previous node in the path
                    visited: false,  // Has this node been visited yet?
                    wall: grid[x][y] == 1  // Is this node a wall?
                };
                if (node.wall) {
                    console.log(`Node at ${node.x},${node.y} is a wall`);
                }
				// console.log(`created new node at ${x}, ${y}`);
                rowNodes.push(node);
            }
            nodes.push(rowNodes);
        }
        return nodes;
    }


    /**
     * Heuristic function to estimate the cost between two nodes.
     * Using Manhattan distance for simplicity.
     * @param {Object} nodeA
     * @param {Object} nodeB
     * @return {Number} The estimated cost to move between the nodes.
     */
    heuristic(nodeA, nodeB) {
        return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
    }


    /**
     * A* Pathfinding algorithm to find the best path between nodes.
     * @param {Object} start - The starting node.
     * @param {Array} checkpoints - An array of nodes to pass through.
     * @return {Array|null} The path or null if no path was found.
     */
    findPath(start, target) {
        console.log(`findPath called for start node ${start.x}, ${start.y} targeting node ${target.x}, ${target.y}`);

        this.resetNodes();

        start.cost = 0;
        start.heuristic = this.heuristic(start, target);

        let openSet = [start];
        // Using an object to keep track of closed nodes for O(1) access
        let closedSet = {};

        while (openSet.length > 0) {
            // Sort the open set initially and when inserting new elements
            openSet.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic));
            let current = openSet.shift(); // Remove the first element

            if (current.x === target.x && current.y === target.y) {
                return this.reconstructPath(current);
            }

            // Mark the current node as closed
            closedSet[current.x + '-' + current.y] = true; // Use x-y as a unique key for the node

            let neighbors = this.getNeighbors(current);

            for (let neighbor of neighbors) {
                let neighborKey = neighbor.x + '-' + neighbor.y;
                // console.log(`Checking neighbor: (${neighbor.x},${neighbor.y})`);
                // Check if neighbor is in closed set with a direct property access
                if (closedSet[neighborKey] || neighbor.wall) {
                    // console.log(`Neighbor: (${neighbor.x},${neighbor.y}) is in closed set or is a wall`);
                    continue;
                }

                let tentativeCost = current.cost + 1;
                if (tentativeCost < neighbor.cost) {
                    // console.log(`Updating neighbor: (${neighbor.x},${neighbor.y}) with new cost and previous node (${current.x},${current.y})`);
                    // Update neighbor properties
                    neighbor.previous = current;
                    neighbor.cost = tentativeCost;
                    neighbor.heuristic = this.heuristic(neighbor, target);
                    // Insert the neighbor in the correct position in the open set
                    if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                        openSet.push(neighbor); // Add new nodes to be evaluated
                    }
                }
            }
        }
        console.log('no path found.');
        return null; // No path found
    }



    /**
     * Gets the neighboring nodes of the given node.
     * @param {Object} node - The current node.
     * @return {Array} The neighboring nodes.
     */
    getNeighbors(node) {
        let neighbors = [];
        let x = node.x;
        let y = node.y;

        if (this.nodes[x - 1] && this.nodes[x - 1][y]) {
            // console.log(`Node at ${x}, ${y} has a neighbor at {x-1},{y}`);
	        neighbors.push(this.nodes[x - 1][y]);
	    }
	    if (this.nodes[x + 1] && this.nodes[x + 1][y]) {
            // console.log(`Node at ${x}, ${y} has a neighbor at {x+1},{y}`);
	        neighbors.push(this.nodes[x + 1][y]);
	    }
	    if (this.nodes[x][y - 1]) {
	        neighbors.push(this.nodes[x][y - 1]);
            // console.log(`Node at ${x}, ${y} has a neighbor at {x},{y-1}`);
	    }
	    if (this.nodes[x][y + 1]) {
            // console.log(`Node at ${x}, ${y} has a neighbor at {x},{y+1}`);
	        neighbors.push(this.nodes[x][y + 1]);
	    }

        return neighbors;
    }

    /**
     * Reconstructs the path from start to end once the path has been found.
     * @param {Object} current - The current node.
     * @return {Array} The path from start to end.
     */
    reconstructPath(current) {
        // console.log(`Starting to reconstruct path from node: (${current.x},${current.y})`);
        let path = [current];
        let steps = 0; // Add a step counter to prevent infinite loops
        while (current.previous) {
            steps++;
            if (steps > this.grid.length * this.grid[0].length) { // Prevent infinite loops
                // console.log("Infinite loop detected in path reconstruction.");
                break;
            }
            // console.log(`Adding node: (${current.previous.x},${current.previous.y}) to path with current node: (${current.x},${current.y})`);
            if (current.x === current.previous.x && current.y === current.previous.y) {
                console.log(`Cycle detected: current node is the same as previous node at (${current.x},${current.y}).`);
                break;
            }
            current = current.previous;
            path.unshift(current);
        }
        // console.log("Finished reconstructing", path.map(n => `(${n.x},${n.y})`).join(" -> "));
        return path;
    }

}