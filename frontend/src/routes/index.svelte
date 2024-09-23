<script lang="ts">
	import BrushSelector from "$lib/BrushSelector.svelte";
	import DrawingCanvas from "$lib/DrawingCanvas.svelte";
</script>

<div class="max-w-screen-md mx-auto px-3 py-5 relative z-0">
	<article class="prose">
		<h1>Seg2Sat Demo</h1>
	</article>

	<BrushSelector />
	<div>
		<DrawingCanvas />
	</div>
</div>

<style lang="postcss" scoped>
	button {
		@apply p-1 disabled:opacity-50 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-50 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500;
	}
</style>
