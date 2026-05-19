import { fail, redirect, error } from '@sveltejs/kit';
import { getShop, getShopProducts, updateShop, createProduct, updateProduct, deleteProduct, deleteShop } from '$lib/server/auth';

export async function load({ params, locals }) {
	const shop = await getShop(params.id);
	if (!shop) throw error(404, 'Shop not found');
	if (shop.owner !== locals.user!.username) throw error(403, 'Not your shop');
	const products = await getShopProducts(params.id);
	return { shop, products };
}

export const actions = {
	editShop: async ({ params, request, locals }) => {
		const shop = await getShop(params.id);
		if (!shop || shop.owner !== locals.user!.username) throw error(403, 'Not your shop');

		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const description = (data.get('description') as string)?.trim();
		const bannerImage = (data.get('bannerImage') as string)?.trim() ?? '';

		if (!name) return fail(400, { editError: 'Shop name is required.' });
		if (!description) return fail(400, { editError: 'Description is required.' });
		if (name.length > 80) return fail(400, { editError: 'Name is too long.' });

		await updateShop(params.id, name, description, bannerImage);
		return { editSuccess: true };
	},

	addProduct: async ({ params, request, locals }) => {
		const shop = await getShop(params.id);
		if (!shop || shop.owner !== locals.user!.username) throw error(403, 'Not your shop');

		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const description = (data.get('description') as string)?.trim() ?? '';
		const priceStr = (data.get('price') as string)?.trim();
		const image = (data.get('image') as string)?.trim() ?? '';
		const stockStr = (data.get('stock') as string)?.trim();

		if (!name) return fail(400, { productError: 'Product name is required.' });
		const price = parseFloat(priceStr);
		if (isNaN(price) || price < 0) return fail(400, { productError: 'Invalid price.' });
		const stock = parseInt(stockStr);
		if (isNaN(stock) || stock < 0) return fail(400, { productError: 'Invalid stock.' });

		await createProduct(params.id, name, description, price, image, stock);
		return { productSuccess: true };
	},

	editProduct: async ({ params, request, locals }) => {
		const shop = await getShop(params.id);
		if (!shop || shop.owner !== locals.user!.username) throw error(403, 'Not your shop');

		const data = await request.formData();
		const productId = (data.get('productId') as string)?.trim();
		const name = (data.get('name') as string)?.trim();
		const description = (data.get('description') as string)?.trim() ?? '';
		const priceStr = (data.get('price') as string)?.trim();
		const image = (data.get('image') as string)?.trim() ?? '';
		const stockStr = (data.get('stock') as string)?.trim();

		if (!productId) return fail(400, { productEditError: 'Missing product ID.', productEditId: productId });
		if (!name) return fail(400, { productEditError: 'Product name is required.', productEditId: productId });
		const price = parseFloat(priceStr);
		if (isNaN(price) || price < 0) return fail(400, { productEditError: 'Invalid price.', productEditId: productId });
		const stock = parseInt(stockStr);
		if (isNaN(stock) || stock < 0) return fail(400, { productEditError: 'Invalid stock.', productEditId: productId });

		await updateProduct(params.id, productId, name, description, price, image, stock);
		return { productEditSuccess: true, productEditId: productId };
	},

	deleteProduct: async ({ params, request, locals }) => {
		const shop = await getShop(params.id);
		if (!shop || shop.owner !== locals.user!.username) throw error(403, 'Not your shop');

		const data = await request.formData();
		const productId = data.get('productId') as string;
		if (productId) await deleteProduct(params.id, productId);
		return {};
	},

	deleteShop: async ({ params, locals }) => {
		const shop = await getShop(params.id);
		if (!shop || shop.owner !== locals.user!.username) throw error(403, 'Not your shop');
		await deleteShop(params.id, locals.user!.username);
		redirect(303, '/dashboard');
	}
};
