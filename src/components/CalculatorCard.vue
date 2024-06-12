<template>
	<div class="calculator-card mt-[-175px] flex flex-col justify-center items-center">
		<div class="toggle-wrapper flex relative bg-white rounded-full px-[12px] py-[8px] max-w-[270px] justify-center mb-[24px]">
			<Toggle v-model="isRandomMode" :hasRefreshIcon="hasRefreshIcon" :refreshClick="fetchRandomRefreshHandler">Enable Random Mode</Toggle>
		</div>
		<div class="w-[721px] bg-white rounded-[8px] shadow-md flex flex-col md:w-[400px]">
			<div class="calculator-card-inner">
				<div class="grid grid-cols-2 calculator-card-grid md:grid-cols-1">
					<div class="calculator-card-left py-[32px] pl-[32px] pr-[24px]">
						<h3 class="text-lg text-color-primary font-semibold mb-[24px]">Select Path</h3>
						<div class="form-row mb-[24px]">
							<CustomSelect :id="fromNode" placeholder="Select" :options="selectOptions" :value="fromSelectedOption" :disabled="isSelectDisabled" :onChange="handleFromChange">From node</CustomSelect>
						</div>
						<div class="form-row mb-[24px]">
							<CustomSelect :id="toNode" placeholder="Select" :options="selectOptions" :value="toSelectedOption" :disabled="isSelectDisabled" :onChange="handleToChange">To node</CustomSelect>
						</div>
						<div class="flex items-center justify-start">
							<Button v-if="activeMode !== 'random'" appearance="outline" class="mr-[12px] h-[44px]" type="reset" :disabled="isClearBtnDisabled" :onClick="clearBtnHandler">Clear</Button>
							<Button appearance="solid" :hasIcon="true" :onClick="calculateHandler" :loading="isAppLoading" :disabled="isCalculateBtnDisabled" class="min-w-[146px] h-[44px]">
								{{ activeMode === "input" ? "Calculate" : "Calculate Random" }}
							</Button>
						</div>
						<Message v-if="isInputValidationErr" status="error">Please select valid FROM and TO nodes.</Message>
						<Message v-if="isAppError" status="error">Something went wrong. Status code: {{ resultResStatus }}</Message>
					</div>
					<div class="relative flex items-center justify-center w-full h-full calculator-card-right">
						<NoResultPlaceholder v-if="isAppDefault" />
						<Loader v-if="isAppLoading" />
						<ResultCard v-if="isAppSuccess" :fromNode="fromNode" :toNode="toNode" :nodeNames="resultNodeNames" :distance="resultDistance" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { mapState, mapActions } from "pinia";
import { useDijkstraStore } from "@stores/dijkstraStore";
import type { GraphState, OptionType } from "@defs/index";
import { SELECT_OPTIONS } from "@constants/index";
import { getRandomNumbers } from "@utils/getRandomNumbers";
import handleSendResult from "@utils/SendShortestPathData";
import { dijkstra } from "@utils/dijkstra";

type Data = {
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
		Button: defineAsyncComponent(() => import("@components/Button.vue")),
		NoResultPlaceholder: defineAsyncComponent(() => import("@components/NoResultPlaceholder.vue")),
		ResultCard: defineAsyncComponent(() => import("@components/ResultCard.vue")),
		Loader: defineAsyncComponent(() => import("@components/Loader.vue")),
		Message: defineAsyncComponent(() => import("@components/Message.vue")),
		CustomSelect: defineAsyncComponent(() => import("@components/CustomSelect.vue")),
		Toggle: defineAsyncComponent(() => import("@components/Toggle.vue")),
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
	computed: {
		...mapState(useDijkstraStore, [
			"activeMode",
			"fromNode",
			"toNode",
			"shortestPathData",
		]),
		isRandomMode: {
			get() {
				return this.activeMode === "random";
			},
			set(value: boolean) {
				this.isAppSuccess = false;
				this.isAppError = false;
				this.isAppLoading = false;
				this.isAppDefault = true;
				this.isInputValidationErr = false;
				this.isCalculateBtnDisabled = false;
				if (value) {
					this.isSelectDisabled = true;
					this.isClearBtnDisabled = true;
					this.hasRefreshIcon = true;
					this.setMode("random");
					this.fetchRandomNumberHandler();
				} else {
					this.isSelectDisabled = false;
					this.isClearBtnDisabled = false;
					this.hasRefreshIcon = false;
					this.setMode("input");
				}
			},
		},
		selectOptions() {
			return SELECT_OPTIONS;
		},
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
		handleFromChange(newValue: OptionType) {
			this.isCalculateBtnDisabled = false;
			this.isAppDefault = true;
			this.isAppSuccess = false;
			this.fromSelectedOption = newValue;
			this.fromNode = `${newValue?.value}`;
		},
		handleToChange(newValue: OptionType) {
			this.isCalculateBtnDisabled = false;
			this.isAppDefault = true;
			this.isAppSuccess = false;
			this.toSelectedOption = newValue;
			this.toNode = `${newValue?.value}`;
		},
		clearBtnHandler() {
			this.isAppSuccess = false;
			this.isAppError = false;
			this.isAppLoading = false;
			this.isAppDefault = true;
			this.isInputValidationErr = false;
			this.isCalculateBtnDisabled = false;
			this.fromSelectedOption = null;
			this.toSelectedOption = null;
			this.fromNode = "";
			this.toNode = "";
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
								this.resultResStatus = result?.status;
								this.isAppSuccess = true;
								this.isAppLoading = false;
								this.resultNodeNames = result?.data?.parsedBody?.nodeNames;
								this.resultDistance = result?.data?.parsedBody?.distance;
							}
						})
						.catch(err => {
							this.resultResStatus = err?.status;
							this.isAppSuccess = false;
							this.isAppDefault = true;
							this.isAppError = true;
						});
				}, 500);
				this.isCalculateBtnDisabled = true;
			} else {
				this.isInputValidationErr = true;
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
