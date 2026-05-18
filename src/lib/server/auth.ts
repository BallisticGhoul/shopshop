import { getKv } from './db';
import type { User, Shop } from '$lib/types';

async function pbkdf2(password: string, salt: Uint8Array): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
		key,
		256
	);
	return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	return { hash: await pbkdf2(password, salt), salt: btoa(String.fromCharCode(...salt)) };
}

export async function verifyPassword(
	password: string,
	hash: string,
	saltB64: string
): Promise<boolean> {
	const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
	return (await pbkdf2(password, salt)) === hash;
}

export async function createUser(username: string, password: string): Promise<User | null> {
	const kv = await getKv();
	const existing = await kv.get(['users', username.toLowerCase()]);
	if (existing.value) return null;

	const { hash, salt } = await hashPassword(password);
	const user: User = {
		id: crypto.randomUUID(),
		username,
		passwordHash: hash,
		salt,
		createdAt: new Date().toISOString()
	};
	await kv.set(['users', username.toLowerCase()], user);
	return user;
}

export async function getUser(username: string): Promise<User | null> {
	const kv = await getKv();
	const entry = await kv.get<User>(['users', username.toLowerCase()]);
	return entry.value;
}

export async function verifyCredentials(
	username: string,
	password: string
): Promise<User | null> {
	const user = await getUser(username);
	if (!user) return null;
	return (await verifyPassword(password, user.passwordHash, user.salt)) ? user : null;
}

export async function createSession(userId: string, username: string): Promise<string> {
	const kv = await getKv();
	const sessionId = crypto.randomUUID();
	await kv.set(
		['sessions', sessionId],
		{ userId, username, createdAt: new Date().toISOString() },
		{ expireIn: 30 * 24 * 60 * 60 * 1000 }
	);
	return sessionId;
}

export async function getSession(
	sessionId: string
): Promise<{ id: string; username: string } | null> {
	const kv = await getKv();
	const entry = await kv.get<{ userId: string; username: string }>(['sessions', sessionId]);
	if (!entry.value) return null;
	return { id: entry.value.userId, username: entry.value.username };
}

export async function deleteSession(sessionId: string): Promise<void> {
	const kv = await getKv();
	await kv.delete(['sessions', sessionId]);
}

export async function createShop(
	name: string,
	description: string,
	bannerImage: string,
	ownerUsername: string
): Promise<Shop> {
	const kv = await getKv();
	const shop: Shop = {
		id: crypto.randomUUID(),
		name,
		description,
		bannerImage,
		owner: ownerUsername
	};
	await kv.set(['shops', shop.id], shop);
	await kv.set(['shops_by_owner', ownerUsername.toLowerCase(), shop.id], true);
	return shop;
}

export async function getUserShops(ownerUsername: string): Promise<Shop[]> {
	const kv = await getKv();
	const shops: Shop[] = [];
	const iter = kv.list({ prefix: ['shops_by_owner', ownerUsername.toLowerCase()] });
	for await (const entry of iter) {
		const shopId = entry.key[2] as string;
		const shopEntry = await kv.get<Shop>(['shops', shopId]);
		if (shopEntry.value) shops.push(shopEntry.value);
	}
	return shops;
}
