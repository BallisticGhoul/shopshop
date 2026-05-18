import { fail, redirect } from '@sveltejs/kit';
import { verifyCredentials, createSession } from '$lib/server/auth';
import { dev } from '$app/environment';

export function load({ locals, url }) {
	if (locals.user) throw redirect(303, url.searchParams.get('redirect') ?? '/dashboard');
}

export const actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const username = (data.get('username') as string)?.trim();
		const password = data.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Username and password are required.' });
		}

		const user = await verifyCredentials(username, password);
		if (!user) {
			return fail(400, { error: 'Invalid username or password.' });
		}

		const sessionId = await createSession(user.id, user.username);
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, url.searchParams.get('redirect') ?? '/dashboard');
	}
};
