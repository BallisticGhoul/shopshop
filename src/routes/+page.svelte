<script lang="ts">
	import { page } from '$app/stores';

	let { data } = $props();
	let user = $derived(data.user);
</script>

<svelte:head>
	<title>ShopShop</title>
</svelte:head>

<div class="hero">
	<div class="inner">
		<div class="logo-mark">
			<img src="/logo-white-on-red.svg" alt="ShopShop logo" />
		</div>
		<h1>ShopShop</h1>
		<p>Create and discover unique online shops.</p>

		{#if user}
			<p class="welcome">Welcome back, <strong>{user.username}</strong>.</p>
			<div class="actions">
				<a href="/browse" class="btn primary">Browse Shops</a>
				<a href="/dashboard" class="btn secondary">My Dashboard</a>
				<a href="/dashboard/shop/new" class="btn secondary">Create a Shop</a>
			</div>
		{:else}
			<div class="actions">
				<a href="/browse" class="btn primary">Browse Shops</a>
				<a href="/login" class="btn secondary">Log In</a>
				<a href="/dashboard/shop/new" class="btn outline">Create a Shop</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.hero {
		min-height: calc(100vh - 60px);
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		padding: 40px 24px;
	}

	.inner {
		text-align: center;
		max-width: 480px;
	}

	.logo-mark {
		width: 88px;
		height: 88px;
		margin: 0 auto 24px;
		border-radius: 20px;
		overflow: hidden;
	}

	.logo-mark svg {
		width: 100%;
		height: 100%;
	}

	h1 {
		margin: 0 0 10px;
		font-size: 2.8rem;
		font-weight: 800;
		color: #1a1a1a;
		letter-spacing: -0.04em;
	}

	.hero > .inner > p {
		margin: 0 0 28px;
		font-size: 1.05rem;
		color: #666;
	}

	.welcome {
		margin: -16px 0 20px !important;
		font-size: 0.9rem !important;
		color: #444 !important;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		align-items: center;
	}

	.btn {
		display: inline-block;
		width: 220px;
		padding: 13px 0;
		border-radius: 8px;
		font-size: 0.95rem;
		font-weight: 600;
		text-decoration: none;
		text-align: center;
		transition: background 0.15s, border-color 0.15s;
	}

	.btn.primary {
		background: #cc0000;
		color: #fff;
	}

	.btn.primary:hover {
		background: #aa0000;
	}

	.btn.secondary {
		background: #f5f5f5;
		color: #1a1a1a;
	}

	.btn.secondary:hover {
		background: #e8e8e8;
	}

	.btn.outline {
		background: transparent;
		color: #cc0000;
		border: 2px solid #cc0000;
		padding: 11px 0;
	}

	.btn.outline:hover {
		background: #cc0000;
		color: #fff;
	}
</style>
