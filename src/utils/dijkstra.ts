import type { GraphState, ShortestPathData } from "@defs/index";

export const dijkstra = (graphState: GraphState, fromNode: string, toNode: string): ShortestPathData => {
	const { adjacencyList } = graphState;
	const vertices = Object.keys(adjacencyList);
	const distances: Record<string, number> = {};
	const previous: Record<string, string | null> = {};
	const visited: Record<string, boolean> = {};

	vertices.forEach(vertex => {
		distances[vertex] = Infinity;
		previous[vertex] = null;
	});

	distances[fromNode] = 0;
	let allVisited = false;

	while (!allVisited) {
		let minDistance = Infinity;
		let closestVertex = null;
		allVisited = true;

		vertices.forEach(vertex => {
			if (!visited[vertex] && distances[vertex] < minDistance) {
				minDistance = distances[vertex];
				closestVertex = vertex;
			}
			if (!visited[vertex]) {
				allVisited = false;
			}
		});

		if (closestVertex === null) break;
		visited[closestVertex] = true;

		for (const neighbor in adjacencyList[closestVertex]) {
			const distance = distances[closestVertex] + adjacencyList[closestVertex][neighbor];
			if (distance < distances[neighbor]) {
				distances[neighbor] = distance;
				previous[neighbor] = closestVertex;
			}
		}
	}

	const path: string[] = [];
	let currentVertex = toNode;
	while (previous[currentVertex]) {
		path.unshift(currentVertex);
		currentVertex = previous[currentVertex]!;
	}
	if (path.length > 0) {
		path.unshift(fromNode);
	}

	return {
		nodeNames: path,
		distance: distances[toNode] !== Infinity ? distances[toNode] : -1,
	};
};
