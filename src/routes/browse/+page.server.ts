import { getAllShops, getShopProducts } from '$lib/server/auth';

const PAGE_SIZE = 9;

export async function load({ url }) {
	const query = url.searchParams.get('q')?.trim() ?? '';
	const keywords = query.split(/\s+/).filter(Boolean);

	let allShops = await getAllShops();

	if (keywords.length > 0) {
		// Normalise keywords to lowercase so matching is case-insensitive
		const kwLower = keywords.map((kw) => kw.toLowerCase());
		const filtered = [];
		for (const shop of allShops) {
			if (kwLower.some((kw) => shop.name.toLowerCase().includes(kw))) {
				filtered.push(shop);
				continue;
			}
			const products = await getShopProducts(shop.id);
			if (products.some((p) => kwLower.some((kw) => p.name.toLowerCase().includes(kw)))) {
				filtered.push(shop);
			}
		}
		allShops = filtered;
	}

	const totalResults = allShops.length;
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const totalPages = Math.max(1, Math.floor(totalResults / PAGE_SIZE) + 1);
	const currentPage = Math.min(page, totalPages);
	const shops = allShops.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	return { shops, currentPage, totalPages, query, totalResults };
}
