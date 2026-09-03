/**
 * RFC 6238 TOTP / RFC 4226 HOTP on top of Web Crypto.
 * No dependencies — Deno and the browser both provide HMAC-SHA1.
 */

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export const TOTP_PERIOD = 30;
export const TOTP_DIGITS = 6;
/** Steps of clock drift tolerated either side of now. */
export const TOTP_WINDOW = 1;

export function base32Encode(bytes: Uint8Array): string {
	let bits = 0;
	let value = 0;
	let out = '';
	for (const byte of bytes) {
		value = (value << 8) | byte;
		bits += 8;
		while (bits >= 5) {
			out += BASE32[(value >>> (bits - 5)) & 31];
			bits -= 5;
		}
	}
	if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
	return out;
}

export function base32Decode(input: string): Uint8Array<ArrayBuffer> {
	const clean = input.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
	let bits = 0;
	let value = 0;
	const out: number[] = [];
	for (const char of clean) {
		const idx = BASE32.indexOf(char);
		if (idx === -1) throw new Error(`Invalid base32 character: ${char}`);
		value = (value << 5) | idx;
		bits += 5;
		if (bits >= 8) {
			out.push((value >>> (bits - 8)) & 255);
			bits -= 8;
		}
	}
	return new Uint8Array(out);
}

/** A fresh 20-byte (160-bit) secret, the size RFC 4226 recommends for SHA-1. */
export function generateTotpSecret(): string {
	return base32Encode(crypto.getRandomValues(new Uint8Array(20)));
}

async function hotp(secret: Uint8Array<ArrayBuffer>, counter: number): Promise<string> {
	const buf = new ArrayBuffer(8);
	const view = new DataView(buf);
	// Counter is a 64-bit big-endian int; split because setBigUint64 needs BigInt.
	view.setUint32(0, Math.floor(counter / 2 ** 32));
	view.setUint32(4, counter >>> 0);

	const key = await crypto.subtle.importKey(
		'raw',
		secret,
		{ name: 'HMAC', hash: 'SHA-1' },
		false,
		['sign']
	);
	const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf));

	const offset = mac[mac.length - 1] & 0x0f;
	const binary =
		((mac[offset] & 0x7f) << 24) |
		((mac[offset + 1] & 0xff) << 16) |
		((mac[offset + 2] & 0xff) << 8) |
		(mac[offset + 3] & 0xff);

	return (binary % 10 ** TOTP_DIGITS).toString().padStart(TOTP_DIGITS, '0');
}

/** The code for a given moment (defaults to now). */
export async function totpCode(secret: string, atMs: number = Date.now()): Promise<string> {
	return hotp(base32Decode(secret), Math.floor(atMs / 1000 / TOTP_PERIOD));
}

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

/** Verify a submitted code, allowing TOTP_WINDOW steps of drift either side. */
export async function verifyTotp(
	secret: string,
	code: string,
	atMs: number = Date.now()
): Promise<boolean> {
	const submitted = code.replace(/\s/g, '');
	if (!/^\d+$/.test(submitted)) return false;

	for (let drift = -TOTP_WINDOW; drift <= TOTP_WINDOW; drift++) {
		const expected = await totpCode(secret, atMs + drift * TOTP_PERIOD * 1000);
		if (timingSafeEqual(expected, submitted)) return true;
	}
	return false;
}

/** The otpauth:// URI an authenticator app scans or accepts by hand. */
export function otpauthUri(secret: string, username: string, issuer = 'ShopShop'): string {
	const label = encodeURIComponent(`${issuer}:${username}`);
	const params = new URLSearchParams({
		secret,
		issuer,
		algorithm: 'SHA1',
		digits: String(TOTP_DIGITS),
		period: String(TOTP_PERIOD)
	});
	return `otpauth://totp/${label}?${params}`;
}
