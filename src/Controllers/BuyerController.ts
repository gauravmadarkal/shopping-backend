import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put, QueryParam, Req } from "routing-controllers";
import { SellerService } from "../Service/SellerService";
import { Service } from "typedi";
// import { BuyerMiddleware } from "src/Middlewares/RoleBasedMiddlerware";
import { BuyerService } from "../Service/BuyerService";
import { ResponseFormatter } from "../Utils";

@Authorized()
@JsonController('/buyer')
@Service()
export class BuyerController {
	constructor(
		private readonly buyerService: BuyerService,
		private readonly sellerService: SellerService
	) {}

	@Get('/cart/display')
	public async displayCart(
		@Req() req: any
	): Promise<any> {
		const cart = await this.buyerService.getCart(req.User.id);
		return ResponseFormatter({ cart }, 200);
	}

	@Get('/item/search')
	public async searchItem(
		@QueryParam("category") category: string,
		@QueryParam("keywords") keywords: string
	): Promise<any> {
		const items = await this.buyerService.searchItem(category, keywords?.split(","));
		return ResponseFormatter(items, 200);
	}
	
	@Post('/cart/item')
	public async updateCart(
		@Body() item: any,
		@Req() req: any
	): Promise<any> {
		await this.buyerService.addItemToCart(item, req.User.id);
		return ResponseFormatter('item added', 200);
	}

	@Delete('/cart/item')
	public async deleteItem(
		@Body() item: any,
		@Req() req: any
	): Promise<any> {
		await this.buyerService.removeFromCart(item, req.User.id);
		return ResponseFormatter('item removed', 200);
	}

	@Put('/cart/item')
	public async clearCart(
		@Req() req: any
	): Promise<any> {
		await this.buyerService.clearCart(req.User.id);
		return ResponseFormatter('cart cleared', 200);
	}

	@Post('/item/purchase')
	public async purchaseItem(
		@Body() details: any,
		@Req() req: any
	): Promise<any> {
		// const card = details.card;
		const buyer = req.User;
		// make api call to external service
		const status = true;
		if (status) {
			await this.buyerService.checkoutCart(buyer.id);
		}
		return ResponseFormatter("Item purchased", 200);
	}

	@Put('/feedback')
	public async provideFeedback(
		@Body() body: any
	): Promise<any> {
		await this.sellerService.addFeedback(body);
		return ResponseFormatter('feedback added', 200);
	}

	@Get('/sellerRating/:id')
	public async getSellerRating(
		@Param('id') id: string
	): Promise<any> {
		const sellerRating = await this.sellerService.getSellerRating(id);
		return ResponseFormatter({ sellerId: id, sellerRating }, 200);
	}

	@Get('/history')
	public async getBuyerHistory(
		@Req() req: any
	): Promise<any> {
		const buyerId = req.User.id;
		const history = await this.buyerService.getHistory(buyerId);
		return ResponseFormatter({ history }, 200);
	}
}