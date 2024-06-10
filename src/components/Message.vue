<template>
	<div :class="wrapperClasses">
		<p :class="labelClasses">
			{{ label }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export type MessageProps = {
	label: string;
	status?: string;
};

export default defineComponent({
	name: "Message",
	props: {
		label: String,
		status: {
			type: String,
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
