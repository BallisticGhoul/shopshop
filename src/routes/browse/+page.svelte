<script lang="ts">
	import ShopCard from '$lib/components/ShopCard.svelte';

	let { data } = $props();
	let { shops, currentPage, totalPages } = $derived(data);

	function pageUrl(p: number) {
		return `/browse?page=${p}`;
	}
</script>

<svelte:head>
	<title>Browse Shops — ShopShop</title>
</svelte:head>

<section class="header">
	<div class="inner">
		<h1>Browse Shops</h1>
		<p>{totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : `${shops.length} shops`}</p>
	</div>
</section>

{#if totalPages > 1}
	<div class="pagination-bar top">
		<div class="inner">
			<div class="pagination">
				{#if currentPage > 1}
					<a href={pageUrl(currentPage - 1)} class="arrow">← Previous</a>
				{:else}
					<span class="arrow disabled">← Previous</span>
				{/if}
				<div class="pages">
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
						<a href={pageUrl(p)} class:active={p === currentPage}>{p}</a>
					{/each}
				</div>
				{#if currentPage < totalPages}
					<a href={pageUrl(currentPage + 1)} class="arrow">Next →</a>
				{:else}
					<span class="arrow disabled">Next →</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<section class="shops">
	<div class="inner">
		{#if shops.length === 0}
			<p class="empty">No shops yet. <a href="/dashboard/shop/new">Create the first one!</a></p>
		{:else}
			<div class="grid">
				{#each shops as shop (shop.id)}
					<ShopCard {shop} />
				{/each}
			</div>
		{/if}
	</div>
</section>

{#if totalPages > 1}
	<div class="pagination-bar bottom">
		<div class="inner">
			<div class="pagination">
				{#if currentPage > 1}
					<a href={pageUrl(currentPage - 1)} class="arrow">← Previous</a>
				{:else}
					<span class="arrow disabled">← Previous</span>
				{/if}
				<div class="pages">
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
						<a href={pageUrl(p)} class:active={p === currentPage}>{p}</a>
					{/each}
				</div>
				{#if currentPage < totalPages}
					<a href={pageUrl(currentPage + 1)} class="arrow">Next →</a>
				{:else}
					<span class="arrow disabled">Next →</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.header {
		background: #fff;
		border-bottom: 1px solid #e8e8e8;
		padding: 36px 24px 28px;
	}

	.inner {
		max-width: 1100px;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 4px;
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.header p {
		margin: 0;
		font-size: 0.875rem;
		color: #888;
	}

	.pagination-bar {
		padding: 14px 24px;
		background: #fff;
		border-bottom: 1px solid #e8e8e8;
	}

	.pagination-bar.bottom {
		border-bottom: none;
		border-top: 1px solid #e8e8e8;
		margin-top: 8px;
	}

	.pagination {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.arrow {
		font-size: 0.875rem;
		font-weight: 600;
		color: #cc0000;
		text-decoration: none;
	}

	.arrow:hover {
		text-decoration: underline;
	}

	.arrow.disabled {
		color: #ccc;
		cursor: default;
	}

	.pages {
		display: flex;
		gap: 6px;
	}

	.pages a {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		color: #444;
		border: 1px solid transparent;
	}

	.pages a:hover {
		border-color: #e0e0e0;
	}

	.pages a.active {
		background: #cc0000;
		color: #fff;
	}

	.shops {
		padding: 32px 24px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
	}

	.empty {
		color: #888;
		font-size: 0.95rem;
		padding: 40px 0;
		text-align: center;
	}

	.empty a {
		color: #cc0000;
		font-weight: 600;
		text-decoration: none;
	}
</style>
