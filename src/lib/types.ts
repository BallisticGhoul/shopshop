export interface User {
	id: string;
	username: string;
	email: string;
	emailVerified: boolean;
	passwordHash: string;
	salt: string;
	/** Base32 TOTP secret. Present once enrollment starts, even if not yet confirmed. */
	totpSecret?: string;
	/** Only true once the user has confirmed enrollment with a valid code. */
	totpEnabled: boolean;
	/** Unused single-use recovery codes, stored hashed. */
	recoveryCodes?: string[];
	createdAt: string;
}

export interface Shop {
	id: string;
	name: string;
	description: string;
	bannerImage: string;
	owner: string;
}

export interface Product {
	id: string;
	shopId: string;
	name: string;
	price: number;
	description: string;
	image: string;
	stock: number;
}

export interface CartItem {
	product: Product;
	quantity: number;
	shopName: string;
}

export interface MailMessage {
	/** Storage id, unique within a mailbox. */
	id: string;
	/** RFC 5322 Message-ID, as a real MTA would stamp it. */
	messageId: string;
	from: string;
	to: string;
	subject: string;
	/** text/plain part. */
	text: string;
	/** text/html part. Always present; generated from the text when not supplied. */
	html: string;
	/** When the message was handed to the mail system. */
	sentAt: string;
	/** When it becomes visible in the mailbox (see DELIVERY_DELAY_MS). */
	deliverAt: string;
	read: boolean;
}
