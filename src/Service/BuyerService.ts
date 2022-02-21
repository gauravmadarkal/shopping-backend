import { Service } from "typedi";
import { DBRepository } from "../Repository";


@Service()
export class BuyerService {
	constructor(
		private readonly dbRepository: DBRepository
	) {}
	
	public async getCart(userId: string): Promise<any> {
		const cart = await this.dbRepository.getCart();
		const userCart = cart.filter(c => c.userId === userId);
		return userCart;
	}

	public async searchItem(category: string, keywords: string[]): Promise<any> {
		const products = await this.dbRepository.getProducts();
		const filteredProducts = products
			.filter(p => p.itemCategory === category && 
				(keywords.length === 0 || 
					keywords
					.filter((k: string) => (p.keywords.map(pk => pk.value))
						.indexOf(k.toLowerCase()) !== -1).length > 0));
		return filteredProducts;
	}

	public async addItemToCart(cartItem: any): Promise<any> {
		const cart = await this.getCart(cartItem.userId);
		cart.push(cartItem);
		await this.dbRepository.putCart(cart);
	}

	public async removeFromCart(cartItem: any): Promise<any> {
		const cart = await this.getCart(cartItem.userId);
		const updatedCart = cart.map((item: any) => {
			if (item.userId === cartItem.userId && item.itemId === cartItem.itemId) {
				if (item.quantity > cartItem.quantity) {
					return {
						itemId: item.itemId,
						quantity: item.quantity - cartItem.quantity,
						userId: item.userId
					};
				}
				return undefined;
			} else {
				return item;
			}
		});
		await this.dbRepository.putCart(updatedCart);
	}

	public async clearCart(userId: any): Promise<any> {
		const cart = await this.getCart(userId);
		const updatedCart = cart.map((item: any) => {
			if (item.userId !== userId) {
				return item;
			}
			return undefined;
		});
		this.dbRepository.putCart(updatedCart);
	}
}