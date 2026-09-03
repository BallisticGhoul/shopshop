import { getKv } from './db';
import { sendMail } from './mail';
import { saveUser } from './auth';
import type { User } from '$lib/types';

/** Magic links and email codes are short-lived on purpose. */
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const EMAIL_CODE_TTL_MS = 10 * 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;

async function sha256(input: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

/* ------------------------------------------------------------------ *
 * Magic link: passwordless sign-in by clicking a one-time URL.
 * ------------------------------------------------------------------ */

export async function createMagicLink(user: User): Promise<string> {
	const kv = await getKv();
	const token = crypto.randomUUID();
	await kv.set(
		['magic_links', token],
		{ userId: user.id, username: user.username, email: user.email },
		{ expireIn: MAGIC_LINK_TTL_MS }
	);
	return token;
}

/** Single use: the token is destroyed as it is read, valid or not. */
export async function consumeMagicLink(
	token: string
): Promise<{ userId: string; username: string; email: string } | null> {
	const kv = await getKv();
	const entry = await kv.get<{ userId: string; username: string; email: string }>([
		'magic_links',
		token
	]);
	if (!entry.value) return null;
	await kv.delete(['magic_links', token]);
	return entry.value;
}

export async function sendMagicLinkEmail(user: User, link: string): Promise<void> {
	await sendMail({
		to: user.email,
		subject: 'Your ShopShop sign-in link',
		text: [
			`Hi ${user.username},`,
			'',
			'Click the link below to sign in to ShopShop. It works once and expires in 15 minutes.',
			'',
			link,
			'',
			'If you did not request this, you can ignore this email.'
		].join('\n'),
		html: magicLinkHtml(user.username, link)
	});
}

/* ------------------------------------------------------------------ *
 * Email one-time code: a six-digit code as a second factor.
 * ------------------------------------------------------------------ */

export async function createEmailCode(userId: string): Promise<string> {
	const kv = await getKv();
	const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
	await kv.set(
		['email_codes', userId],
		{ code, attempts: 0, expiresAt: Date.now() + EMAIL_CODE_TTL_MS },
		{ expireIn: EMAIL_CODE_TTL_MS }
	);
	return code;
}

export async function verifyEmailCode(userId: string, submitted: string): Promise<boolean> {
	const kv = await getKv();
	const entry = await kv.get<{ code: string; attempts: number; expiresAt: number }>([
		'email_codes',
		userId
	]);
	if (!entry.value) return false;

	const { code, attempts, expiresAt } = entry.value;
	if (Date.now() > expiresAt || attempts >= MAX_CODE_ATTEMPTS) {
		await kv.delete(['email_codes', userId]);
		return false;
	}

	if (code !== submitted.trim()) {
		await kv.set(
			['email_codes', userId],
			{ code, attempts: attempts + 1, expiresAt },
			{ expireIn: Math.max(1, expiresAt - Date.now()) }
		);
		return false;
	}

	await kv.delete(['email_codes', userId]);
	return true;
}

export async function sendLoginCodeEmail(user: User, code: string): Promise<void> {
	await sendMail({
		to: user.email,
		subject: `${code} is your ShopShop verification code`,
		text: [
			`Hi ${user.username},`,
			'',
			`Your verification code is ${code}`,
			'',
			'It expires in 10 minutes. If you did not try to sign in, ignore this email.'
		].join('\n'),
		html: loginCodeHtml(user.username, code)
	});
}

/* ------------------------------------------------------------------ *
 * Recovery codes: single-use fallbacks issued at TOTP enrollment.
 * ------------------------------------------------------------------ */

const RECOVERY_CODE_COUNT = 8;

/** Returns the plaintext codes to show once; only hashes are persisted. */
export async function generateRecoveryCodes(user: User): Promise<string[]> {
	const plain: string[] = [];
	for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
		const bytes = crypto.getRandomValues(new Uint8Array(5));
		const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
		plain.push(`${hex.slice(0, 5)}-${hex.slice(5)}`);
	}
	user.recoveryCodes = await Promise.all(plain.map(sha256));
	await saveUser(user);
	return plain;
}

export async function consumeRecoveryCode(user: User, submitted: string): Promise<boolean> {
	if (!user.recoveryCodes?.length) return false;
	const hash = await sha256(submitted.trim().toLowerCase());
	const index = user.recoveryCodes.indexOf(hash);
	if (index === -1) return false;

	user.recoveryCodes.splice(index, 1);
	await saveUser(user);
	return true;
}

/* ------------------------------------------------------------------ *
 * HTML parts
 * ------------------------------------------------------------------ */

function shell(inner: string): string {
	return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,Segoe UI,sans-serif;color:#333;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:10px;">
      <tr><td style="padding:28px;">
${inner}
      </td></tr>
    </table>
  </body>
</html>`;
}

function magicLinkHtml(username: string, link: string): string {
	return shell(`      <h1 style="margin:0 0 16px;font-size:18px;color:#cc0000;">Sign in to ShopShop</h1>
      <p style="margin:0 0 18px;">Hi ${username}, use the button below to sign in. It works once and expires in 15 minutes.</p>
      <p style="margin:0 0 20px;">
        <a href="${link}" style="display:inline-block;background:#cc0000;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600;">Sign in</a>
      </p>
      <p style="margin:0;font-size:12px;color:#888;">If the button does not work, paste this into your browser:<br />${link}</p>
      <p style="margin:16px 0 0;font-size:12px;color:#888;">If you did not request this, you can ignore this email.</p>`);
}

function loginCodeHtml(username: string, code: string): string {
	return shell(`      <h1 style="margin:0 0 16px;font-size:18px;color:#cc0000;">Your verification code</h1>
      <p style="margin:0 0 18px;">Hi ${username}, enter this code to finish signing in.</p>
      <p style="margin:0 0 20px;font-size:30px;font-weight:700;letter-spacing:8px;color:#111;">${code}</p>
      <p style="margin:0;font-size:12px;color:#888;">It expires in 10 minutes. If you did not try to sign in, ignore this email.</p>`);
}
