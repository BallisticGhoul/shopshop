<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Test Inbox — ShopShop</title>
</svelte:head>

<div class="page">
	<h1>Test Inbox</h1>
	<p class="sub">
		Every email ShopShop sends is delivered here. Nothing leaves the app.
	</p>

	<form method="POST" action="?/open" class="jump">
		<input type="email" name="address" placeholder="Open a mailbox by address" required />
		<button type="submit">Open</button>
	</form>

	{#if data.mailboxes.length === 0}
		<p class="empty" data-testid="no-mailboxes">No mail has been sent yet.</p>
	{:else}
		<ul class="boxes" data-testid="mailbox-list">
			{#each data.mailboxes as box (box.address)}
				<li>
					<a href="/inbox/{encodeURIComponent(box.address)}">
						<span class="addr">{box.address}</span>
						<span class="counts">
							{#if box.unread > 0}
								<span class="unread-pill" data-testid="unread-count">{box.unread}</span>
							{/if}
							<span class="total">{box.total} message{box.total === 1 ? '' : 's'}</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.page {
		max-width: 720px;
		margin: 0 auto;
		padding: 40px 24px;
	}

	h1 {
		margin: 0 0 6px;
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.sub {
		margin: 0 0 24px;
		color: #666;
		font-size: 0.85rem;
	}

	.jump {
		display: flex;
		gap: 8px;
		margin-bottom: 22px;
	}

	.jump input {
		flex: 1;
		border: 1px solid #e0e0e0;
		border-radius: 5px;
		padding: 9px 12px;
		font-size: 0.9rem;
		font-family: inherit;
		outline: none;
	}

	.jump input:focus {
		border-color: #cc0000;
	}

	.jump button {
		background: #cc0000;
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 9px 20px;
		font-size: 0.85rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
	}

	.boxes {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		overflow: hidden;
	}

	.boxes li + li {
		border-top: 1px solid #f0f0f0;
	}

	.boxes a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		text-decoration: none;
		color: inherit;
		background: #fff;
	}

	.boxes a:hover {
		background: #fafafa;
	}

	.addr {
		font-size: 0.9rem;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.counts {
		display: flex;
		align-items: center;
		gap: 10px;
		white-space: nowrap;
	}

	.unread-pill {
		background: #cc0000;
		color: #fff;
		border-radius: 20px;
		padding: 2px 9px;
		font-size: 0.72rem;
		font-weight: 700;
	}

	.total {
		font-size: 0.78rem;
		color: #999;
	}

	.empty {
		color: #888;
		font-size: 0.9rem;
		text-align: center;
		padding: 40px;
		border: 1px dashed #e0e0e0;
		border-radius: 8px;
	}
</style>
