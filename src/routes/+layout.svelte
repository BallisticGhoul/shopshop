<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ShopShop</title>
</svelte:head>

<Header />

<main>
	{@render children()}
</main>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f5f5f5;
		color: #1a1a1a;
		-webkit-font-smoothing: antialiased;
	}

	:global(a) {
		color: inherit;
	}

	main {
		min-height: calc(100vh - 60px);
	}
</style>
