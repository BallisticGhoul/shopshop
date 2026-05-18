import { getShop, getShopProducts } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const shop = await getShop(params.id);
	if (!shop) throw error(404, 'Shop not found');
	const products = await getShopProducts(params.id);
	return { shop, products };
}
