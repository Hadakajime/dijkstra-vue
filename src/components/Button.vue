<template>
	<button class="flex items-center justify-center rounded-[8px] border border-color-secondary px-[16px] py-[12px] tex-md" :class="classes" :onClick="onClick" :type="type" :disabled="disabled || loading">
		<ButtonLoader v-if="loading" />
		<span v-if="hasIcon && !loading" class="mr-2">
			<img src="@public/calculator.svg" />
		</span>
		<slot v-if="!loading"></slot>
	</button>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, type PropType } from "vue";

export type ButtonProps = {
	appearance?: "solid" | "outline";
	disabled?: boolean;
	loading?: boolean;
	onClick?: () => void;
	hasIcon?: boolean;
	type?: "button" | "submit" | "reset";
};

export default defineComponent({
	name: "Button",
	components: {
		ButtonLoader: defineAsyncComponent(() => import("@components/ButtonLoader.vue")),
	},
	props: {
		appearance: {
			type: String as PropType<ButtonProps["appearance"]>,
			default: "solid",
		},
		disabled: Boolean,
		loading: Boolean,
		onClick: {
			type: Function as PropType<ButtonProps["onClick"]>,
			default: () => undefined,
		},
		hasIcon: Boolean,
		type: {
			type: String as PropType<ButtonProps["type"]>,
			default: "button",
		},
	},
	computed: {
		classes() {
			return {
				"text-white bg-color-secondary hover:bg-color-secondary": this.appearance === "solid" && !this.disabled,
				"text-color-secondary bg-white border-color-secondary border-[1px] border-solid hover:bg-indigo-50": this.appearance === "outline" && !this.disabled,
				"text-white bg-color-secondary cursor-not-allowed opacity-80": (this.appearance === "solid" && this.disabled) || this.loading,
				"text-color-secondary cursor-not-allowed opacity-80": (this.appearance === "outline" && this.disabled) || this.loading,
			};
		},
	},
});
</script>
