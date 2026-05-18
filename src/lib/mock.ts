import type { Shop, Product } from './types';

export const mockShops: Shop[] = Array.from({ length: 12 }, (_, i) => ({
	id: String(i + 1),
	name: `Placeholder Shop ${i + 1}`,
	description: 'A placeholder shop for testing and development purposes.',
	bannerImage: `https://picsum.photos/seed/shop${i + 1}/800/300`,
	owner: 'placeholder'
}));

export const mockProducts: Record<string, Product[]> = {
	'1': [
		{
			id: 'p1-1',
			shopId: '1',
			name: 'Placeholder Product A',
			price: 19.99,
			description: 'A placeholder product for testing.',
			image: 'https://picsum.photos/seed/prod1a/400/400',
			stock: 10
		},
		{
			id: 'p1-2',
			shopId: '1',
			name: 'Placeholder Product B',
			price: 34.99,
			description: 'Another placeholder product for testing.',
			image: 'https://picsum.photos/seed/prod1b/400/400',
			stock: 0
		},
		{
			id: 'p1-3',
			shopId: '1',
			name: 'Placeholder Product C',
			price: 9.99,
			description: 'Yet another placeholder product.',
			image: 'https://picsum.photos/seed/prod1c/400/400',
			stock: 5
		}
	]
};
