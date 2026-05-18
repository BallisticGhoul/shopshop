export interface User {
	id: string;
	username: string;
	passwordHash: string;
	salt: string;
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
