import { Authorized, Body, Delete, Get, JsonController, Post, Put, Req } from "routing-controllers";
import { Service } from "typedi";
// import { BuyerMiddleware } from "src/Middlewares/RoleBasedMiddlerware";
import { BuyerService } from "../Service/BuyerService";
import { ResponseFormatter } from "../Utils";

@Authorized()
@JsonController('/buyer')
@Service()
export class BuyerController {
	constructor(
		private readonly buyerService: BuyerService
	) {}
	
	@Get('/cart/display')
	public async displayCart(
		@Req() req: any
	): Promise<any> {
		const cart = await this.buyerService.getCart(req.Buyer.id);
		return ResponseFormatter(cart, 200);
	}

	@Get('/item/search')
	public async searchItem(
		@Body() item: any
	): Promise<any> {
		const items = await this.buyerService.searchItem(item.category, item.keywords);
		return ResponseFormatter(items, 200);
	}

	@Post('/cart/item')
	public async updateCart(
		@Body() item: any
	): Promise<any> {
		this.buyerService.addItemToCart(item);
		return ResponseFormatter('item added', 200);
	}

	@Delete('/cart/item')
	public async deleteItem(
		@Body() item: any
	): Promise<any> {
		this.buyerService.removeFromCart(item);
		return ResponseFormatter('item removed', 200);
	}

	@Put('/cart/item')
	public async clearCart(
		@Req() req: any
	): Promise<any> {
		this.buyerService.clearCart(req.Buyer.id);
		return ResponseFormatter('cart cleared', 200);
	}
}