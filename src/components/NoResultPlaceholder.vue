<template>
	<div className='flex items-center justify-center w-full h-full md:py-[40px]'>
      <img :src="noResultBG" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import noResultBG from '@@/noresultbg.svg'

export default defineComponent({
	name: "NoResultPlaceholder",
	computed: {
		noResultBG() {
			return noResultBG;
		}
	}
});
</script>
