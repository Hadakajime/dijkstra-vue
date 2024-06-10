<template>
	<div>
		<p>{{ title }}</p>
		<p>{{ caption }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, type PropType } from "vue";
import { mapState, mapActions } from "pinia";
import { type DijkstraStoreState, useDijkstraStore } from "@/stores/dijkstraStore";
import type { GraphState, OptionType } from "@/types";
import { SELECT_OPTIONS } from "@/constants";
import { getRandomNumbers } from "@/utils/getRandomNumbers";
import { dijkstra } from "@/utils/dijkstra";

export type CalculatorCardProps = {
	modeUnused?: DijkstraStoreState["activeMode"];
};

type Data = {
	activeMode?: string;
	graphState: GraphState;
	fromSelectedOption: OptionType | null;
	toSelectedOption: OptionType | null;
	isInputValidationErr: boolean;
	isAppSuccess: boolean;
	isAppError: boolean;
	isAppDefault: boolean;
	isAppLoading: boolean;
	isSelectDisabled: boolean;
	isClearBtnDisabled: boolean;
	hasRefreshIcon: boolean;
	isCalculateBtnDisabled: boolean;
	resultResStatus: number;
	resultNodeNames: string[];
	resultDistance: number;
};

export default defineComponent({
	name: "CalculatorCard",
	components: {
		ExampleComponent: defineAsyncComponent(() => import("components/ExampleComponent.vue")),
	},
	props: {
		modeUnused: {
			type: String as PropType<CalculatorCardProps["modeUnused"]>,
			required: false,
			default: "input",
		},
	},
	data: (): Data => ({
		graphState: {} as GraphState,
		fromSelectedOption: null,
		toSelectedOption: null,
		isInputValidationErr: false,
		isAppSuccess: false,
		isAppError: false,
		isAppDefault: true,
		isAppLoading: false,
		isSelectDisabled: false,
		isClearBtnDisabled: false,
		hasRefreshIcon: false,
		isCalculateBtnDisabled: false,
		resultResStatus: -1,
		resultNodeNames: [],
		resultDistance: -1,
	}),
	watch: {
		modeUnused() {
			if (!!this.modeUnused) {
				console.log(`Mode prop changed to: ${this.modeUnused}`);
			}
		},
	},
	computed: {
		...mapState(useDijkstraStore, [
			"activeMode",
			"fromNode",
			"toNode",
			"shortestPathData",
		]),
	},
	methods: {
		...mapActions(useDijkstraStore, [
			"addGraphVertex",
			"addGraphEdge",
			"setMode",
		]),
		async fetchRandomNumberHandler() {
			if (this.activeMode === "random") {
				try {
					this.isCalculateBtnDisabled = true;
					this.isAppDefault = false;
					this.isAppLoading = true;
					const randomLetters = await getRandomNumbers();
					this.fromNode = randomLetters?.fromNode;
					this.toNode = randomLetters?.toNode;
					this.fromSelectedOption = {
						value: randomLetters?.fromNode,
						label: randomLetters?.fromNode,
					};
					this.toSelectedOption = {
						value: randomLetters?.toNode,
						label: randomLetters?.toNode,
					};
				} catch (error) {
					console.error("Error:", error);
				}
			}
			this.isCalculateBtnDisabled = false;
			this.isAppLoading = false;
			this.isAppDefault = true;
		},
		fetchRandomRefreshHandler() {
			this.isAppDefault = true;
			this.isAppSuccess = false;
			this.fetchRandomNumberHandler();
		},
		handleFromChange(newValue: SingleValue<OptionType>) {
			this.isCalculateBtnDisabled = false;
			this.isAppDefault = true;
			this.isAppSuccess = false;
			this.fromSelectedOption = newValue;
			this.fromNode = `${newValue?.value}`;
		},
		calculateHandler() {
			if (this.fromNode?.trim() !== "" && this.toNode?.trim() !== "") {
				this.isInputValidationErr = false;
				this.isAppDefault = false;
				this.isAppLoading = true;
				const { nodeNames, distance } = dijkstra(this.graphState, this.fromNode, this.toNode);
				setTimeout(() => {
					handleSendResult({
						nodeNames: nodeNames,
						distance: distance,
					})
						.then(result => {
							if (result?.status === 200) {
								setResultResStatus(result?.status);
								setIsAppSuccess(true);
								setIsAppLoading(false);
								setResultNodeNames(result?.data?.parsedBody?.nodeNames);
								setResultDistance(result?.data?.parsedBody?.distance);
							}
						})
						.catch(err => {
							setResultResStatus(err?.status);
							setIsAppSuccess(false);
							setIsAppDefault(true);
							setIsAppError(true);
						});
				}, 500);
				setIsCalculateBtnDisabled(true);
			} else {
				setIsInputValidationErr(true);
			}
		},
	},
	mounted() {
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
});
</script>
