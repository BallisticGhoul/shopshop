import type { Product } from './types';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: 'featured', label: 'Featured' },
	{ value: 'price-asc', label: 'Price: low to high' },
	{ value: 'price-desc', label: 'Price: high to low' },
	{ value: 'name', label: 'Name: A to Z' }
];

const SORT_KEYS = SORT_OPTIONS.map((o) => o.value);

/** Narrow an arbitrary query-string value to a sort key, falling back to the default. */
export function parseSortKey(value: string | null | undefined): SortKey {
	return SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : 'featured';
}

/**
 * Apply the shop-page sort and stock filter. Returns a new array; the input is
 * left untouched because it may be the shared mock data.
 */
export function arrangeProducts(
	products: Product[],
	sort: SortKey,
	inStockOnly: boolean
): Product[] {
	const result = inStockOnly ? products.filter((p) => p.stock > 0) : [...products];

	switch (sort) {
		case 'price-asc':
			result.sort((a, b) => a.price - b.price);
			break;
		case 'price-desc':
			result.sort((a, b) => b.price - a.price);
			break;
		case 'name':
			result.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case 'featured':
			break;
	}

	return result;
}
