import { mockShops } from '$lib/mock';

const PAGE_SIZE = 9;

export function load({ url }) {
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const totalPages = Math.ceil(mockShops.length / PAGE_SIZE);
	const currentPage = Math.min(page, totalPages);
	const shops = mockShops.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	return { shops, currentPage, totalPages };
}
