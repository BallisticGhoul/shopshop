import { getAllShops } from '$lib/server/auth';

const PAGE_SIZE = 9;

export async function load() {
	const shops = await getAllShops();

	// Fisher–Yates shuffle, then take one page
	for (let i = shops.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shops[i], shops[j]] = [shops[j], shops[i]];
	}

	return { shops: shops.slice(0, PAGE_SIZE) };
}
