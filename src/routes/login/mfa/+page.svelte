<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Verify — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="card">
		<h1>Two-step verification</h1>
		<p class="lede">
			Signed in as <strong>{data.username}</strong>. Enter the code from your authenticator app.
		</p>

		{#if form?.error}
			<p class="error" data-testid="mfa-error">{form.error}</p>
		{/if}
		{#if form?.sent}
			<p class="notice" data-testid="mfa-code-sent">
				We sent a code to {data.maskedEmail}.
			</p>
		{/if}

		<form method="POST" action="?/verify" use:enhance>
			<label>
				Verification code
				<input
					type="text"
					name="code"
					required
					autocomplete="one-time-code"
					inputmode="numeric"
					placeholder="000000"
					data-testid="mfa-code"
				/>
			</label>
			<button type="submit" data-testid="mfa-submit">Verify</button>
		</form>

		<form method="POST" action="?/emailCode" use:enhance class="alt">
			<button type="submit" class="link" data-testid="mfa-email-code">
				Email a code to {data.maskedEmail} instead
			</button>
		</form>

		<p class="switch">
			A recovery code also works here. <a href="/login">Cancel</a>
		</p>
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
		font-size: 1.1rem;
		letter-spacing: 0.25em;
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

	.alt {
		margin-top: 14px;
	}

	.link {
		background: none;
		border: none;
		color: #cc0000;
		font-size: 0.82rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		padding: 0;
		text-align: center;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 10px 12px;
		font-size: 0.85rem;
		color: #cc0000;
		margin-bottom: 8px;
	}

	.notice {
		background: #f0f7ff;
		border: 1px solid #cce0ff;
		border-radius: 6px;
		padding: 10px 12px;
		font-size: 0.85rem;
		color: #0055aa;
		margin-bottom: 8px;
	}

	.switch {
		margin: 20px 0 0;
		text-align: center;
		font-size: 0.8rem;
		color: #666;
	}

	.switch a {
		color: #cc0000;
		font-weight: 600;
		text-decoration: none;
	}
</style>
