<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>{data.address} — Test Inbox</title>
</svelte:head>

<div class="page">
	<a href="/inbox" class="back">&larr; All mailboxes</a>

	<header class="head">
		<div>
			<h1 data-testid="mailbox-address">{data.address}</h1>
			<p class="sub">
				{data.messages.length} message{data.messages.length === 1 ? '' : 's'}
				{#if data.unread > 0}
					· <strong data-testid="mailbox-unread">{data.unread} unread</strong>
				{/if}
			</p>
		</div>
		{#if data.messages.length > 0}
			<form method="POST" action="?/empty" use:enhance>
				<button type="submit" class="danger" data-testid="empty-mailbox">Empty</button>
			</form>
		{/if}
	</header>

	{#if form?.emptied !== undefined}
		<p class="notice" data-testid="emptied-notice">Deleted {form.emptied} message(s).</p>
	{/if}

	<form method="GET" class="search">
		<input
			type="search"
			name="q"
			placeholder="Search subject and body"
			value={data.query}
			data-testid="mailbox-search"
		/>
		<button type="submit">Search</button>
		{#if data.query}
			<a href="/inbox/{encodeURIComponent(data.address)}" class="clear">Clear</a>
		{/if}
	</form>

	{#if data.messages.length === 0}
		<p class="empty" data-testid="mailbox-empty">
			{data.query ? 'No messages match that search.' : 'This mailbox is empty.'}
		</p>
	{:else}
		<ul class="messages" data-testid="inbox-list">
			{#each data.messages as message (message.id)}
				<li class:unread={!message.read}>
					<a href="/inbox/{encodeURIComponent(data.address)}/{message.id}">
						{#if !message.read}
							<span class="dot" aria-label="Unread"></span>
						{:else}
							<span class="dot placeholder"></span>
						{/if}
						<span class="subject">{message.subject}</span>
						<span class="preview">{message.text.split('\n')[0]}</span>
						<span class="sent">{new Date(message.sentAt).toLocaleTimeString()}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.page {
		max-width: 820px;
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

	.head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		margin-bottom: 20px;
	}

	h1 {
		margin: 0 0 4px;
		font-size: 1.35rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		word-break: break-all;
	}

	.sub {
		margin: 0;
		color: #777;
		font-size: 0.82rem;
	}

	.search {
		display: flex;
		gap: 8px;
		align-items: center;
		margin-bottom: 18px;
	}

	.search input {
		flex: 1;
		border: 1px solid #e0e0e0;
		border-radius: 5px;
		padding: 9px 12px;
		font-size: 0.88rem;
		font-family: inherit;
		outline: none;
	}

	.search input:focus {
		border-color: #cc0000;
	}

	.search button {
		background: #f0f0f0;
		color: #444;
		border: none;
		border-radius: 5px;
		padding: 9px 16px;
		font-size: 0.82rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
	}

	.clear {
		color: #666;
		font-size: 0.82rem;
		text-decoration: none;
	}

	.danger {
		background: #fff;
		color: #cc0000;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 8px 16px;
		font-size: 0.82rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
	}

	.danger:hover {
		background: #fff5f5;
	}

	.messages {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
		overflow: hidden;
	}

	.messages li + li {
		border-top: 1px solid #f0f0f0;
	}

	.messages a {
		display: grid;
		grid-template-columns: auto 1.2fr 2fr auto;
		gap: 12px;
		align-items: baseline;
		padding: 13px 16px;
		text-decoration: none;
		color: inherit;
		background: #fff;
	}

	.messages a:hover {
		background: #fafafa;
	}

	.messages li.unread a {
		background: #fffdfa;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #cc0000;
		align-self: center;
	}

	.dot.placeholder {
		background: transparent;
	}

	.subject {
		font-size: 0.88rem;
		color: #555;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	li.unread .subject {
		font-weight: 700;
		color: #111;
	}

	.preview {
		font-size: 0.8rem;
		color: #999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sent {
		font-size: 0.74rem;
		color: #aaa;
		white-space: nowrap;
	}

	.empty {
		color: #888;
		font-size: 0.9rem;
		text-align: center;
		padding: 40px;
		border: 1px dashed #e0e0e0;
		border-radius: 8px;
	}

	.notice {
		background: #f0f7ff;
		border: 1px solid #cce0ff;
		border-radius: 6px;
		padding: 10px 12px;
		font-size: 0.85rem;
		color: #0055aa;
		margin: 0 0 16px;
	}
</style>
