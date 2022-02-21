import { Service } from "typedi";
import { DBRepository } from "../Repository";


@Service()
export class BuyerService {
	constructor(
		private readonly dbRepository: DBRepository
	) {}
	
	public async getCart(userId: string): Promise<any> {
		const cart = await this.dbRepository.getCart();
		const userCart = cart?.filter((c: any) => c.userId === userId);
		return userCart || [];
	}

	public async searchItem(category: string, keywords: string[]): Promise<any> {
		console.log(category, keywords);
		const products = await this.dbRepository.getProducts();
		const filteredProducts = products
			.filter(p => p.itemCategory.toLocaleLowerCase() === category.toLocaleLowerCase() && 
				(keywords == undefined || keywords.length === 0 || 
					keywords
					.filter((k: string) => (p.keywords.map(pk => pk.value.toLocaleLowerCase()))
						.indexOf(k.toLowerCase()) !== -1).length > 0));
		return filteredProducts;
	}

	public async addItemToCart(item: any, userId: string): Promise<any> {
		const cart = await this.dbRepository.getCart();
		const cartItem = { ...item, userId: userId };
		cart.push(cartItem);
		await this.dbRepository.putCart(cart);
	}

	public async removeFromCart(cartItem: any, userId: string): Promise<any> {
		const cart = await this.getCart(userId);
		console.log(cart);
		const updatedCart = cart.map((item: any) => {
			if (item.userId === userId && item.itemId === cartItem.itemId) {
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
		const cart = await this.dbRepository.getCart();
		console.log(cart);
		const updatedCart = cart.map((item: any) => {
			if (item.userId !== userId) {
				return item;
			}
			return undefined;
		});
		if (updatedCart.length === 1 && updatedCart[0] === undefined) {
			await this.dbRepository.putCart([]);
		} else {
			await this.dbRepository.putCart(updatedCart);
		}
	}

	public async checkoutCart(buyerId: string): Promise<any> {
		const cartItems = await this.dbRepository.getCart();
		const userCartItems = cartItems.filter((c: any) => c.userId === buyerId);
		console.log(userCartItems);
		// add cartItems to buyer history
		await this.dbRepository.addToBuyerHistory({ buyerId, cartItems: userCartItems });
		// clear cart
		await this.clearCart(buyerId);
	}

	public async getHistory(buyerId: string): Promise<any> {
		const history = await this.dbRepository.getBuyerHistory();
		console.log("history:", history);
		const buyerhistory = history.filter((h: any) => h.buyerId === buyerId);
		return buyerhistory;
	}
}