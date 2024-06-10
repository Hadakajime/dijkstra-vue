import { defineStore } from "pinia";
import type { GraphState, OptionType, ShortestPathData } from "@/types";

export type DijkstraStoreState = {
	activeMode: "input" | "random";
	fromNode: string;
	toNode: string;
	shortestPathData?: ShortestPathData;
	graphState: GraphState;
};

export const useDijkstraStore = defineStore("dijkstra", {
	state: (): DijkstraStoreState => ({
		activeMode: "input",
		fromNode: "",
		toNode: "",
		shortestPathData: undefined,
		graphState: {
			adjacencyList: {},
			vertexData: [],
		},
	}),
	actions: {
		addGraphVertex(vertex: number, data: string) {
			this.$state.graphState.vertexData[vertex] = data;
		},
		addGraphEdge(u: string, v: string, weight: number) {
			if (!this.$state.graphState.adjacencyList[u]) {
				this.$state.graphState.adjacencyList[u] = {};
			}
			this.$state.graphState.adjacencyList[u][v] = weight;
		},
		setMode(mode: DijkstraStoreState["activeMode"]) {
			this.$state.activeMode = mode;
		},
	},
});
