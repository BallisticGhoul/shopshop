<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let { shop, products } = $derived(data);
</script>

<svelte:head>
	<title>Edit {shop.name} — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="inner">
		<div class="top">
			<div>
				<a href="/dashboard" class="back">← Dashboard</a>
				<h1>{shop.name}</h1>
			</div>
			<a href="/shops/{shop.id}" class="view-btn">View shop →</a>
		</div>

		<section class="section">
			<h2>Shop details</h2>
			{#if form?.editError}
				<p class="error">{form.editError}</p>
			{/if}
			{#if form?.editSuccess}
				<p class="success">Shop updated.</p>
			{/if}
			<form method="POST" action="?/editShop" use:enhance>
				<label>
					Shop name
					<input type="text" name="name" value={shop.name} required maxlength="80" />
				</label>
				<label>
					Description
					<textarea name="description" required maxlength="300" rows="3">{shop.description}</textarea>
				</label>
				<label>
					Banner image URL <span class="optional">(optional)</span>
					<input type="url" name="bannerImage" value={shop.bannerImage} placeholder="https://..." />
				</label>
				<button type="submit">Save changes</button>
			</form>
		</section>

		<section class="section">
			<h2>Products</h2>

			{#if form?.productError}
				<p class="error">{form.productError}</p>
			{/if}

			{#if products.length > 0}
				<ul class="products">
					{#each products as product (product.id)}
						<li>
							<div
								class="thumb"
								style={product.image ? `background-image: url('${product.image}')` : ''}
							></div>
							<div class="product-info">
								<span class="product-name">{product.name}</span>
								<span class="product-meta">${product.price.toFixed(2)} · {product.stock} in stock</span>
							</div>
							<form method="POST" action="?/deleteProduct" use:enhance>
								<input type="hidden" name="productId" value={product.id} />
								<button type="submit" class="delete-btn">Remove</button>
							</form>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="empty">No products yet.</p>
			{/if}

			<details class="add-product">
				<summary>+ Add product</summary>
				<form method="POST" action="?/addProduct" use:enhance class="product-form">
					<div class="row">
						<label>
							Name
							<input type="text" name="name" required maxlength="100" />
						</label>
						<label>
							Price ($)
							<input type="number" name="price" required min="0" step="0.01" placeholder="0.00" />
						</label>
						<label>
							Stock
							<input type="number" name="stock" required min="0" step="1" placeholder="0" />
						</label>
					</div>
					<label>
						Description
						<input type="text" name="description" maxlength="200" placeholder="Optional" />
					</label>
					<label>
						Image URL <span class="optional">(optional)</span>
						<input type="url" name="image" placeholder="https://..." />
					</label>
					<button type="submit">Add product</button>
				</form>
			</details>
		</section>
	</div>
</div>

<style>
	.page {
		padding: 40px 24px;
	}

	.inner {
		max-width: 680px;
		margin: 0 auto;
	}

	.top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 36px;
		gap: 16px;
	}

	.back {
		display: block;
		font-size: 0.8rem;
		color: #888;
		text-decoration: none;
		margin-bottom: 6px;
	}

	.back:hover {
		color: #444;
	}

	h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.view-btn {
		font-size: 0.875rem;
		font-weight: 600;
		color: #cc0000;
		text-decoration: none;
		white-space: nowrap;
		padding-top: 4px;
	}

	.section {
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 10px;
		padding: 28px;
		margin-bottom: 24px;
	}

	h2 {
		margin: 0 0 20px;
		font-size: 1rem;
		font-weight: 700;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 0.85rem;
		font-weight: 500;
		color: #444;
	}

	.optional {
		font-weight: 400;
		color: #aaa;
	}

	input,
	textarea {
		border: 1px solid #e0e0e0;
		border-radius: 5px;
		padding: 9px 12px;
		font-size: 0.9rem;
		font-family: inherit;
		outline: none;
		transition: border-color 0.15s;
		background: #fff;
	}

	input:focus,
	textarea:focus {
		border-color: #cc0000;
	}

	textarea {
		resize: vertical;
	}

	button[type='submit'] {
		align-self: flex-start;
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 10px 20px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	button[type='submit']:hover {
		background: #aa0000;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 9px 12px;
		font-size: 0.85rem;
		color: #cc0000;
		margin-bottom: 4px;
	}

	.success {
		background: #f0fff0;
		border: 1px solid #b3e6b3;
		border-radius: 6px;
		padding: 9px 12px;
		font-size: 0.85rem;
		color: #2a7a2a;
		margin-bottom: 4px;
	}

	.empty {
		font-size: 0.875rem;
		color: #888;
		margin: 0 0 16px;
	}

	.products {
		list-style: none;
		margin: 0 0 20px;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.products li {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fafafa;
		border: 1px solid #eee;
		border-radius: 7px;
		overflow: hidden;
	}

	.thumb {
		width: 56px;
		height: 48px;
		flex-shrink: 0;
		background-color: #d8d8d8;
		background-size: cover;
		background-position: center;
	}

	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.product-name {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.product-meta {
		font-size: 0.78rem;
		color: #888;
	}

	.delete-btn {
		background: none;
		border: none;
		color: #aaa;
		font-size: 0.8rem;
		cursor: pointer;
		padding: 0 16px;
		font-family: inherit;
		transition: color 0.15s;
	}

	.delete-btn:hover {
		color: #cc0000;
	}

	.add-product {
		border-top: 1px solid #eee;
		padding-top: 16px;
	}

	.add-product summary {
		font-size: 0.875rem;
		font-weight: 600;
		color: #cc0000;
		cursor: pointer;
		user-select: none;
		list-style: none;
		margin-bottom: 0;
	}

	.add-product[open] summary {
		margin-bottom: 16px;
	}

	.add-product summary::-webkit-details-marker {
		display: none;
	}

	.product-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 12px;
	}

	.row label:nth-child(2),
	.row label:nth-child(3) {
		width: 100px;
	}
</style>
