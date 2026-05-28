let _kv: any = null;

function createMemoryKv() {
	const store = new Map<string, { value: any; expires?: number }>();
	const ser = (key: unknown[]) => JSON.stringify(key);

	return {
		get(key: unknown[]) {
			const entry = store.get(ser(key));
			if (!entry) return Promise.resolve({ value: null });
			if (entry.expires && Date.now() > entry.expires) {
				store.delete(ser(key));
				return Promise.resolve({ value: null });
			}
			return Promise.resolve({ value: entry.value });
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

export async function getKv(): Promise<any> {
	if (!_kv) {
		try {
			const openKv: () => Promise<any> = Function('return Deno.openKv.bind(Deno)')();
			_kv = await openKv();
		} catch {
			_kv = createMemoryKv();
		}
	}
	return _kv;
}
