import { fail, redirect } from '@sveltejs/kit';
import { getUserByEmail } from '$lib/server/auth';
import { createMagicLink, sendMagicLinkEmail } from '$lib/server/mfa';

export function load({ locals }) {
	if (locals.user) throw redirect(303, '/dashboard');
}

export const actions = {
	default: async ({ request, url }) => {
		const email = ((await request.formData()).get('email') as string)?.trim();
		if (!email) return fail(400, { error: 'Enter your email address.' });

		const user = await getUserByEmail(email);
		if (user) {
			const token = await createMagicLink(user);
			await sendMagicLinkEmail(user, `${url.origin}/auth/magic/${token}`);
		}

		// Reported as sent either way, so the response cannot be used to
		// discover which addresses have accounts.
		return { sent: true, email };
	}
};
