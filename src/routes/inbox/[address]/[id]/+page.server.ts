import { error, redirect } from '@sveltejs/kit';
import {
	getMessage,
	markRead,
	deleteMessage,
	rawSource,
	normaliseAddress
} from '$lib/server/mail';

const VIEWS = ['html', 'text', 'raw'] as const;
type View = (typeof VIEWS)[number];

export async function load({ params, url }) {
	const address = normaliseAddress(decodeURIComponent(params.address));
	const message = await getMessage(address, params.id);
	if (!message) throw error(404, 'Message not found');

	const requested = url.searchParams.get('view') as View | null;
	const view: View = requested && VIEWS.includes(requested) ? requested : 'html';

	// Opening a message marks it read, exactly as a mail client would.
	const wasUnread = !message.read;
	if (wasUnread) await markRead(address, message.id);

	return { address, message, view, raw: rawSource(message), wasUnread };
}

export const actions = {
	delete: async ({ params }) => {
		const address = normaliseAddress(decodeURIComponent(params.address));
		await deleteMessage(address, params.id);
		throw redirect(303, `/inbox/${encodeURIComponent(address)}`);
	}
};
