import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');
	event.locals.user = sessionId ? await getSession(sessionId) : null;
	return resolve(event);
};
