<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ShopCard from '$lib/components/ShopCard.svelte';

	let { data } = $props();
	let { user, shops } = $derived(data);
</script>

<svelte:head>
	<title>For You — ShopShop</title>
</svelte:head>

<section class="header">
	<div class="inner">
		<div class="top">
			<div>
				<h1>For You</h1>
				<p>A handful of shops picked just for you, {user.username}.</p>
			</div>
			<button type="button" class="shuffle-btn" data-testid="for-you-shuffle" onclick={() => invalidateAll()}>
				Shuffle
			</button>
		</div>
	</div>
</section>

<section class="shops">
	<div class="inner">
		{#if shops.length === 0}
			<p class="empty" data-testid="for-you-empty">
				No shops to recommend yet. <a href="/dashboard/shop/new">Create the first one!</a>
			</p>
		{:else}
			<div class="grid" data-testid="for-you-grid">
				{#each shops as shop (shop.id)}
					<ShopCard {shop} />
				{/each}
			</div>
		{/if}
	</div>
</section>

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

	.top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}

	h1 {
		margin: 0 0 4px;
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.top p {
		margin: 0;
		font-size: 0.875rem;
		color: #888;
	}

	.shuffle-btn {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 10px 18px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
		transition: background 0.15s;
	}

	.shuffle-btn:hover {
		background: #aa0000;
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
