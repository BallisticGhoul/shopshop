import { getAllShops } from '$lib/server/auth';

const PAGE_SIZE = 9;

export async function load({ url }) {
	const allShops = await getAllShops();
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const totalPages = Math.max(1, Math.ceil(allShops.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const shops = allShops.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	return { shops, currentPage, totalPages };
}
