<script lang="ts">
	let { data } = $props();
	let { user, shops } = $derived(data);
</script>

<svelte:head>
	<title>Dashboard — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="inner">
		<div class="top">
			<div>
				<h1>Welcome, {user.username}</h1>
				<p>Manage your shops below.</p>
			</div>
			<a href="/dashboard/shop/new" class="new-btn">+ New Shop</a>
		</div>

		{#if shops.length === 0}
			<div class="empty">
				<p>You haven't created any shops yet.</p>
				<a href="/dashboard/shop/new">Create your first shop →</a>
			</div>
		{:else}
			<ul class="shops">
				{#each shops as shop (shop.id)}
					<li>
						<div class="banner" style="background-image: url('{shop.bannerImage || ''}')"></div>
						<div class="info">
							<span class="name">{shop.name}</span>
							<span class="desc">{shop.description}</span>
						</div>
						<div class="shop-actions">
							<a href="/shops/{shop.id}">View</a>
						</div>
					</li>
				{/each}
			</ul>
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

	.top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 32px;
		gap: 16px;
	}

	h1 {
		margin: 0 0 4px;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.top p {
		margin: 0;
		font-size: 0.875rem;
		color: #666;
	}

	.new-btn {
		background: #cc0000;
		color: #fff;
		text-decoration: none;
		padding: 10px 18px;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
		transition: background 0.15s;
	}

	.new-btn:hover {
		background: #aa0000;
	}

	.empty {
		text-align: center;
		padding: 60px 0;
		color: #666;
	}

	.empty a {
		color: #cc0000;
		font-weight: 600;
		text-decoration: none;
		display: block;
		margin-top: 8px;
	}

	.shops {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	li {
		display: flex;
		align-items: center;
		gap: 16px;
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		overflow: hidden;
	}

	.banner {
		width: 80px;
		height: 64px;
		flex-shrink: 0;
		background: #f0f0f0;
		background-size: cover;
		background-position: center;
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 4px 0;
	}

	.name {
		font-size: 0.95rem;
		font-weight: 600;
	}

	.desc {
		font-size: 0.8rem;
		color: #888;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 400px;
	}

	.shop-actions {
		padding: 0 16px;
	}

	.shop-actions a {
		font-size: 0.85rem;
		font-weight: 600;
		color: #cc0000;
		text-decoration: none;
	}
</style>
