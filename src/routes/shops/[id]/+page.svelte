<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data } = $props();
	let { shop, products } = $derived(data);
</script>

<svelte:head>
	<title>{shop.name} — ShopShop</title>
</svelte:head>

<div class="banner" style="background-image: url('{shop.bannerImage}')">
	<div class="banner-overlay">
		<div class="inner">
			<h1>{shop.name}</h1>
			<p>{shop.description}</p>
		</div>
	</div>
</div>

<section class="products">
	<div class="inner">
		{#if products.length === 0}
			<p class="empty">This shop has no products yet.</p>
		{:else}
			<div class="grid">
				{#each products as product (product.id)}
					<ProductCard {product} shopName={shop.name} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.banner {
		background-size: cover;
		background-position: center;
		height: 240px;
	}

	.banner-overlay {
		height: 100%;
		background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55));
		display: flex;
		align-items: flex-end;
	}

	.inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.banner-overlay .inner {
		padding-bottom: 24px;
		width: 100%;
	}

	h1 {
		margin: 0 0 6px;
		font-size: 1.75rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.banner-overlay p {
		margin: 0;
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.95rem;
	}

	.products {
		padding: 36px 24px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 20px;
	}

	.empty {
		color: #888;
		font-size: 0.95rem;
	}
</style>
