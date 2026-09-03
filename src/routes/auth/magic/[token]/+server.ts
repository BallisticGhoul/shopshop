import { redirect } from '@sveltejs/kit';
import { consumeMagicLink } from '$lib/server/mfa';
import { getUser, createSession, createPendingMfa, saveUser } from '$lib/server/auth';
import { dev } from '$app/environment';

export async function GET({ params, cookies }) {
	const claim = await consumeMagicLink(params.token);
	if (!claim) throw redirect(303, '/login/email?expired=1');

	const user = await getUser(claim.username);
	if (!user) throw redirect(303, '/login/email?expired=1');

	// Following the link proves control of the mailbox.
	if (!user.emailVerified) {
		user.emailVerified = true;
		await saveUser(user);
	}

	// A magic link proves one factor. If a second is enrolled, still ask for it.
	if (user.totpEnabled) {
		const pending = await createPendingMfa(user.id, user.username);
		cookies.set('mfa_pending', pending, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 10 * 60
		});
		throw redirect(303, '/login/mfa');
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
