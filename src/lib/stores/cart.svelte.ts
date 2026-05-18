import type { CartItem, Product } from '$lib/types';

let items = $state<CartItem[]>([]);

export const cart = {
	get items() {
		return items;
	},
	get count() {
		return items.reduce((sum, i) => sum + i.quantity, 0);
	},
	get total() {
		return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
	},
	add(product: Product, shopName: string) {
		const existing = items.find((i) => i.product.id === product.id);
		if (existing) {
			existing.quantity++;
		} else {
			items.push({ product, quantity: 1, shopName });
		}
	},
	remove(productId: string) {
		const idx = items.findIndex((i) => i.product.id === productId);
		if (idx !== -1) items.splice(idx, 1);
	},
	setQuantity(productId: string, quantity: number) {
		if (quantity < 1) {
			this.remove(productId);
			return;
		}
		const item = items.find((i) => i.product.id === productId);
		if (item) item.quantity = quantity;
	},
	clear() {
		items = [];
	}
};
