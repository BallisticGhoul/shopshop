<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import { page } from '$app/stores';

	let user = $derived($page.data.user);
</script>

<header>
	<div class="inner">
		<a href="/" class="logo">ShopShop</a>
		<nav>
			<a href="/browse" class:active={$page.url.pathname.startsWith('/browse')}>Browse</a>
		</nav>
		<div class="right">
			{#if user}
				<a href="/dashboard" class="username">{user.username}</a>
				<form method="POST" action="/logout">
					<button type="submit" class="logout">Log out</button>
				</form>
			{:else}
				<a href="/login" class:active={$page.url.pathname === '/login'}>Log in</a>
				<a href="/register" class="register">Register</a>
			{/if}
			<a href="/cart" class="cart-link" aria-label="Cart">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
					<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
				</svg>
				{#if cart.count > 0}
					<span class="badge">{cart.count}</span>
				{/if}
			</a>
		</div>
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
		gap: 24px;
	}

	.logo {
		font-size: 1.2rem;
		font-weight: 800;
		color: #cc0000;
		text-decoration: none;
		letter-spacing: -0.03em;
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

	.right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.right a {
		font-size: 0.875rem;
		color: #444;
		text-decoration: none;
		font-weight: 500;
	}

	.right a:hover {
		color: #cc0000;
	}

	.right a.active {
		color: #cc0000;
	}

	.username {
		font-weight: 600 !important;
	}

	.register {
		background: #cc0000;
		color: #fff !important;
		padding: 6px 14px;
		border-radius: 5px;
		font-weight: 600 !important;
		transition: background 0.15s;
	}

	.register:hover {
		background: #aa0000;
	}

	.logout {
		background: none;
		border: none;
		font-size: 0.875rem;
		color: #888;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-weight: 500;
	}

	.logout:hover {
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
