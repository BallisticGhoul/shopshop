<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Security — ShopShop</title>
</svelte:head>

<div class="page">
	<a href="/dashboard" class="back">&larr; Dashboard</a>
	<h1>Security</h1>

	<section class="panel">
		<h2>Email</h2>
		<p class="row">
			<span data-testid="account-email">{data.email}</span>
			{#if data.emailVerified}
				<span class="badge ok" data-testid="email-verified">Verified</span>
			{:else}
				<span class="badge">Unverified</span>
			{/if}
		</p>
	</section>

	<section class="panel">
		<h2>Two-factor authentication</h2>

		{#if form?.error}
			<p class="error" data-testid="totp-error">{form.error}</p>
		{/if}

		{#if form?.recoveryCodes}
			<p class="notice">
				Two-factor is on. Save these recovery codes — each works once and they are not
				shown again.
			</p>
			<ul class="codes" data-testid="recovery-codes">
				{#each form.recoveryCodes as code}
					<li>{code}</li>
				{/each}
			</ul>
		{:else if data.totpEnabled}
			<p class="row">
				<span class="badge ok" data-testid="totp-enabled">Enabled</span>
				<span class="muted">{data.recoveryCodesLeft} recovery codes remaining</span>
			</p>
			<form method="POST" action="?/disable" use:enhance>
				<button type="submit" class="secondary" data-testid="totp-disable">Turn off</button>
			</form>
		{:else if data.pendingSecret}
			<p class="lede">
				Add this secret to your authenticator app, then enter the code it shows to finish.
			</p>
			<p class="secret" data-testid="totp-secret">{data.pendingSecret}</p>
			<p class="uri">
				Or use this URI: <code data-testid="totp-uri">{data.pendingUri}</code>
			</p>
			<form method="POST" action="?/confirm" use:enhance class="confirm">
				<input
					type="text"
					name="code"
					required
					inputmode="numeric"
					placeholder="000000"
					autocomplete="one-time-code"
					data-testid="totp-confirm-code"
				/>
				<button type="submit" data-testid="totp-confirm">Confirm</button>
			</form>
		{:else}
			<p class="lede">
				Protect your account with a code from an authenticator app in addition to your
				password.
			</p>
			<form method="POST" action="?/begin" use:enhance>
				<button type="submit" data-testid="totp-begin">Set up two-factor</button>
			</form>
		{/if}
	</section>
</div>

<style>
	.page {
		max-width: 640px;
		margin: 0 auto;
		padding: 40px 24px;
	}

	.back {
		display: inline-block;
		margin-bottom: 14px;
		color: #666;
		font-size: 0.85rem;
		text-decoration: none;
	}

	.back:hover {
		color: #cc0000;
	}

	h1 {
		margin: 0 0 24px;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.panel {
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 10px;
		padding: 24px;
		margin-bottom: 18px;
	}

	h2 {
		margin: 0 0 14px;
		font-size: 1rem;
		font-weight: 600;
	}

	.lede {
		margin: 0 0 16px;
		font-size: 0.85rem;
		color: #666;
		line-height: 1.55;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0 0 14px;
		font-size: 0.9rem;
	}

	.muted {
		color: #888;
		font-size: 0.8rem;
	}

	.badge {
		background: #f0f0f0;
		color: #666;
		border-radius: 20px;
		padding: 3px 10px;
		font-size: 0.72rem;
		font-weight: 600;
	}

	.badge.ok {
		background: #e8f6ec;
		color: #1a7f3c;
	}

	.secret {
		font-family: ui-monospace, monospace;
		font-size: 1rem;
		letter-spacing: 0.12em;
		background: #f7f7f7;
		border: 1px solid #eee;
		border-radius: 6px;
		padding: 12px 14px;
		margin: 0 0 12px;
		word-break: break-all;
	}

	.uri {
		font-size: 0.75rem;
		color: #888;
		margin: 0 0 18px;
		word-break: break-all;
	}

	.uri code {
		font-size: 0.72rem;
	}

	.confirm {
		display: flex;
		gap: 8px;
	}

	.confirm input {
		border: 1px solid #e0e0e0;
		border-radius: 5px;
		padding: 10px 12px;
		font-size: 1rem;
		letter-spacing: 0.2em;
		font-family: inherit;
		outline: none;
		width: 150px;
	}

	.confirm input:focus {
		border-color: #cc0000;
	}

	button {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 11px 20px;
		font-size: 0.88rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: background 0.15s;
	}

	button:hover {
		background: #aa0000;
	}

	button.secondary {
		background: #fff;
		color: #cc0000;
		border: 1px solid #ffcccc;
	}

	button.secondary:hover {
		background: #fff5f5;
	}

	.codes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.codes li {
		font-family: ui-monospace, monospace;
		font-size: 0.88rem;
		background: #f7f7f7;
		border: 1px solid #eee;
		border-radius: 5px;
		padding: 8px 10px;
		text-align: center;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 10px 12px;
		font-size: 0.85rem;
		color: #cc0000;
		margin: 0 0 14px;
	}

	.notice {
		background: #f0f7ff;
		border: 1px solid #cce0ff;
		border-radius: 6px;
		padding: 12px 14px;
		font-size: 0.85rem;
		color: #0055aa;
		margin: 0 0 16px;
		line-height: 1.5;
	}
</style>
