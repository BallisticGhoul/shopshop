import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
	if (!locals.user) {
		throw redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}
	return { user: locals.user };
}
