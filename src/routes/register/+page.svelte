<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Register — ShopShop</title>
</svelte:head>

<div class="page">
	<div class="card">
		<h1>Create account</h1>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<label>
				Username
				<input
					type="text"
					name="username"
					required
					autocomplete="username"
					minlength="3"
					maxlength="32"
					pattern="[a-zA-Z0-9_-]+"
					title="Letters, numbers, underscores and hyphens only"
				/>
			</label>
			<label>
				Password
				<input
					type="password"
					name="password"
					required
					autocomplete="new-password"
					minlength="8"
				/>
			</label>
			<label>
				Confirm password
				<input type="password" name="confirm" required autocomplete="new-password" />
			</label>
			<button type="submit">Create account</button>
		</form>

		<p class="switch">Already have an account? <a href="/login">Log in</a></p>
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
		margin: 0 0 24px;
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.02em;
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

	button {
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
		margin-bottom: 8px;
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
