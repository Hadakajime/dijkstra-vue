import { defineStore } from "pinia";
import type { ShortestPathData } from "src/types";

export type DijkstraStoreState = {
	fromNode: string;
	toNode: string;
	shortestPathData?: ShortestPathData;
};

export const useDijkstraStore = defineStore("dijkstra", {
	state: (): DijkstraStoreState => ({
		fromNode: "",
		toNode: "",
		shortestPathData: undefined,
	}),
	actions: {},
});
