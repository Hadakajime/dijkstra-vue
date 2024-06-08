export interface GraphState {
	adjacencyList: Record<string, Record<string, number>>;
	vertexData: string[];
}

export type OptionType = {
	value: string;
	label: string;
};

export type ShortestPathData = {
	readonly nodeNames: string[];
	readonly distance: number;
};
