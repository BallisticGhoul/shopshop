<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import { page } from '$app/stores';
</script>

<header>
	<div class="inner">
		<a href="/" class="logo">ShopShop</a>
		<nav>
			<a href="/" class:active={$page.url.pathname === '/'}>Browse</a>
		</nav>
		<a href="/cart" class="cart-link" aria-label="Cart">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
				<line x1="3" y1="6" x2="21" y2="6"/>
				<path d="M16 10a4 4 0 0 1-8 0"/>
			</svg>
			{#if cart.count > 0}
				<span class="badge">{cart.count}</span>
			{/if}
		</a>
	</div>
</header>

<style>
	header {
		background: #fff;
		border-bottom: 1px solid #e8e8e8;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 24px;
		height: 60px;
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.logo {
		font-size: 1.25rem;
		font-weight: 700;
		color: #cc0000;
		text-decoration: none;
		letter-spacing: -0.02em;
		margin-right: auto;
	}

	nav a {
		font-size: 0.9rem;
		color: #444;
		text-decoration: none;
		font-weight: 500;
	}

	nav a:hover,
	nav a.active {
		color: #cc0000;
	}

	.cart-link {
		position: relative;
		color: #444;
		display: flex;
		align-items: center;
	}

	.cart-link:hover {
		color: #cc0000;
	}

	.badge {
		position: absolute;
		top: -6px;
		right: -8px;
		background: #cc0000;
		color: #fff;
		font-size: 0.65rem;
		font-weight: 700;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
