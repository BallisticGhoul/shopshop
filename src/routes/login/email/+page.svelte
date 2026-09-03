<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let { form } = $props();
	const expired = $derived(page.url.searchParams.has('expired'));
</script>

<svelte:head>
	<title>Sign in by email — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="card">
		<h1>Sign in by email</h1>
		<p class="lede">No password needed. We'll email you a link that signs you in.</p>

		{#if expired}
			<p class="error" data-testid="magic-expired">
				That link has expired or was already used. Request a new one.
			</p>
		{/if}

		{#if form?.sent}
			<p class="notice" data-testid="magic-sent">
				If an account exists for {form.email}, a sign-in link is on its way.
			</p>
		{:else}
			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}
			<form method="POST" use:enhance>
				<label>
					Email
					<input
						type="email"
						name="email"
						required
						autocomplete="email"
						data-testid="magic-email"
					/>
				</label>
				<button type="submit" data-testid="magic-submit">Email me a link</button>
			</form>
		{/if}

		<p class="switch">Prefer a password? <a href="/login">Log in</a></p>
	</div>
</div>

<style>
	.page {
		min-height: calc(100vh - 60px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 24px;
		background: #f5f5f5;
	}

	.card {
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 10px;
		padding: 36px;
		width: 100%;
		max-width: 380px;
	}

	h1 {
		margin: 0 0 8px;
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 0 0 22px;
		font-size: 0.85rem;
		color: #666;
		line-height: 1.5;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.85rem;
		font-weight: 500;
		color: #444;
	}

	input {
		border: 1px solid #e0e0e0;
		border-radius: 5px;
		padding: 10px 12px;
		font-size: 0.9rem;
		outline: none;
		font-family: inherit;
		transition: border-color 0.15s;
	}

	input:focus {
		border-color: #cc0000;
	}

	button[type='submit'] {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 12px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		margin-top: 4px;
		transition: background 0.15s;
	}

	button[type='submit']:hover {
		background: #aa0000;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 10px 12px;
		font-size: 0.85rem;
		color: #cc0000;
		margin-bottom: 12px;
	}

	.notice {
		background: #f0f7ff;
		border: 1px solid #cce0ff;
		border-radius: 6px;
		padding: 12px 14px;
		font-size: 0.85rem;
		color: #0055aa;
		line-height: 1.5;
	}

	.switch {
		margin: 20px 0 0;
		text-align: center;
		font-size: 0.85rem;
		color: #666;
	}

	.switch a {
		color: #cc0000;
		font-weight: 600;
		text-decoration: none;
	}
</style>
