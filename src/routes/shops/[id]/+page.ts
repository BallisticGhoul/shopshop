import { mockShops, mockProducts } from '$lib/mock';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const shop = mockShops.find((s) => s.id === params.id);
	if (!shop) throw error(404, 'Shop not found');
	const products = mockProducts[params.id] ?? [];
	return { shop, products };
}
