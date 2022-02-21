import { Service } from "typedi";
import { Seller } from "../Models/Seller";
import { DBRepository } from "../Repository";


@Service()
export class SellerService {
	constructor(
		private readonly dbRepository: DBRepository
	) {}
	
	public async getSellerItems(sellerId: string): Promise<Seller[] | any> {
		const sellerProductIds = await this.dbRepository.getSellerProducts();
		console.log(sellerProductIds);
		const productIds = sellerProductIds.filter((sp: any) => sp.sellerId === sellerId)?.[0]?.products?.map((p: any) => p.id);
		if (productIds) {
			const products = await this.dbRepository.getProducts();
			const sellerProducts = products.filter(p => productIds.indexOf(p.itemId) > -1);
			return sellerProducts;
		}
		return undefined;
	}

	public async addSellerItem(item: any, sellerId: string): Promise<Seller[] | any> {
		const products = await this.dbRepository.getProducts();
		const sellerProductIds = await this.dbRepository.getSellerProducts();
		const existingCount = products.filter(p => p.itemCategory === item.itemCategory).length;
		const id = `${item.itemCategory.substr(0,1).toLowerCase()}${existingCount + 1}`;
		item.itemId = id;
		sellerProductIds.forEach((sp: any) => {
			if (sp.sellerId === sellerId) {
				sp.products.push({ id });
			}
		});
		console.log(item);
		await this.dbRepository.addProduct(item);
		await this.dbRepository.putSellerProduct(sellerProductIds);
	}

	public async updateSellerItem(itemId: string, newSalePrice: number): Promise<boolean> {
		const products = await this.dbRepository.getProducts();
		const index = products.findIndex(x => x.itemId === itemId);
		if (index !== -1) {
			products[index].salePrice = newSalePrice;
			await this.dbRepository.updateProducts(products);
			return true;
		} else {
			return false;
		}
	}

	public async removeSellerItem(itemId: string, quantity: number): Promise<Seller[] | any> {
		const products = await this.dbRepository.getProducts();
		const i = products.findIndex(x => x.itemId === itemId);
		if (i !== -1) {
			if (products[i].quantity >= quantity) {
				products[i].quantity -= quantity;
			} else {
				products[i].quantity = 0;
			}
			await this.dbRepository.updateProducts(products);
			return true;
		}
		return false;
	}

	public async getSellerRating(sellerId: string): Promise<any> {
		const sellers = await this.dbRepository.getSellers();
		const seller = sellers.filter((s: any) => s.sellerId === sellerId)?.[0];
		const sellerRating = seller.sellerLikes === 0 ? 0 : (seller.sellerLikes / (seller.sellerLikes + seller.sellerDislikes)) * 100;
		return sellerRating;
	}

	public async addFeedback(feedback: any): Promise<any> {
		const sellers = await this.dbRepository.getSellers();
		const updatedSellers = sellers.map((seller: any) => {
			if (seller.sellerId === feedback.sellerId) {
				let uSeller;
				if (feedback.isPositive) {
					uSeller = { ...seller, sellerLikes: seller.sellerLikes + 1 };
				} else {
					uSeller = { ...seller, sellerLikes: seller.sellerDislikes + 1 };
				}
				return uSeller;
			}
			return seller;
		});
		await this.dbRepository.updateSellers(updatedSellers);
	}
}