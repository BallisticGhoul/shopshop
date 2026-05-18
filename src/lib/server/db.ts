let _kv: any = null;

export async function getKv(): Promise<any> {
	if (!_kv) {
		_kv = await (globalThis as any).Deno.openKv();
	}
	return _kv;
}
