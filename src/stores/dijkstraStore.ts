import { defineStore } from "pinia";
import { getRandomNumbers } from "@utils/getRandomNumbers";
import type { GraphState, ShortestPathData } from "@defs/index";
import handleSendResult from "@utils/SendShortestPathData";
import { dijkstra } from "@utils/dijkstra";

export type DijkstraStoreState = {
	activeMode: "input" | "random";
	fromNode: string;
	graphState: GraphState;
	isAppError: boolean;
	isAppLoading: boolean;
	isInputValidationErr: boolean;
	resultResStatus: number;
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
		isAppError: false,
		isAppLoading: false,
		isInputValidationErr: false,
		resultResStatus: -1,
		shortestPathData: undefined,
		toNode: "",
	}),
	getters: {
		hasRefreshIcon(): boolean {
			return this.activeMode === "random";
		},
		isAppResult(): boolean {
			return !!this.shortestPathData;
		},
		isCalculateBtnDisabled(): boolean {
			return this.isAppResult || this.isAppLoading;
		},
		isClearBtnDisabled(): boolean {
			return this.activeMode === "random";
		},
		isSelectDisabled(): boolean {
			return this.activeMode === "random";
		},
	},
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
		async setMode(mode: DijkstraStoreState["activeMode"]) {
			this.activeMode = mode;
			this.isAppError = false;
			this.isAppLoading = false;
			this.isInputValidationErr = false;
			this.shortestPathData = undefined;
			switch (mode) {
				case "random":
					await this.fetchRandomNumbers();
					break;
				case "input":
					break;
			}
		},
		updateNodeSelection(fromNode: string, toNode: string) {
			this.fromNode = fromNode;
			this.toNode = toNode;
			this.isAppError = false;
			this.isAppLoading = false;
			this.isInputValidationErr = false;
			this.shortestPathData = undefined;
		},
		async fetchRandomNumbers() {
			if (this.activeMode !== "random") {
				return;
			}
			this.updateNodeSelection("", "");
			this.isAppLoading = true;
			try {
				const randomLetters = await getRandomNumbers();
				this.updateNodeSelection(randomLetters?.fromNode, randomLetters?.toNode);
			} catch (error) {
				console.error("Error:", error);
				this.updateNodeSelection("", "");
			}
			this.isAppLoading = false;
		},
		calculateShortestPath() {
			if (!!this.fromNode?.trim() && !!this.toNode?.trim()) {
				this.isAppLoading = true;
				this.isInputValidationErr = false;
				setTimeout(async () => {
					const { nodeNames, distance } = dijkstra(this.graphState, this.fromNode, this.toNode);
					const result = await handleSendResult({
						nodeNames: nodeNames,
						distance: distance,
					});
					if (result?.status === 200) {
						this.resultResStatus = result?.status;
						this.shortestPathData = {
							nodeNames: result?.data?.parsedBody?.nodeNames,
							distance: result?.data?.parsedBody?.distance,
						};
					} else {
						this.resultResStatus = result?.status;
						this.isAppError = true;
						this.shortestPathData = undefined;
					}
					console.log(result);
					this.isAppLoading = false;
				}, 500);
			} else {
				this.isInputValidationErr = true;
			}
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
