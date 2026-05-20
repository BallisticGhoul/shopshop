let _kv: any = null;

export async function getKv(): Promise<any> {
	if (!_kv) {
		const openKv: () => Promise<any> = Function('return Deno.openKv.bind(Deno)')();
		_kv = await openKv();
	}
	return _kv;
}
