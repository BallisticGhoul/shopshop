<script lang="ts">
	import ShopCard from '$lib/components/ShopCard.svelte';

	let { data } = $props();
	let { shops, currentPage, totalPages, query, totalResults } = $derived(data);

	function pageUrl(p: number) {
		return query ? `/browse?q=${encodeURIComponent(query)}&page=${p}` : `/browse?page=${p}`;
	}
</script>

<svelte:head>
	<title>{query ? `"${query}" — Browse` : 'Browse Shops'} — ShopShop</title>
</svelte:head>

<section class="header">
	<div class="inner">
		<h1>Browse Shops</h1>
		<form method="GET" action="/browse" class="search-form">
			<input
				type="search"
				name="q"
				value={query}
				placeholder="Search shops and products…"
				class="search-input"
			/>
			<button type="submit" class="search-btn">Search</button>
			{#if query}
				<a href="/browse" class="clear-btn">Clear</a>
			{/if}
		</form>
		<p class="meta">
			{#if query}
				{totalResults} result{totalResults !== 1 ? 's' : ''} for "<strong>{query}</strong>"
				{#if totalPages > 1}· Page {currentPage} of {totalPages}{/if}
			{:else}
				{totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : `${totalResults} shop${totalResults !== 1 ? 's' : ''}`}
			{/if}
		</p>
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
			{#if query}
				<p class="empty">No shops or products matched "<strong>{query}</strong>".</p>
			{:else}
				<p class="empty">No shops yet. <a href="/dashboard/shop/new">Create the first one!</a></p>
			{/if}
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
		padding: 36px 24px 24px;
	}

	.inner {
		max-width: 1100px;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 16px;
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.search-form {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}

	.search-input {
		flex: 1;
		max-width: 420px;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 9px 14px;
		font-size: 0.9rem;
		font-family: inherit;
		outline: none;
		transition: border-color 0.15s;
	}

	.search-input:focus {
		border-color: #cc0000;
	}

	.search-btn {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 9px 18px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
		transition: background 0.15s;
	}

	.search-btn:hover {
		background: #aa0000;
	}

	.clear-btn {
		font-size: 0.85rem;
		color: #888;
		text-decoration: none;
	}

	.clear-btn:hover {
		color: #444;
	}

	.meta {
		margin: 0;
		font-size: 0.875rem;
		color: #888;
	}

	.meta strong {
		color: #333;
		font-weight: 600;
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

	.arrow:hover { text-decoration: underline; }

	.arrow.disabled {
		color: #ccc;
		cursor: default;
	}

	.pages { display: flex; gap: 6px; }

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

	.pages a:hover { border-color: #e0e0e0; }
	.pages a.active { background: #cc0000; color: #fff; }

	.shops { padding: 32px 24px; }

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

	.empty strong {
		color: #555;
	}
</style>
