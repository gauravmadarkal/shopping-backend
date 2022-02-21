import { Authorized, Body, Delete, Get, JsonController, Post, Put, Req } from "routing-controllers";
import { Service } from "typedi";
import { SellerService } from "../Service/SellerService";
import { ResponseFormatter } from "../Utils";

@Authorized()
@JsonController('/seller')
@Service()
export class SellerController {
	constructor(
		private readonly sellerService: SellerService
	) {}
	
	@Get('/items/display')
	public async display(
		@Req() req: any
	): Promise<any> {
		try {
			const seller = req.User;
			const items = await this.sellerService.getSellerItems(seller.id);
			if (items) {
				return ResponseFormatter(items, 200);
			}
			return ResponseFormatter('No items for this seller', 200);
		} catch(err) {
			return ResponseFormatter(err, 400);
		}
	}

	@Post('/item')
	public async create(
		@Req() req: any,
		@Body() item: any
	): Promise<any> {
		try {
			const seller = req.User;
			await this.sellerService.addSellerItem(item, seller.id);
			return ResponseFormatter("Item added", 200);
		} catch(err) {
			return ResponseFormatter(err, 400);
		}
	}

	@Put('/item')
	public async update(
		@Req() req: any,
		@Body() item: any
	): Promise<any> {
		const status = await this.sellerService.updateSellerItem(item.itemId, item.newSalePrice);
		if (status) {
			return ResponseFormatter("Item updated", 200);
		}
		return ResponseFormatter("Item not found", 400);
	}

	@Delete('/item')
	public async deleteItem(
		@Req() req: any,
		@Body() item: any
	): Promise<any> {
		const status = await this.sellerService.removeSellerItem(item.itemId, item.quantity);
		if (status) {
			return ResponseFormatter("Item updated", 200);
		}
		return ResponseFormatter("Item not found", 400);
	}

	@Get('/rating')
	public async getSellerRating(
		@Req() req: any
	): Promise<any> {
		const sellerId = req.User.id;
		const rating = await this.sellerService.getSellerRating(sellerId);
		console.log(rating);
		return ResponseFormatter({ sellerId, rating }, 200);
	}
}