import { fail, redirect } from '@sveltejs/kit';
import { createShop } from '$lib/server/auth';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const description = (data.get('description') as string)?.trim();
		const bannerImage = (data.get('bannerImage') as string)?.trim() ?? '';

		if (!name) return fail(400, { error: 'Shop name is required.', description, bannerImage });
		if (!description)
			return fail(400, { error: 'Description is required.', name, bannerImage });
		if (name.length > 80) return fail(400, { error: 'Name is too long.', description, bannerImage });

		await createShop(name, description, bannerImage, locals.user!.username);
		throw redirect(303, '/dashboard');
	}
};
