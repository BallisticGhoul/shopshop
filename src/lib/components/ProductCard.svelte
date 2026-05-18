<script lang="ts">
	import type { Product } from '$lib/types';
	import { cart } from '$lib/stores/cart.svelte';

	let { product, shopName }: { product: Product; shopName: string } = $props();

	let added = $state(false);

	function addToCart() {
		if (product.stock === 0) return;
		cart.add(product, shopName);
		added = true;
		setTimeout(() => (added = false), 1200);
	}
</script>

<div class="card">
	<div class="image">
		<img src={product.image} alt={product.name} loading="lazy" />
		{#if product.stock === 0}
			<span class="sold-out">Sold out</span>
		{/if}
	</div>
	<div class="body">
		<h4>{product.name}</h4>
		<p>{product.description}</p>
		<div class="footer">
			<span class="price">${product.price.toFixed(2)}</span>
			<button
				onclick={addToCart}
				disabled={product.stock === 0}
				class:success={added}
			>
				{added ? 'Added!' : 'Add to cart'}
			</button>
		</div>
	</div>
</div>

<style>
	.card {
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.image {
		position: relative;
		height: 200px;
		background: #f5f5f5;
		overflow: hidden;
	}

	.image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.sold-out {
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 700;
		color: #888;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.body {
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}

	h4 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	p {
		margin: 0;
		font-size: 0.8rem;
		color: #666;
		line-height: 1.4;
		flex: 1;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10px;
	}

	.price {
		font-size: 1rem;
		font-weight: 700;
		color: #1a1a1a;
	}

	button {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 7px 14px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
		min-width: 96px;
	}

	button:hover:not(:disabled) {
		background: #aa0000;
	}

	button:disabled {
		background: #ddd;
		color: #999;
		cursor: default;
	}

	button.success {
		background: #2a7a2a;
	}
</style>
