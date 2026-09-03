import { fail, redirect } from '@sveltejs/kit';
import {
	getPendingMfa,
	deletePendingMfa,
	createSession,
	getUser
} from '$lib/server/auth';
import { verifyTotp } from '$lib/server/totp';
import {
	createEmailCode,
	sendLoginCodeEmail,
	verifyEmailCode,
	consumeRecoveryCode
} from '$lib/server/mfa';
import { dev } from '$app/environment';

/** Reveal only enough of the address to be recognisable. */
function maskEmail(email: string): string {
	const [name, domain] = email.split('@');
	if (!domain) return email;
	const shown = name.slice(0, 2);
	return `${shown}${'•'.repeat(Math.max(1, name.length - 2))}@${domain}`;
}

export async function load({ cookies, locals, url }) {
	if (locals.user) throw redirect(303, url.searchParams.get('redirect') ?? '/dashboard');

	const token = cookies.get('mfa_pending');
	const pending = token ? await getPendingMfa(token) : null;
	if (!pending) throw redirect(303, '/login');

	const user = await getUser(pending.username);
	if (!user) throw redirect(303, '/login');

	return { username: user.username, maskedEmail: maskEmail(user.email) };
}

export const actions = {
	verify: async ({ request, cookies, url }) => {
		const token = cookies.get('mfa_pending');
		const pending = token ? await getPendingMfa(token) : null;
		if (!pending) return fail(400, { error: 'Your sign-in attempt expired. Start again.' });

		const user = await getUser(pending.username);
		if (!user) return fail(400, { error: 'Your sign-in attempt expired. Start again.' });

		const code = ((await request.formData()).get('code') as string)?.trim() ?? '';
		if (!code) return fail(400, { error: 'Enter your verification code.' });

		// Any enrolled factor is acceptable here: the authenticator code, a
		// code emailed on request, or a single-use recovery code.
		const accepted =
			(user.totpSecret ? await verifyTotp(user.totpSecret, code) : false) ||
			(await verifyEmailCode(user.id, code)) ||
			(await consumeRecoveryCode(user, code));

		if (!accepted) return fail(400, { error: 'That code is not valid.' });

		await deletePendingMfa(token!);
		cookies.delete('mfa_pending', { path: '/' });

		const sessionId = await createSession(user.id, user.username);
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, url.searchParams.get('redirect') ?? '/dashboard');
	},

	emailCode: async ({ cookies }) => {
		const token = cookies.get('mfa_pending');
		const pending = token ? await getPendingMfa(token) : null;
		if (!pending) return fail(400, { error: 'Your sign-in attempt expired. Start again.' });

		const user = await getUser(pending.username);
		if (!user) return fail(400, { error: 'Your sign-in attempt expired. Start again.' });

		await sendLoginCodeEmail(user, await createEmailCode(user.id));
		return { sent: true };
	}
};
