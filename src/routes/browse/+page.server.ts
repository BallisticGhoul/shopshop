import { getAllShops, getShopProducts } from '$lib/server/auth';

const PAGE_SIZE = 9;

export async function load({ url }) {
	const query = url.searchParams.get('q')?.trim() ?? '';
	// bug 4: no toLowerCase — search is case-sensitive
	const keywords = query.split(/\s+/).filter(Boolean);

	let allShops = await getAllShops();

	if (keywords.length > 0) {
		const filtered = [];
		for (const shop of allShops) {
			if (keywords.some((kw) => shop.name.includes(kw))) {
				filtered.push(shop);
				continue;
			}
			const products = await getShopProducts(shop.id);
			if (products.some((p) => keywords.some((kw) => p.name.includes(kw)))) {
				filtered.push(shop);
			}
		}
		allShops = filtered;
	}

	const totalResults = allShops.length;
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	// bug 10: floor+1 instead of ceil — adds a phantom empty page when results exactly fill a page
	const totalPages = Math.max(1, Math.floor(totalResults / PAGE_SIZE) + 1);
	const currentPage = Math.min(page, totalPages);
	const shops = allShops.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	return { shops, currentPage, totalPages, query, totalResults };
}
