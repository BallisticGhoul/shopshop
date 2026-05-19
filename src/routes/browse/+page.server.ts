import { getAllShops, getShopProducts } from '$lib/server/auth';

const PAGE_SIZE = 9;

export async function load({ url }) {
	const query = url.searchParams.get('q')?.trim() ?? '';
	const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);

	let allShops = await getAllShops();

	if (keywords.length > 0) {
		const filtered = [];
		for (const shop of allShops) {
			// check shop name first
			if (keywords.some((kw) => shop.name.toLowerCase().includes(kw))) {
				filtered.push(shop);
				continue;
			}
			// check product names
			const products = await getShopProducts(shop.id);
			if (products.some((p) => keywords.some((kw) => p.name.toLowerCase().includes(kw)))) {
				filtered.push(shop);
			}
		}
		allShops = filtered;
	}

	const totalResults = allShops.length;
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const shops = allShops.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	return { shops, currentPage, totalPages, query, totalResults };
}
