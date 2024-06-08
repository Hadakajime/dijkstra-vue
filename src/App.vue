<template>
	<div className="w-full h-screen cal">
		<div className="cal-header bg-color-primary w-full flex h-[377px] pt-[80px] justify-start flex-col items-center md:h-[340px] md:pt-[40px]">
			<h1 className="text-heading1 mt-[0] mb-[16px] text-white text-center md:text-[28px] md:mb-[4px]">Dijkstra’s Algorithm Calculator</h1>
			<p className="text-base text-white text-center mb-[24px] md:text-sm md:max-w-[300px]">Discovering Optimal Routes Through Nodes Using Dijkstra's Method</p>
		</div>

		<div className="cal-body h-[calc(100%-377px)] bg-[#E7F3FF] flex items-start justify-center md:w-full md:h-[calc(100%-30px)]">
			<CalculatorCard />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
	name: "App",
	components: {
		CalculatorCard: defineAsyncComponent(() => import("./components/CalculatorCard.vue")),
	},
});
</script>
