import { getUserShops } from '$lib/server/auth';

export async function load({ locals }) {
	const shops = await getUserShops(locals.user!.username);
	return { shops };
}
