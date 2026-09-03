import { fail, redirect } from '@sveltejs/kit';
import { getUser, saveUser } from '$lib/server/auth';
import { generateTotpSecret, otpauthUri, verifyTotp } from '$lib/server/totp';
import { generateRecoveryCodes } from '$lib/server/mfa';

export async function load({ locals }) {
	if (!locals.user) throw redirect(303, '/login?redirect=/dashboard/security');
	const user = await getUser(locals.user.username);
	if (!user) throw redirect(303, '/login');

	// A secret without totpEnabled means enrollment was started but never
	// confirmed, so the setup details are shown again on reload.
	const pending = !user.totpEnabled && user.totpSecret ? user.totpSecret : null;

	return {
		email: user.email,
		emailVerified: user.emailVerified,
		totpEnabled: user.totpEnabled,
		recoveryCodesLeft: user.recoveryCodes?.length ?? 0,
		pendingSecret: pending,
		pendingUri: pending ? otpauthUri(pending, user.username) : null
	};
}

export const actions = {
	begin: async ({ locals }) => {
		if (!locals.user) throw redirect(303, '/login');
		const user = await getUser(locals.user.username);
		if (!user) throw redirect(303, '/login');
		if (user.totpEnabled) return fail(400, { error: 'Two-factor is already enabled.' });

		user.totpSecret = generateTotpSecret();
		await saveUser(user);
		return { started: true };
	},

	confirm: async ({ locals, request }) => {
		if (!locals.user) throw redirect(303, '/login');
		const user = await getUser(locals.user.username);
		if (!user) throw redirect(303, '/login');
		if (!user.totpSecret) return fail(400, { error: 'Start setup first.' });

		const code = ((await request.formData()).get('code') as string)?.trim() ?? '';
		if (!(await verifyTotp(user.totpSecret, code))) {
			return fail(400, { error: 'That code is not valid. Check your authenticator and retry.' });
		}

		user.totpEnabled = true;
		await saveUser(user);
		const codes = await generateRecoveryCodes(user);
		return { enabled: true, recoveryCodes: codes };
	},

	disable: async ({ locals }) => {
		if (!locals.user) throw redirect(303, '/login');
		const user = await getUser(locals.user.username);
		if (!user) throw redirect(303, '/login');

		user.totpEnabled = false;
		delete user.totpSecret;
		delete user.recoveryCodes;
		await saveUser(user);
		return { disabled: true };
	}
};
