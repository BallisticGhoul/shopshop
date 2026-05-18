import type { Shop, Product } from './types';

export const mockShops: Shop[] = [
	{
		id: '1',
		name: 'The Cozy Corner',
		description: 'Handmade ceramics and home goods crafted with care.',
		bannerImage: 'https://picsum.photos/seed/cozycorner/800/300',
		owner: 'alice'
	},
	{
		id: '2',
		name: 'Pixel & Print',
		description: 'Art prints, posters, and digital designs for your walls.',
		bannerImage: 'https://picsum.photos/seed/pixelprint/800/300',
		owner: 'bob'
	},
	{
		id: '3',
		name: 'Green Thumb',
		description: 'Rare houseplants and everything you need to keep them thriving.',
		bannerImage: 'https://picsum.photos/seed/greenthumb/800/300',
		owner: 'carol'
	},
	{
		id: '4',
		name: 'Vintage Vault',
		description: 'Curated vintage finds from decades past.',
		bannerImage: 'https://picsum.photos/seed/vintagevault/800/300',
		owner: 'dave'
	},
	{
		id: '5',
		name: 'Brew Lab',
		description: 'Specialty coffee gear, beans, and accessories.',
		bannerImage: 'https://picsum.photos/seed/brewlab/800/300',
		owner: 'eve'
	},
	{
		id: '6',
		name: 'Paper & Ink',
		description: 'Stationery, notebooks, and writing instruments.',
		bannerImage: 'https://picsum.photos/seed/paperink/800/300',
		owner: 'frank'
	}
];

export const mockProducts: Record<string, Product[]> = {
	'1': [
		{
			id: 'p1-1',
			shopId: '1',
			name: 'Ceramic Mug',
			price: 24.99,
			description: 'Hand-thrown stoneware mug, holds 12oz. Dishwasher safe.',
			image: 'https://picsum.photos/seed/mug/400/400',
			stock: 8
		},
		{
			id: 'p1-2',
			shopId: '1',
			name: 'Bud Vase',
			price: 18.00,
			description: 'Slim stoneware vase, perfect for a single stem.',
			image: 'https://picsum.photos/seed/vase/400/400',
			stock: 5
		},
		{
			id: 'p1-3',
			shopId: '1',
			name: 'Serving Bowl',
			price: 42.00,
			description: 'Wide, shallow bowl ideal for salads or fruit.',
			image: 'https://picsum.photos/seed/bowl/400/400',
			stock: 3
		},
		{
			id: 'p1-4',
			shopId: '1',
			name: 'Espresso Cup Set',
			price: 34.00,
			description: 'Set of two 3oz espresso cups with saucers.',
			image: 'https://picsum.photos/seed/espresso/400/400',
			stock: 0
		}
	],
	'2': [
		{
			id: 'p2-1',
			shopId: '2',
			name: 'City Grid Print',
			price: 29.00,
			description: 'Minimal city map art print, 12×16 inches. Unframed.',
			image: 'https://picsum.photos/seed/citygrid/400/400',
			stock: 20
		},
		{
			id: 'p2-2',
			shopId: '2',
			name: 'Abstract No. 7',
			price: 45.00,
			description: 'Limited edition abstract risograph print, 8×10 inches.',
			image: 'https://picsum.photos/seed/abstract7/400/400',
			stock: 7
		},
		{
			id: 'p2-3',
			shopId: '2',
			name: 'Botanical Series',
			price: 22.00,
			description: 'Set of three botanical illustration prints, 5×7 inches.',
			image: 'https://picsum.photos/seed/botanical/400/400',
			stock: 15
		}
	],
	'3': [
		{
			id: 'p3-1',
			shopId: '3',
			name: 'Monstera Deliciosa',
			price: 38.00,
			description: 'Classic split-leaf monstera in a 6" nursery pot.',
			image: 'https://picsum.photos/seed/monstera/400/400',
			stock: 4
		},
		{
			id: 'p3-2',
			shopId: '3',
			name: 'String of Pearls',
			price: 22.00,
			description: 'Trailing succulent in a 4" hanging pot.',
			image: 'https://picsum.photos/seed/stringofpearls/400/400',
			stock: 6
		},
		{
			id: 'p3-3',
			shopId: '3',
			name: 'Ceramic Plant Stand',
			price: 55.00,
			description: 'Hand-painted ceramic stand, fits pots up to 8".',
			image: 'https://picsum.photos/seed/plantstand/400/400',
			stock: 2
		},
		{
			id: 'p3-4',
			shopId: '3',
			name: 'Propagation Kit',
			price: 18.00,
			description: 'Three glass propagation tubes with wooden stand.',
			image: 'https://picsum.photos/seed/propkit/400/400',
			stock: 12
		}
	],
	'4': [
		{
			id: 'p4-1',
			shopId: '4',
			name: 'Leather Satchel',
			price: 120.00,
			description: "1970s leather satchel, genuine patina. 14\" wide.",
			image: 'https://picsum.photos/seed/satchel/400/400',
			stock: 1
		},
		{
			id: 'p4-2',
			shopId: '4',
			name: 'Enamel Brooch Set',
			price: 28.00,
			description: 'Set of four 1960s floral enamel brooches.',
			image: 'https://picsum.photos/seed/brooch/400/400',
			stock: 3
		},
		{
			id: 'p4-3',
			shopId: '4',
			name: 'Brass Table Lamp',
			price: 85.00,
			description: 'Mid-century brass desk lamp, rewired, working.',
			image: 'https://picsum.photos/seed/brasslamp/400/400',
			stock: 1
		}
	],
	'5': [
		{
			id: 'p5-1',
			shopId: '5',
			name: 'Hand Grinder',
			price: 68.00,
			description: 'Ceramic burr hand grinder with stepless adjustment.',
			image: 'https://picsum.photos/seed/grinder/400/400',
			stock: 9
		},
		{
			id: 'p5-2',
			shopId: '5',
			name: 'Ethiopian Yirgacheffe',
			price: 19.00,
			description: '250g whole bean, washed process. Notes of blueberry and jasmine.',
			image: 'https://picsum.photos/seed/yirg/400/400',
			stock: 30
		},
		{
			id: 'p5-3',
			shopId: '5',
			name: 'Fellow Stagg Kettle',
			price: 95.00,
			description: 'Electric pour-over kettle with precision temperature control.',
			image: 'https://picsum.photos/seed/kettle/400/400',
			stock: 5
		}
	],
	'6': [
		{
			id: 'p6-1',
			shopId: '6',
			name: 'Traveler Notebook',
			price: 24.00,
			description: 'Kraft cover with three refillable inserts included.',
			image: 'https://picsum.photos/seed/notebook/400/400',
			stock: 18
		},
		{
			id: 'p6-2',
			shopId: '6',
			name: 'Fountain Pen Starter',
			price: 32.00,
			description: 'JINHAO steel nib pen with a bottle of black ink.',
			image: 'https://picsum.photos/seed/fountainpen/400/400',
			stock: 11
		},
		{
			id: 'p6-3',
			shopId: '6',
			name: 'Washi Tape Set',
			price: 14.00,
			description: 'Eight rolls of patterned washi tape.',
			image: 'https://picsum.photos/seed/washi/400/400',
			stock: 25
		},
		{
			id: 'p6-4',
			shopId: '6',
			name: 'Letterpress Cards',
			price: 16.00,
			description: 'Set of six blank letterpress notecards with envelopes.',
			image: 'https://picsum.photos/seed/letterpress/400/400',
			stock: 14
		}
	]
};
