import { getKv } from './db';
import type { MailMessage } from '$lib/types';

/**
 * A pretend mail system local to ShopShop.
 *
 * Nothing leaves the app — messages are written to Deno KV and read back at
 * /inbox — but the behaviour deliberately mirrors a real provider: per-address
 * mailboxes, multipart text + HTML bodies, Message-IDs, unread state, search,
 * deletion, and a delivery delay that can be turned up so tests have to poll
 * for arrival the way they would against a real inbox.
 */

const MAIL_RETENTION_MS = 24 * 60 * 60 * 1000;

/**
 * How long a message spends in transit before it appears in the mailbox.
 *
 * Zero keeps the suite fast. Raise it to make delivery asynchronous — a
 * message sent now is not immediately visible, so specs must wait for it,
 * which is the behaviour they would face against a real provider.
 */
export const DELIVERY_DELAY_MS = 0;

export const MAIL_FROM = 'ShopShop <no-reply@shopshop.test>';
export const MAIL_DOMAIN = 'shopshop.test';

export interface OutgoingMail {
	to: string;
	subject: string;
	text: string;
	/** Optional; a reasonable HTML part is generated from the text if omitted. */
	html?: string;
}

export function normaliseAddress(address: string): string {
	return address.trim().toLowerCase();
}

/* ------------------------------------------------------------------ *
 * Sending
 * ------------------------------------------------------------------ */

export async function sendMail(mail: OutgoingMail): Promise<MailMessage> {
	const now = Date.now();
	const id = crypto.randomUUID();
	const to = normaliseAddress(mail.to);

	const message: MailMessage = {
		id,
		messageId: `<${id}@${MAIL_DOMAIN}>`,
		from: MAIL_FROM,
		to,
		subject: mail.subject,
		text: mail.text,
		html: mail.html ?? htmlFromText(mail.subject, mail.text),
		sentAt: new Date(now).toISOString(),
		deliverAt: new Date(now + DELIVERY_DELAY_MS).toISOString(),
		read: false
	};

	const kv = await getKv();
	await kv.set(['mail', to, id], message, {
		expireIn: MAIL_RETENTION_MS + DELIVERY_DELAY_MS
	});

	return message;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** A plain but realistic transactional HTML part, links included. */
export function htmlFromText(subject: string, text: string): string {
	const paragraphs = text
		.split(/\n{2,}/)
		.map((block) => {
			const withLinks = escapeHtml(block).replace(
				/(https?:\/\/[^\s<]+)/g,
				'<a href="$1" style="color:#cc0000;">$1</a>'
			);
			return `<p style="margin:0 0 14px;">${withLinks.replace(/\n/g, '<br />')}</p>`;
		})
		.join('\n      ');

	return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,Segoe UI,sans-serif;color:#333;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:10px;">
      <tr><td style="padding:28px;">
      <h1 style="margin:0 0 18px;font-size:18px;color:#cc0000;">${escapeHtml(subject)}</h1>
      ${paragraphs}
      </td></tr>
    </table>
  </body>
</html>`;
}

/* ------------------------------------------------------------------ *
 * Reading
 * ------------------------------------------------------------------ */

function delivered(message: MailMessage): boolean {
	return Date.parse(message.deliverAt) <= Date.now();
}

function byNewest(a: MailMessage, b: MailMessage): number {
	return b.sentAt.localeCompare(a.sentAt);
}

/** Messages in one mailbox, newest first. Undelivered mail is not visible. */
export async function listInbox(address: string, query = ''): Promise<MailMessage[]> {
	const kv = await getKv();
	const term = query.trim().toLowerCase();
	const messages: MailMessage[] = [];

	const iter = kv.list({ prefix: ['mail', normaliseAddress(address)] });
	for await (const entry of iter) {
		const message = entry.value as MailMessage;
		if (!delivered(message)) continue;
		if (
			term &&
			!message.subject.toLowerCase().includes(term) &&
			!message.text.toLowerCase().includes(term)
		) {
			continue;
		}
		messages.push(message);
	}
	return messages.sort(byNewest);
}

export interface MailboxSummary {
	address: string;
	total: number;
	unread: number;
	latestAt: string;
}

/** Every address that has mail, as a real multi-account viewer would show. */
export async function listMailboxes(): Promise<MailboxSummary[]> {
	const kv = await getKv();
	const boxes = new Map<string, MailboxSummary>();

	const iter = kv.list({ prefix: ['mail'] });
	for await (const entry of iter) {
		if (entry.key.length !== 3) continue;
		const message = entry.value as MailMessage;
		if (!delivered(message)) continue;

		const box = boxes.get(message.to) ?? {
			address: message.to,
			total: 0,
			unread: 0,
			latestAt: message.sentAt
		};
		box.total += 1;
		if (!message.read) box.unread += 1;
		if (message.sentAt > box.latestAt) box.latestAt = message.sentAt;
		boxes.set(message.to, box);
	}

	return [...boxes.values()].sort((a, b) => b.latestAt.localeCompare(a.latestAt));
}

export async function getMessage(address: string, id: string): Promise<MailMessage | null> {
	const kv = await getKv();
	const entry = await kv.get<MailMessage>(['mail', normaliseAddress(address), id]);
	if (!entry.value || !delivered(entry.value)) return null;
	return entry.value;
}

export async function markRead(address: string, id: string): Promise<void> {
	const kv = await getKv();
	const key = ['mail', normaliseAddress(address), id];
	const entry = await kv.get<MailMessage>(key);
	if (!entry.value || entry.value.read) return;
	await kv.set(key, { ...entry.value, read: true }, { expireIn: MAIL_RETENTION_MS });
}

export async function deleteMessage(address: string, id: string): Promise<void> {
	const kv = await getKv();
	await kv.delete(['mail', normaliseAddress(address), id]);
}

export async function emptyMailbox(address: string): Promise<number> {
	const kv = await getKv();
	let removed = 0;
	const iter = kv.list({ prefix: ['mail', normaliseAddress(address)] });
	for await (const entry of iter) {
		await kv.delete(entry.key);
		removed += 1;
	}
	return removed;
}

/* ------------------------------------------------------------------ *
 * Source view
 * ------------------------------------------------------------------ */

/** The message as an RFC 5322 multipart/alternative document. */
export function rawSource(message: MailMessage): string {
	const boundary = `----=_shopshop_${message.id}`;
	return [
		`Message-ID: ${message.messageId}`,
		`Date: ${new Date(message.sentAt).toUTCString()}`,
		`From: ${message.from}`,
		`To: ${message.to}`,
		`Subject: ${message.subject}`,
		'MIME-Version: 1.0',
		`Content-Type: multipart/alternative; boundary="${boundary}"`,
		'',
		`--${boundary}`,
		'Content-Type: text/plain; charset=utf-8',
		'Content-Transfer-Encoding: 7bit',
		'',
		message.text,
		'',
		`--${boundary}`,
		'Content-Type: text/html; charset=utf-8',
		'Content-Transfer-Encoding: 7bit',
		'',
		message.html,
		'',
		`--${boundary}--`
	].join('\r\n');
}
