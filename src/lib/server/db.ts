let _kv: any = null;

export async function getKv(): Promise<any> {
	if (!_kv) {
		// @ts-ignore - Deno.openKv is available at runtime on Deno Deploy
		_kv = await Deno.openKv();
	}
	return _kv;
}
