<template>
	<div class="flex items-center justify-between">
		<label class="inline-flex items-center cursor-pointer">
			<input type="checkbox" :id="id" class="sr-only peer" v-model="checked" />
			<div class="relative w-11 h-6 bg-color-gray rounded-full peer peer-focus:ring-4 peer-focus:color-secondary peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[&quot; &quot;] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-color-secondary"></div>
			<span class="text-sm font-medium ms-3 text-color-body">
				<slot></slot>
			</span>
		</label>
		<button v-if="hasRefreshIcon" class="flex re-calculate-random ml-[16px] cursor-pointer" :onClick="refreshClick">
			<img src="/refresh.svg?url" width="25" />
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "Toggle",
	props: {
		modelValue: Boolean,
		id: String,
		hasRefreshIcon: Boolean,
		refreshClick: {
			type: Function as PropType<() => void>,
			required: false,
		},
	},
	emits: [
		"update:modelValue",
	],
	computed: {
		checked: {
			get() {
				return this.modelValue;
			},
			set(value: boolean) {
				this.$emit("update:modelValue", value);
			},
		},
	},
});
</script>
