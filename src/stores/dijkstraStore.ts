import { defineStore } from "pinia";
import { getRandomNumbers } from "@utils/getRandomNumbers";
import type { GraphState, ShortestPathData } from "@defs/index";

export type DijkstraStoreState = {
	activeMode: "input" | "random";
	fromNode: string;
	graphState: GraphState;
	hasRefreshIcon: boolean;
	isAppDefault: boolean;
	isAppError: boolean;
	isAppLoading: boolean;
	isAppSuccess: boolean;
	isCalculateBtnDisabled: boolean;
	isClearBtnDisabled: boolean;
	isInputValidationErr: boolean;
	isSelectDisabled: boolean;
	shortestPathData?: ShortestPathData;
	toNode: string;
};

export const useDijkstraStore = defineStore("dijkstra", {
	state: (): DijkstraStoreState => ({
		activeMode: "input",
		fromNode: "",
		graphState: {
			adjacencyList: {},
			vertexData: [],
		},
		hasRefreshIcon: false,
		isAppDefault: true,
		isAppError: false,
		isAppLoading: false,
		isAppSuccess: false,
		isCalculateBtnDisabled: false,
		isClearBtnDisabled: false,
		isInputValidationErr: false,
		isSelectDisabled: false,
		shortestPathData: undefined,
		toNode: "",
	}),
	actions: {
		addGraphVertex(vertex: number, data: string) {
			this.graphState.vertexData[vertex] = data;
		},
		addGraphEdge(u: string, v: string, weight: number) {
			if (!this.graphState.adjacencyList[u]) {
				this.graphState.adjacencyList[u] = {};
			}
			this.graphState.adjacencyList[u][v] = weight;
		},
		setMode(mode: DijkstraStoreState["activeMode"]) {
			this.activeMode = mode;
			this.isAppSuccess = false;
			this.isAppError = false;
			this.isAppLoading = false;
			this.isAppDefault = true;
			this.isInputValidationErr = false;
			this.isCalculateBtnDisabled = false;
			switch (mode) {
				case "random":
					this.isSelectDisabled = true;
					this.isClearBtnDisabled = true;
					this.hasRefreshIcon = true;
					this.fetchRandomNumbers(); // no await
					break;
				case "input":
					this.isSelectDisabled = false;
					this.isClearBtnDisabled = false;
					this.hasRefreshIcon = false;
					break;
			}
		},
		updateNodeSelection(fromNode: string, toNode: string) {
			this.fromNode = fromNode;
			this.toNode = toNode;
			this.isCalculateBtnDisabled = false;
			this.isAppDefault = true;
			this.isAppSuccess = false;
			this.isAppError = false;
			this.isAppLoading = false;
			this.isInputValidationErr = false;
		},
		async fetchRandomNumbers() {
			if (this.activeMode !== "random") {
				return;
			}
			this.isCalculateBtnDisabled = true;
			this.isAppDefault = false;
			this.isAppLoading = true;
			try {
				const randomLetters = await getRandomNumbers();
				this.updateNodeSelection(randomLetters?.fromNode, randomLetters?.toNode);
			} catch (error) {
				console.error("Error:", error);
			}
			this.isCalculateBtnDisabled = false;
			this.isAppLoading = false;
			this.isAppDefault = true;
		},
		initialiseDefaultGraph() {
			this.graphState = {
				adjacencyList: {},
				vertexData: [],
			};
			this.addGraphVertex(0, "A");
			this.addGraphVertex(1, "B");
			this.addGraphVertex(2, "C");
			this.addGraphVertex(3, "D");
			this.addGraphVertex(4, "E");
			this.addGraphVertex(5, "F");
			this.addGraphVertex(6, "G");
			this.addGraphVertex(7, "H");
			this.addGraphVertex(8, "I");
			this.addGraphEdge("A", "B", 4);
			this.addGraphEdge("A", "C", 6);
			this.addGraphEdge("B", "A", 4);
			this.addGraphEdge("B", "F", 2);
			this.addGraphEdge("C", "A", 6);
			this.addGraphEdge("C", "D", 8);
			this.addGraphEdge("D", "C", 8);
			this.addGraphEdge("D", "E", 4);
			this.addGraphEdge("D", "G", 1);
			this.addGraphEdge("E", "B", 2);
			this.addGraphEdge("E", "F", 3);
			this.addGraphEdge("E", "I", 8);
			this.addGraphEdge("E", "D", 4);
			this.addGraphEdge("F", "B", 2);
			this.addGraphEdge("F", "E", 3);
			this.addGraphEdge("F", "G", 4);
			this.addGraphEdge("F", "H", 6);
			this.addGraphEdge("G", "D", 1);
			this.addGraphEdge("G", "F", 4);
			this.addGraphEdge("G", "H", 5);
			this.addGraphEdge("G", "I", 5);
			this.addGraphEdge("H", "F", 6);
			this.addGraphEdge("H", "G", 5);
			this.addGraphEdge("I", "E", 8);
			this.addGraphEdge("I", "G", 5);
		},
	},
});
