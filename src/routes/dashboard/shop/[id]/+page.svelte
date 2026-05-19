<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let { shop, products } = $derived(data);

	// track which product has its edit form open
	let editingId = $state<string | null>(null);

	function toggleEdit(id: string) {
		editingId = editingId === id ? null : id;
	}

	// close edit panel when a save/delete succeeds
	$effect(() => {
		if (form?.productEditSuccess || form?.productDeleted) editingId = null;
	});
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

		<!-- Shop details -->
		<section class="section">
			<h2>Shop details</h2>
			{#if form?.editError}
				<p class="msg error">{form.editError}</p>
			{/if}
			{#if form?.editSuccess}
				<p class="msg success">Shop updated.</p>
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
				<button type="submit" class="btn-primary">Save changes</button>
			</form>
		</section>

		<!-- Products -->
		<section class="section">
			<h2>Products</h2>

			{#if form?.productError}
				<p class="msg error">{form.productError}</p>
			{/if}

			{#if products.length > 0}
				<ul class="products">
					{#each products as product (product.id)}
						<li class="product-item" class:open={editingId === product.id}>
							<!-- Collapsed row -->
							<div class="product-row">
								<div
									class="thumb"
									style={product.image ? `background-image: url('${product.image}')` : ''}
								></div>
								<div class="product-info">
									<span class="product-name">{product.name}</span>
									<span class="product-meta">${product.price.toFixed(2)} · {product.stock} in stock</span>
								</div>
								<button
									type="button"
									class="edit-toggle"
									onclick={() => toggleEdit(product.id)}
								>
									{editingId === product.id ? 'Close' : 'Edit'}
								</button>
							</div>

							<!-- Expanded edit form -->
							{#if editingId === product.id}
								<div class="product-edit">
									{#if form?.productEditError && form?.productEditId === product.id}
										<p class="msg error">{form.productEditError}</p>
									{/if}
									{#if form?.productEditSuccess && form?.productEditId === product.id}
										<p class="msg success">Product updated.</p>
									{/if}
									<form method="POST" action="?/editProduct" use:enhance class="edit-form">
										<input type="hidden" name="productId" value={product.id} />
										<div class="edit-row">
											<label>
												Name
												<input type="text" name="name" value={product.name} required maxlength="100" />
											</label>
											<label class="narrow">
												Price ($)
												<input type="number" name="price" value={product.price} required min="0" step="0.01" />
											</label>
											<label class="narrow">
												Stock
												<input type="number" name="stock" value={product.stock} required min="0" step="1" />
											</label>
										</div>
										<label>
											Description
											<input type="text" name="description" value={product.description} maxlength="200" placeholder="Optional" />
										</label>
										<label>
											Image URL <span class="optional">(optional)</span>
											<input type="url" name="image" value={product.image} placeholder="https://..." />
										</label>
										<div class="edit-actions">
											<button type="submit" class="btn-primary">Save product</button>
											<form
												method="POST"
												action="?/deleteProduct"
												use:enhance
												onsubmit={(e) => {
													if (!confirm('Delete this product?')) e.preventDefault();
												}}
												style="margin: 0"
											>
												<input type="hidden" name="productId" value={product.id} />
												<button type="submit" class="btn-danger-outline">Delete product</button>
											</form>
										</div>
									</form>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="empty">No products yet.</p>
			{/if}

			<!-- Add product -->
			<details class="add-product">
				<summary>+ Add product</summary>
				<form method="POST" action="?/addProduct" use:enhance class="product-form">
					{#if form?.productSuccess}
						<p class="msg success">Product added.</p>
					{/if}
					<div class="edit-row">
						<label>
							Name
							<input type="text" name="name" required maxlength="100" />
						</label>
						<label class="narrow">
							Price ($)
							<input type="number" name="price" required min="0" step="0.01" placeholder="0.00" />
						</label>
						<label class="narrow">
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
					<button type="submit" class="btn-primary">Add product</button>
				</form>
			</details>
		</section>

		<!-- Danger zone — always last -->
		<section class="section danger-zone">
			<h2>Danger zone</h2>
			<p class="danger-desc">Permanently delete this shop and all its products. This cannot be undone.</p>
			<form
				method="POST"
				action="?/deleteShop"
				use:enhance
				onsubmit={(e) => {
					if (!confirm('Delete this shop and all its products? This cannot be undone.'))
						e.preventDefault();
				}}
			>
				<button type="submit" class="btn-danger-outline">Delete shop</button>
			</form>
		</section>
	</div>
</div>

<style>
	.page {
		padding: 40px 24px;
	}

	.inner {
		max-width: 700px;
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

	.back:hover { color: #444; }

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

	textarea { resize: vertical; }

	.msg {
		border-radius: 6px;
		padding: 9px 12px;
		font-size: 0.85rem;
		margin-bottom: 4px;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #ffcccc;
		color: #cc0000;
	}

	.success {
		background: #f0fff0;
		border: 1px solid #b3e6b3;
		color: #2a7a2a;
	}

	.btn-primary {
		align-self: flex-start;
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 10px 20px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
		transition: background 0.15s;
	}

	.btn-primary:hover { background: #aa0000; }

	.btn-danger-outline {
		background: #fff;
		color: #cc0000;
		border: 1px solid #cc0000;
		border-radius: 6px;
		padding: 9px 18px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
		transition: background 0.15s, color 0.15s;
	}

	.btn-danger-outline:hover {
		background: #cc0000;
		color: #fff;
	}

	/* Product list */
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

	.product-item {
		border: 1px solid #eee;
		border-radius: 8px;
		overflow: hidden;
		background: #fafafa;
	}

	.product-item.open {
		border-color: #ddd;
		background: #fff;
	}

	.product-row {
		display: flex;
		align-items: center;
		gap: 12px;
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
		padding: 8px 0;
	}

	.product-name {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.product-meta {
		font-size: 0.78rem;
		color: #888;
	}

	.edit-toggle {
		background: none;
		border: none;
		color: #cc0000;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0 16px;
		font-family: inherit;
	}

	.edit-toggle:hover { text-decoration: underline; }

	.product-edit {
		border-top: 1px solid #eee;
		padding: 16px;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.edit-row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 12px;
	}

	.narrow { width: 100px; }

	.edit-actions {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-top: 4px;
	}

	/* Add product */
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
	}

	.add-product[open] summary { margin-bottom: 16px; }

	.add-product summary::-webkit-details-marker { display: none; }

	.product-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* Danger zone */
	.danger-zone {
		border-color: #ffd0d0;
	}

	.danger-zone h2 { color: #cc0000; }

	.danger-desc {
		margin: -12px 0 16px;
		font-size: 0.85rem;
		color: #888;
	}
</style>
