<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
</script>

<svelte:head>
	<title>Cart — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="inner">
		<h1>Your cart</h1>

		{#if cart.items.length === 0}
			<div class="empty">
				<p>Your cart is empty.</p>
				<a href="/">Browse shops</a>
			</div>
		{:else}
			<div class="layout">
				<ul class="items">
					{#each cart.items as item (item.product.id)}
						<li class="item">
							<div class="thumb" style={item.product.image ? `background-image: url('${item.product.image}')` : ''}></div>
							<div class="info">
								<span class="name">{item.product.name}</span>
								<span class="shop">{item.shopName}</span>
							</div>
							<div class="controls">
								<button
									aria-label="Decrease quantity"
									onclick={() => cart.setQuantity(item.product.id, item.quantity - 1)}
								>−</button>
								<span class="qty">{item.quantity}</span>
								<button
									aria-label="Increase quantity"
									disabled={item.quantity >= item.product.stock}
									onclick={() => cart.setQuantity(item.product.id, item.quantity + 1)}
								>+</button>
							</div>
							<span class="subtotal">${(item.product.price * item.quantity).toFixed(2)}</span>
							<button class="remove" aria-label="Remove" onclick={() => cart.remove(item.product.id)}>
								✕
							</button>
						</li>
					{/each}
				</ul>

				<div class="summary">
					<div class="total-row">
						<span>Total</span>
						<span class="total">${cart.total.toFixed(2)}</span>
					</div>
					<p class="disclaimer">No real money will be charged.</p>
					<a href="/checkout" class="checkout-btn">Proceed to checkout</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.page {
		padding: 40px 24px;
	}

	.inner {
		max-width: 860px;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 28px;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.empty {
		text-align: center;
		padding: 60px 0;
		color: #666;
	}

	.empty a {
		display: inline-block;
		margin-top: 12px;
		color: #cc0000;
		font-weight: 600;
		text-decoration: none;
	}

	.layout {
		display: flex;
		gap: 32px;
		align-items: flex-start;
	}

	.items {
		flex: 1;
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 16px;
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		padding: 12px 16px;
	}

	.thumb {
		width: 56px;
		height: 56px;
		flex-shrink: 0;
		border-radius: 5px;
		background-color: #d8d8d8;
		background-size: cover;
		background-position: center;
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.name {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.shop {
		font-size: 0.78rem;
		color: #888;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.controls button {
		width: 26px;
		height: 26px;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		background: #fff;
		cursor: pointer;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #444;
	}

	.controls button:hover {
		border-color: #cc0000;
		color: #cc0000;
	}

	.qty {
		font-size: 0.9rem;
		font-weight: 600;
		min-width: 20px;
		text-align: center;
	}

	.subtotal {
		font-size: 0.9rem;
		font-weight: 600;
		min-width: 60px;
		text-align: right;
	}

	.remove {
		background: none;
		border: none;
		color: #bbb;
		cursor: pointer;
		font-size: 0.8rem;
		padding: 4px;
	}

	.remove:hover {
		color: #cc0000;
	}

	.summary {
		width: 240px;
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.total-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 0.9rem;
	}

	.total {
		font-size: 1.2rem;
		font-weight: 700;
	}

	.disclaimer {
		margin: 0;
		font-size: 0.75rem;
		color: #aaa;
	}

	.checkout-btn {
		display: block;
		background: #cc0000;
		color: #fff;
		text-align: center;
		text-decoration: none;
		padding: 11px;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		transition: background 0.15s;
	}

	.checkout-btn:hover {
		background: #aa0000;
	}

	@media (max-width: 640px) {
		.layout {
			flex-direction: column;
		}
		.summary {
			width: 100%;
		}
	}
</style>
