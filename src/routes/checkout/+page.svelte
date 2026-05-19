<script lang="ts">
	import { enhance } from '$app/forms';
	import { cart } from '$lib/stores/cart.svelte';

	let { form } = $props();

	let name = $state('');
	let address = $state('');

	let cartJson = $derived(
		JSON.stringify(cart.items.map((i) => ({ shopId: i.product.shopId, id: i.product.id, quantity: i.quantity })))
	);

	function handleSuccess() {
		cart.clear();
	}
</script>

<svelte:head>
	<title>Checkout — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="inner">
		{#if form?.success}
			<div class="success">
				<div class="icon">✓</div>
				<h1>Order placed!</h1>
				<p>
					Thanks, {form.customerName}! Your order has been received. Nothing was actually charged — this is a
					demo.
				</p>
				<a href="/">Back to browsing</a>
			</div>
		{:else if cart.items.length === 0 && !form?.success}
			<div class="empty">
				<p>Nothing in your cart.</p>
				<a href="/">Browse shops</a>
			</div>
		{:else}
			<h1>Checkout</h1>
			<div class="layout">
				<form
					method="POST"
					use:enhance={() => {
						return ({ result, update }) => {
							if (result.type === 'success') handleSuccess();
							update();
						};
					}}
				>
					<input type="hidden" name="items" value={cartJson} />

					<div class="section">
						<h2>Your details</h2>
						{#if form?.error}
							<p class="error">{form.error}</p>
						{/if}
						<label>
							Name
							<input type="text" name="name" bind:value={name} required placeholder="Your name" />
						</label>
						<label>
							Shipping address
							<input type="text" name="address" bind:value={address} required placeholder="123 Example St" />
						</label>
					</div>

					<div class="notice">
						<strong>Heads up:</strong> This is a demo. No real order will be placed and no money will be charged.
					</div>

					<button type="submit" disabled={!name.trim() || !address.trim()}>
						Place order
					</button>
				</form>

				<div class="order-summary">
					<h2>Order summary</h2>
					<ul>
						{#each cart.items as item (item.product.id)}
							<li>
								<span class="item-name">{item.product.name} <em>×{item.quantity}</em></span>
								<span>${(item.product.price * item.quantity).toFixed(2)}</span>
							</li>
						{/each}
					</ul>
					<div class="total-row">
						<span>Total</span>
						<!-- bug 7: raw float, no rounding -->
					<span class="total">${cart.total}</span>
					</div>
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
		max-width: 820px;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 28px;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.layout {
		display: flex;
		gap: 32px;
		align-items: flex-start;
	}

	form {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.section {
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	h2 {
		margin: 0 0 4px;
		font-size: 0.95rem;
		font-weight: 700;
		color: #1a1a1a;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.85rem;
		font-weight: 500;
		color: #444;
	}

	input {
		border: 1px solid #e0e0e0;
		border-radius: 5px;
		padding: 9px 12px;
		font-size: 0.9rem;
		outline: none;
		transition: border-color 0.15s;
		font-family: inherit;
	}

	input:focus {
		border-color: #cc0000;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 9px 12px;
		font-size: 0.85rem;
		color: #cc0000;
		margin: 0;
	}

	.notice {
		background: #fff9e6;
		border: 1px solid #f0d060;
		border-radius: 6px;
		padding: 12px 14px;
		font-size: 0.82rem;
		color: #664400;
	}

	button[type='submit'] {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 13px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	button[type='submit']:hover:not(:disabled) {
		background: #aa0000;
	}

	button[type='submit']:disabled {
		background: #ddd;
		color: #999;
		cursor: default;
	}

	.order-summary {
		width: 260px;
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		padding: 20px;
	}

	.order-summary h2 {
		margin-bottom: 12px;
	}

	ul {
		list-style: none;
		margin: 0 0 16px;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	li {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
	}

	.item-name {
		color: #444;
	}

	.item-name em {
		font-style: normal;
		color: #aaa;
	}

	.total-row {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid #e8e8e8;
		padding-top: 12px;
		font-size: 0.9rem;
	}

	.total {
		font-size: 1.1rem;
		font-weight: 700;
	}

	.success {
		text-align: center;
		padding: 80px 20px;
	}

	.icon {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #cc0000;
		color: #fff;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 20px;
	}

	.success h1 {
		margin-bottom: 10px;
	}

	.success p {
		color: #666;
		margin-bottom: 24px;
	}

	.success a,
	.empty a {
		color: #cc0000;
		font-weight: 600;
		text-decoration: none;
	}

	.empty {
		text-align: center;
		padding: 60px 0;
		color: #666;
	}

	@media (max-width: 640px) {
		.layout {
			flex-direction: column;
		}
		.order-summary {
			width: 100%;
		}
	}
</style>
