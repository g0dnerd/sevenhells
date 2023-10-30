export default class AStar {
    constructor(grid) {
        // The game's grid representation
        this.grid = grid;
        // Convert the grid into nodes for pathfinding
        this.nodes = this.createNodes(grid);
        console.log(`astar.nodes at 0,6 has coords of ${this.nodes[0][6].x}, ${this.nodes[0][6].y}, and wall of ${this.nodes[0][6].wall}`);
        console.log(`astar.nodes at 1,6 has coords of ${this.nodes[1][6].x}, ${this.nodes[1][6].y}, and wall of ${this.nodes[1][6].wall}`);
    }


    /**
     * Convert the map grid into nodes for the A* algorithm.
     * @param {Array} grid - The map grid.
     * @return {Array} nodes - The converted nodes.
     */
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
                    wall: false  // Is this node a wall?
                };
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

	    start.cost = 0;
	    start.heuristic = this.heuristic(start, target);

	    // Nodes to be evaluated
	    let openSet = [start];
	    // Nodes that have been evaluated
	    let closedSet = [];

	    while (openSet.length > 0) {
	        // Get the node with the lowest score (cost + heuristic)
	        let current = openSet.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic))[0];
	        console.log(`current node is at ${current.x}, ${current.y}`);

	        // If we've reached the target
	        if (current === target) {
	            return this.reconstructPath(current);
	        }

	        openSet = openSet.filter(node => node !== current);
	        closedSet.push(current);

	        let neighbors = this.getNeighbors(current);

	        for (let neighbor of neighbors) {
	            if (closedSet.includes(neighbor) || neighbor.wall) continue;

	            let tentativeCost = current.cost + 1;
	            if (tentativeCost < neighbor.cost) {
	                neighbor.previous = current;
	                neighbor.cost = tentativeCost;
	                neighbor.heuristic = this.heuristic(neighbor, target);
	                if (!openSet.includes(neighbor)) openSet.push(neighbor);
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
	        console.log(`node at ${x}, ${y} has a neighbor at ${x - 1}, ${y}`);
	        neighbors.push(this.nodes[x - 1][y]);
	    }
	    if (this.nodes[x + 1] && this.nodes[x + 1][y]) {
	        console.log(`node at ${x}, ${y} has a neighbor at ${x + 1}, ${y}`);
	        neighbors.push(this.nodes[x + 1][y]);
	    }
	    if (this.nodes[x][y - 1]) {
	        console.log(`node at ${x}, ${y} has a neighbor at ${x}, ${y - 1}`);
	        neighbors.push(this.nodes[x][y - 1]);
	    }
	    if (this.nodes[x][y + 1]) {
	        console.log(`node at ${x}, ${y} has a neighbor at ${x}, ${y + 1}`);
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
        let path = [current];
        while (current.previous) {
            path.unshift(current.previous);
            current = current.previous;
        }
        return path;
    }
}