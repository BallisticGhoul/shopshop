import { redirect } from '@sveltejs/kit';
import { listInbox, emptyMailbox, deleteMessage, normaliseAddress } from '$lib/server/mail';

export async function load({ params, url }) {
	const address = normaliseAddress(decodeURIComponent(params.address));
	const query = url.searchParams.get('q')?.trim() ?? '';
	const messages = await listInbox(address, query);

	return {
		address,
		query,
		messages,
		unread: messages.filter((m) => !m.read).length
	};
}

export const actions = {
	empty: async ({ params }) => {
		const address = normaliseAddress(decodeURIComponent(params.address));
		const removed = await emptyMailbox(address);
		return { emptied: removed };
	},

	delete: async ({ params, request }) => {
		const address = normaliseAddress(decodeURIComponent(params.address));
		const id = (await request.formData()).get('id') as string;
		if (id) await deleteMessage(address, id);
		throw redirect(303, `/inbox/${encodeURIComponent(address)}`);
	}
};
