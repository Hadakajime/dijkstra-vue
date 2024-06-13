<template>
	<div>
		<label :for="id" class="block text-color-body text-sm mb-[8px]">
			<slot></slot>
		</label>
		<v-select v-bind="$attrs" v-model="value" :id="id" :name="id" :options="options" :placeholder="placeholder" :disabled="disabled" :input="onChange"></v-select>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { OptionType } from "@defs/index";

export default defineComponent({
	name: "CustomSelect",
	props: {
		disabled: Boolean,
		id: {
			type: String,
			default: "",
		},
		onChange: {
			type: Function as PropType<(selectedOption: OptionType) => void>,
		},
		options: {
			type: Array as PropType<OptionType[]>,
		},
		placeholder: {
			type: String,
			default: "",
		},
		value: {
			type: Object as PropType<OptionType | null>,
			default: null,
		},
	},
});
</script>

<style>
@import "vue-select/dist/vue-select.css";
</style>