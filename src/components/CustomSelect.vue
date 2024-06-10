<template></template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { OptionType } from "@/types";

export type CustomSelectProps = {
	options: OptionType[];
	value?: OptionType | null;
	placeholder?: string;
	label?: string;
	disabled?: boolean;
	id?: string;
	onChange: (selectedOption: OptionType) => void;
};

export default defineComponent({
	name: "CustomSelect",
	props: {
		options: {
			type: Array as PropType<CustomSelectProps["options"]>,
		},
	},
});
</script>
