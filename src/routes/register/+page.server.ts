import { fail, redirect } from '@sveltejs/kit';
import { createUser, createSession } from '$lib/server/auth';
import { sendMail } from '$lib/server/mail';
import { dev } from '$app/environment';

export function load({ locals }) {
	if (locals.user) throw redirect(303, '/dashboard');
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const username = (data.get('username') as string)?.trim();
		const email = (data.get('email') as string)?.trim();
		const password = data.get('password') as string;
		const confirm = data.get('confirm') as string;

		if (!username || !email || !password) {
			return fail(400, { error: 'All fields are required.' });
		}
		if (username.length < 3) {
			return fail(400, { error: 'Username must be at least 3 characters.' });
		}
		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Enter a valid email address.' });
		}
		if (password !== confirm) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		const user = await createUser(username, email, password);
		if (!user) {
			return fail(400, { error: 'That username or email is already taken.' });
		}

		await sendMail({
			to: user.email,
			subject: 'Welcome to ShopShop',
			text: [
				`Hi ${user.username},`,
				'',
				'Your ShopShop account is ready.',
				'',
				`Sign in any time at ${url.origin}/login`,
				'',
				'You can add two-factor authentication from your dashboard.'
			].join('\n')
		});

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
