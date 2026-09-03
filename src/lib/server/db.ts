/**
 * Deno KV when it is available (Deno Deploy, `deno task`), otherwise an
 * in-memory stand-in so `vite dev` and tests work without it.
 *
 * Note: the in-memory store lives and dies with the process, so sessions do
 * not survive a dev-server restart.
 */

export interface KvEntry<T> {
	value: T | null;
}

export interface KvListEntry {
	key: unknown[];
	value: unknown;
}

export interface KvLike {
	get<T = unknown>(key: unknown[]): Promise<KvEntry<T>>;
	set(key: unknown[], value: unknown, opts?: { expireIn?: number }): Promise<void>;
	delete(key: unknown[]): Promise<void>;
	list(selector: { prefix: unknown[] }): AsyncIterable<KvListEntry>;
}

let _kv: KvLike | null = null;

function createMemoryKv(): KvLike {
	const store = new Map<string, { value: unknown; expires?: number }>();
	const ser = (key: unknown[]) => JSON.stringify(key);

	return {
		get<T>(key: unknown[]): Promise<KvEntry<T>> {
			const entry = store.get(ser(key));
			if (!entry) return Promise.resolve({ value: null });
			if (entry.expires && Date.now() > entry.expires) {
				store.delete(ser(key));
				return Promise.resolve({ value: null });
			}
			return Promise.resolve({ value: entry.value as T });
		},
		set(key: unknown[], value: unknown, opts?: { expireIn?: number }) {
			store.set(ser(key), {
				value,
				expires: opts?.expireIn ? Date.now() + opts.expireIn : undefined
			});
			return Promise.resolve();
		},
		delete(key: unknown[]) {
			store.delete(ser(key));
			return Promise.resolve();
		},
		async *list({ prefix }: { prefix: unknown[] }) {
			for (const [rawKey, entry] of store.entries()) {
				if (entry.expires && Date.now() > entry.expires) {
					store.delete(rawKey);
					continue;
				}
				const keyArr: unknown[] = JSON.parse(rawKey);
				if (keyArr.length > prefix.length && prefix.every((p, i) => keyArr[i] === p)) {
					yield { key: keyArr, value: entry.value };
				}
			}
		}
	};
}

export async function getKv(): Promise<KvLike> {
	if (!_kv) {
		try {
			const openKv: () => Promise<KvLike> = Function('return Deno.openKv.bind(Deno)')();
			_kv = await openKv();
		} catch {
			_kv = createMemoryKv();
		}
	}
	return _kv;
}
