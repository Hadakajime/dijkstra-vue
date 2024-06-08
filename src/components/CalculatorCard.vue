<template>
	<div>
		<p>{{ title }}</p>
		<p>{{ caption }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { mapState } from "pinia";
import { useDijkstraStore } from "src/stores/dijkstraStore";
import type { GraphState, OptionType } from "src/types";
import { SELECT_OPTIONS } from "src/constants";

export type CalculatorCardProps = {
	mode?: string;
};

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
		ExampleComponent: defineAsyncComponent(() => import("components/ExampleComponent.vue")),
	},
	props: {
		mode: {
			type: String,
			required: false,
			default: "",
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
	computed: {
		...mapState(useDijkstraStore, [
			"fromNode",
			"toNode",
			"shortestPathData",
		]),
	},
});
</script>
