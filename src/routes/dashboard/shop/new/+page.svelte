<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>New Shop — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="inner">
		<a href="/dashboard" class="back">← Back to dashboard</a>
		<h1>Create a new shop</h1>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<label>
				Shop name <span class="req">*</span>
				<input
					type="text"
					name="name"
					required
					maxlength="80"
					placeholder="e.g. The Cozy Corner"
					value={form?.name ?? ''}
				/>
			</label>
			<label>
				Description <span class="req">*</span>
				<textarea
					name="description"
					required
					maxlength="300"
					rows="3"
					placeholder="A short description of what your shop sells."
				>{form?.description ?? ''}</textarea>
			</label>
			<label>
				Banner image URL
				<input
					type="url"
					name="bannerImage"
					placeholder="https://example.com/image.jpg"
					value={form?.bannerImage ?? ''}
				/>
				<span class="hint">Optional. Paste a link to an image for your shop banner.</span>
			</label>
			<button type="submit">Create shop</button>
		</form>
	</div>
</div>

<style>
	.page {
		padding: 40px 24px;
	}

	.inner {
		max-width: 520px;
		margin: 0 auto;
	}

	.back {
		display: inline-block;
		font-size: 0.85rem;
		color: #666;
		text-decoration: none;
		margin-bottom: 20px;
	}

	.back:hover {
		color: #cc0000;
	}

	h1 {
		margin: 0 0 28px;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	form {
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 10px;
		padding: 28px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.85rem;
		font-weight: 500;
		color: #444;
	}

	.req {
		color: #cc0000;
	}

	input,
	textarea {
		border: 1px solid #e0e0e0;
		border-radius: 5px;
		padding: 10px 12px;
		font-size: 0.9rem;
		outline: none;
		font-family: inherit;
		transition: border-color 0.15s;
		resize: vertical;
	}

	input:focus,
	textarea:focus {
		border-color: #cc0000;
	}

	.hint {
		font-size: 0.78rem;
		color: #aaa;
		font-weight: 400;
	}

	button {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 13px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	button:hover {
		background: #aa0000;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 10px 12px;
		font-size: 0.85rem;
		color: #cc0000;
		margin-bottom: 4px;
	}
</style>
