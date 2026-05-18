let _kv: any = null;

export async function getKv(): Promise<any> {
	if (!_kv) {
		// Use Function() to evaluate in the true global scope, bypassing any
		// partial Deno stub that SvelteKit's Vite SSR bundler injects at module level.
		const openKv: () => Promise<any> = Function('return Deno.openKv.bind(Deno)')();
		_kv = await openKv();
	}
	return _kv;
}
