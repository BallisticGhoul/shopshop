<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { SORT_OPTIONS } from '$lib/products';

	let { data } = $props();
	let { shop, products, sort, inStockOnly, totalProducts } = $derived(data);

	let form: HTMLFormElement;

	/**
	 * Submit as soon as a control changes, so the toolbar feels live. It stays a
	 * plain GET form, so the Apply button still works before hydration.
	 */
	function apply() {
		form.requestSubmit();
	}
</script>

<svelte:head>
	<title>{shop.name} — ShopShop</title>
</svelte:head>

<div class="banner" style={shop.bannerImage ? `background-image: url('${shop.bannerImage}')` : ''}>
	<div class="banner-overlay">
		<div class="inner">
			<h1>{shop.name}</h1>
			<p>{shop.description}</p>
		</div>
	</div>
</div>

<section class="products">
	<div class="inner">
		{#if totalProducts > 0}
			<form method="GET" class="toolbar" data-testid="product-toolbar" bind:this={form}>
				<label class="field">
					<span>Sort by</span>
					<select name="sort" value={sort} data-testid="sort-select" onchange={apply}>
						{#each SORT_OPTIONS as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</label>

				<label class="check">
					<input
						type="checkbox"
						name="instock"
						value="1"
						checked={inStockOnly}
						data-testid="instock-toggle"
						onchange={apply}
					/>
					<span>In stock only</span>
				</label>

				<button type="submit" class="apply">Apply</button>

				<p class="count" data-testid="product-count">
					Showing {products.length} of {totalProducts} product{totalProducts !== 1 ? 's' : ''}
				</p>
			</form>
		{/if}

		{#if totalProducts === 0}
			<p class="empty">This shop has no products yet.</p>
		{:else if products.length === 0}
			<p class="empty" data-testid="no-matches">
				No products match the current filters.
				<a href="/shops/{shop.id}">Reset filters</a>
			</p>
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
		background-color: #d0d0d0;
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

	.toolbar {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid #e8e8e8;
	}

	.field {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #666;
	}

	.field select {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 7px 10px;
		font-size: 0.85rem;
		font-family: inherit;
		background: #fff;
		color: #1a1a1a;
		cursor: pointer;
	}

	.field select:focus {
		outline: none;
		border-color: #cc0000;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.85rem;
		color: #666;
		cursor: pointer;
	}

	.check input {
		accent-color: #cc0000;
		cursor: pointer;
	}

	.apply {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 7px 16px;
		font-size: 0.8rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: background 0.15s;
	}

	.apply:hover {
		background: #aa0000;
	}

	.count {
		margin: 0 0 0 auto;
		font-size: 0.85rem;
		color: #888;
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

	.empty a {
		color: #cc0000;
		font-weight: 600;
		text-decoration: none;
	}
</style>
