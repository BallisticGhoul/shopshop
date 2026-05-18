<script lang="ts">
	import type { Shop } from '$lib/types';

	let { shop }: { shop: Shop } = $props();
</script>

<a href="/shops/{shop.id}" class="card">
	<div
		class="banner"
		style={shop.bannerImage ? `background-image: url('${shop.bannerImage}')` : ''}
	></div>
	<div class="body">
		<h3>{shop.name}</h3>
		<p>{shop.description}</p>
		<span class="cta">Visit shop →</span>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: box-shadow 0.15s, transform 0.15s;
	}

	.card:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.banner {
		height: 160px;
		background-color: #d8d8d8;
		background-size: cover;
		background-position: center;
	}

	.body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}

	h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		color: #666;
		line-height: 1.4;
		flex: 1;
	}

	.cta {
		font-size: 0.8rem;
		font-weight: 600;
		color: #cc0000;
		margin-top: 8px;
	}
</style>
