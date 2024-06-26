<template>
	<div class="calculator-card mt-[-175px] flex flex-col justify-center items-center">
		<div class="toggle-wrapper flex relative bg-white rounded-full px-[12px] py-[8px] max-w-[270px] justify-center mb-[24px]">
			<Toggle v-model="isRandomMode" :hasRefreshIcon="hasRefreshIcon" :refreshClick="fetchRandomNumbers">Enable Random Mode</Toggle>
		</div>
		<div class="w-[721px] bg-white rounded-[8px] shadow-md flex flex-col md:w-[400px]">
			<div class="calculator-card-inner">
				<div class="grid grid-cols-2 calculator-card-grid md:grid-cols-1">
					<div class="calculator-card-left py-[32px] pl-[32px] pr-[24px]">
						<h3 class="text-lg text-color-primary font-semibold mb-[24px]">Select Path</h3>
						<div class="form-row mb-[24px]">
							<CustomSelect id="fromNode" placeholder="Select" :options="selectOptions" v-model="fromSelectedOption" :disabled="isSelectDisabled">From node</CustomSelect>
						</div>
						<div class="form-row mb-[24px]">
							<CustomSelect id="toNode" placeholder="Select" :options="selectOptions" v-model="toSelectedOption" :disabled="isSelectDisabled">To node</CustomSelect>
						</div>
						<div class="flex items-center justify-start">
							<Button v-if="activeMode !== 'random'" appearance="outline" class="mr-[12px] h-[44px]" type="reset" :disabled="isClearBtnDisabled" :onClick="clearBtnHandler">Clear</Button>
							<Button appearance="solid" :hasIcon="true" :onClick="calculateShortestPath" :loading="isAppLoading" :disabled="isCalculateBtnDisabled" class="min-w-[146px] h-[44px]">{{ activeMode === "input" ? "Calculate" : "Calculate Random" }}</Button>
						</div>
						<Message v-if="isInputValidationErr" status="error">Please select valid FROM and TO nodes.</Message>
						<Message v-if="isAppError" status="error">Something went wrong. Status code: {{ resultResStatus }}</Message>
					</div>
					<div class="relative flex items-center justify-center w-full h-full calculator-card-right">
						<Loader v-if="isAppLoading" />
						<NoResultPlaceholder v-if="!isAppLoading && !isAppResult" />
						<ResultCard v-if="!isAppLoading && isAppResult" :fromNode="fromNode" :toNode="toNode" :nodeNames="shortestPathData?.nodeNames" :distance="shortestPathData?.distance" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { useDijkstraStore } from "@stores/dijkstraStore";
import type { OptionType } from "@defs/index";
import { SELECT_OPTIONS } from "@constants/index";

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
	computed: {
		...mapState(useDijkstraStore, [
			"activeMode",
			"fromNode",
			"graphState",
			"shortestPathData",
			"toNode",
			"hasRefreshIcon",
			"isAppError",
			"isAppLoading",
			"isAppResult",
			"isCalculateBtnDisabled",
			"isClearBtnDisabled",
			"isInputValidationErr",
			"isSelectDisabled",
			"resultResStatus",
		]),
		isRandomMode: {
			get() {
				return this.activeMode === "random";
			},
			set(value: boolean) {
				if (value) {
					this.setMode("random");
				} else {
					this.setMode("input");
				}
			},
		},
		selectOptions() {
			return SELECT_OPTIONS;
		},
		fromSelectedOption: {
			get(): OptionType {
				return {
					label: this.fromNode,
					value: this.fromNode,
				};
			},
			set(value: OptionType) {
				this.updateNodeSelection(value?.value || "", this.toNode);
			},
		},
		toSelectedOption: {
			get(): OptionType {
				return {
					label: this.toNode,
					value: this.toNode,
				};
			},
			set(value: OptionType) {
				this.updateNodeSelection(this.fromNode, value?.value || "");
			},
		},
	},
	methods: {
		...mapActions(useDijkstraStore, [
			"addGraphVertex",
			"addGraphEdge",
			"calculateShortestPath",
			"initialiseDefaultGraph",
			"fetchRandomNumbers",
			"setMode",
			"updateNodeSelection",
		]),
		clearBtnHandler() {
			this.updateNodeSelection("", "");
		},
	},
	mounted() {
		this.initialiseDefaultGraph();
	},
});
</script>
