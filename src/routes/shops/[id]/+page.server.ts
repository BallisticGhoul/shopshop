import { getShop, getShopProducts } from '$lib/server/auth';
import { arrangeProducts, parseSortKey } from '$lib/products';
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
	const shop = await getShop(params.id);
	if (!shop) throw error(404, 'Shop not found');

	const allProducts = await getShopProducts(params.id);
	const sort = parseSortKey(url.searchParams.get('sort'));
	const inStockOnly = url.searchParams.get('instock') === '1';
	const products = arrangeProducts(allProducts, sort, inStockOnly);

	return { shop, products, sort, inStockOnly, totalProducts: allProducts.length };
}
