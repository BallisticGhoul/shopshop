<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	const base = $derived(
		`/inbox/${encodeURIComponent(data.address)}/${data.message.id}`
	);

	// The text part with URLs turned into real anchors — the view a test
	// normally drives, mirroring the TEXT tab of a hosted mail viewer.
	const textParts = $derived(
		data.message.text
			.split(/(https?:\/\/\S+)/g)
			.map((chunk) => ({ text: chunk, isLink: /^https?:\/\//.test(chunk) }))
	);
</script>

<svelte:head>
	<title>{data.message.subject} — Test Inbox</title>
</svelte:head>

<div class="page">
	<a href="/inbox/{encodeURIComponent(data.address)}" class="back">&larr; {data.address}</a>

	<article class="message">
		<header>
			<h1 data-testid="message-subject">{data.message.subject}</h1>
			<form method="POST" action="?/delete" use:enhance>
				<button type="submit" class="danger" data-testid="delete-message">Delete</button>
			</form>
		</header>

		<dl class="meta">
			<dt>From</dt>
			<dd data-testid="message-from">{data.message.from}</dd>
			<dt>To</dt>
			<dd data-testid="message-to">{data.message.to}</dd>
			<dt>Date</dt>
			<dd>{new Date(data.message.sentAt).toUTCString()}</dd>
			<dt>Message-ID</dt>
			<dd class="mono" data-testid="message-id">{data.message.messageId}</dd>
		</dl>

		<nav class="tabs" data-testid="view-tabs">
			<a href="{base}?view=html" class:active={data.view === 'html'} data-testid="tab-html">
				HTML
			</a>
			<a href="{base}?view=text" class:active={data.view === 'text'} data-testid="tab-text">
				Text
			</a>
			<a href="{base}?view=raw" class:active={data.view === 'raw'} data-testid="tab-raw">
				Source
			</a>
		</nav>

		{#if data.view === 'html'}
			<iframe
				title="HTML message body"
				class="html-body"
				data-testid="message-html"
				srcdoc={data.message.html}
				sandbox="allow-popups allow-top-navigation-by-user-activation"
			></iframe>
		{:else if data.view === 'text'}
			<pre data-testid="message-body">{#each textParts as part}{#if part.isLink}<a
							href={part.text}
							data-testid="message-link">{part.text}</a
						>{:else}{part.text}{/if}{/each}</pre>
		{:else}
			<pre class="raw" data-testid="message-raw">{data.raw}</pre>
		{/if}
	</article>
</div>

<style>
	.page {
		max-width: 760px;
		margin: 0 auto;
		padding: 40px 24px;
	}

	.back {
		display: inline-block;
		margin-bottom: 14px;
		color: #666;
		font-size: 0.85rem;
		text-decoration: none;
		word-break: break-all;
	}

	.back:hover {
		color: #cc0000;
	}

	.message {
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 10px;
		padding: 26px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		margin-bottom: 18px;
	}

	h1 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.danger {
		background: #fff;
		color: #cc0000;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		padding: 7px 14px;
		font-size: 0.8rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		white-space: nowrap;
	}

	.danger:hover {
		background: #fff5f5;
	}

	.meta {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4px 14px;
		margin: 0 0 20px;
		padding-bottom: 18px;
		border-bottom: 1px solid #f0f0f0;
		font-size: 0.8rem;
	}

	dt {
		color: #999;
		font-weight: 500;
	}

	dd {
		margin: 0;
		color: #333;
		word-break: break-all;
	}

	.mono {
		font-family: ui-monospace, monospace;
		font-size: 0.74rem;
		color: #777;
	}

	.tabs {
		display: flex;
		gap: 4px;
		margin-bottom: 18px;
		border-bottom: 1px solid #eee;
	}

	.tabs a {
		padding: 7px 14px;
		font-size: 0.8rem;
		font-weight: 600;
		color: #888;
		text-decoration: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
	}

	.tabs a:hover {
		color: #555;
	}

	.tabs a.active {
		color: #cc0000;
		border-bottom-color: #cc0000;
	}

	.html-body {
		width: 100%;
		min-height: 320px;
		border: 1px solid #eee;
		border-radius: 6px;
		background: #f5f5f5;
	}

	pre {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: inherit;
		font-size: 0.88rem;
		line-height: 1.65;
		color: #333;
	}

	pre a {
		color: #cc0000;
		font-weight: 500;
	}

	pre.raw {
		font-family: ui-monospace, monospace;
		font-size: 0.74rem;
		line-height: 1.6;
		color: #555;
		background: #fafafa;
		border: 1px solid #eee;
		border-radius: 6px;
		padding: 14px;
		overflow-x: auto;
	}
</style>
