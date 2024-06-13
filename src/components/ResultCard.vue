<template>
	<div class="result-card bg-[#F2F3F6] p-[32px] h-full min-h-[472px] rounded-tr-[8px] rounded-br-[8px]">
		<p class="text-md text-color-primary mb-[16px] font-semibold">Result</p>
		<div class="result-card-inner bg-white p-[24px] h-[364px]">
			<p class="mb-[24px] text-sm text-[#5A5B5D]">From Node Name = “{{ fromNode }}”, To Node Name = “{{ toNode }}”: {{ nodeNames?.join(", ") }}</p>
			<p class="text-sm text-[#5A5B5D]">Total Distance: {{ distance }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "ResultCard",
	props: {
		distance: {
			type: Number,
			required: false,
		},
		fromNode: String,
		nodeNames: Array as PropType<string[]>,
		toNode: String,
	},
});
</script>
