<template>
	<div :class="wrapperClasses">
		<p :class="labelClasses">
			<slot></slot>
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "Message",
	props: {
		status: {
			type: String as PropType<"error" | "success">,
			required: false,
		},
	},
	computed: {
		wrapperClasses() {
			return {
				"bg-red-50 border-red-200": this.status === "error",
				"bg-green-50 border-green-200": this.status === "success",
			};
		},
		labelClasses() {
			return {
				"text-red-800": this.status === "error",
				"text-green-800": this.status === "success",
			};
		},
	},
});
</script>
