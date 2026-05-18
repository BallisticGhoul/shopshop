import { fail } from '@sveltejs/kit';
import { decrementStock } from '$lib/server/auth';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const address = (data.get('address') as string)?.trim();
		const itemsJson = (data.get('items') as string) ?? '[]';

		if (!name || !address) return fail(400, { error: 'Name and address are required.' });

		let items: Array<{ shopId: string; id: string; quantity: number }> = [];
		try {
			items = JSON.parse(itemsJson);
		} catch {
			return fail(400, { error: 'Invalid cart data.' });
		}

		for (const item of items) {
			await decrementStock(item.shopId, item.id, item.quantity);
		}

		return { success: true, customerName: name };
	}
};
