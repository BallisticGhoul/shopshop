import { fail, redirect } from '@sveltejs/kit';
import { createUser, createSession } from '$lib/server/auth';
import { dev } from '$app/environment';

export function load({ locals }) {
	if (locals.user) throw redirect(303, '/dashboard');
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;
		const confirm = data.get('confirm') as string;

		if (!username || !password) {
			return fail(400, { error: 'All fields are required.' });
		}
		if (username.length < 3) {
			return fail(400, { error: 'Username must be at least 3 characters.' });
		}
		if (password !== confirm) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		const user = await createUser(username, password);
		if (!user) {
			return fail(400, { error: 'That username is already taken.' });
		}

		const sessionId = await createSession(user.id, user.username);
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, '/dashboard');
	}
};
