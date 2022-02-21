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
		console.log(sellerProductIds)
		const productIds = sellerProductIds.filter((sp: any) => sp.sellerId === sellerId)?.[0].products.map((p: any) => p.id);
		console.log(productIds);
		const products = await this.dbRepository.getProducts();
		console.log(products);
		const sellerProducts = products.filter(p => productIds.indexOf(p.itemId) > -1);
		return sellerProducts;
	}

	public async addSellerItem(item: any, sellerId: string): Promise<Seller[] | any> {
		const products = await this.dbRepository.getProducts();
		const sellerProductIds = await this.dbRepository.getSellerProducts();
		const existingCount = products.filter(p => p.itemCategory === item.itemCategory).length;
		const id = `${item.itemCategory.substr(0,1).toLowerCase()}${existingCount + 1}`;
		item.itemId = id;
		products.push(item);
		sellerProductIds.forEach(sp => {
			if (sp.sellerId === sellerId) {
				sp.products.push(id);
			}
		});
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
}