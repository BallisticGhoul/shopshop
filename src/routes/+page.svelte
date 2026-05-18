<script lang="ts">
	import ShopCard from '$lib/components/ShopCard.svelte';
	import { mockShops } from '$lib/mock';
</script>

<svelte:head>
	<title>ShopShop — Browse Shops</title>
</svelte:head>

<section class="hero">
	<div class="inner">
		<h1>Discover unique shops</h1>
		<p>Browse handpicked collections from independent sellers.</p>
	</div>
</section>

<section class="shops">
	<div class="inner">
		<div class="grid">
			{#each mockShops as shop (shop.id)}
				<ShopCard {shop} />
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		background: #fff;
		border-bottom: 1px solid #e8e8e8;
		padding: 48px 24px;
	}

	.inner {
		max-width: 1100px;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 8px;
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a1a;
		letter-spacing: -0.03em;
	}

	.hero p {
		margin: 0;
		font-size: 1rem;
		color: #666;
	}

	.shops {
		padding: 40px 24px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
	}
</style>
