import { redirect } from '@sveltejs/kit';
import { listMailboxes, normaliseAddress } from '$lib/server/mail';

export async function load() {
	return { mailboxes: await listMailboxes() };
}

export const actions = {
	open: async ({ request }) => {
		const address = ((await request.formData()).get('address') as string)?.trim();
		if (!address) return { error: 'Enter an address.' };
		throw redirect(303, `/inbox/${encodeURIComponent(normaliseAddress(address))}`);
	}
};
