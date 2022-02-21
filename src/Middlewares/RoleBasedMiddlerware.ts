import { ExpressMiddlewareInterface } from "routing-controllers";
import { decode } from "../Utils/crypto";

export class SellerMiddleware implements ExpressMiddlewareInterface {
	use(request: any, response: any, next: (err?: any) => any) {
		if (request.headers.token) {
			const user = decode(request.headers.token);
			if (user && user.role === 'seller') {
				request.User = user;
				next()
			}
			return response.status(403).json({
				data: {
					message: "Unauthorized request"
				}
			});
		}	
	}
}

export class BuyerMiddleware implements ExpressMiddlewareInterface {
	use(request: any, response: any, next: (err?: any) => any) {
		if (request.headers.token) {
			const user = decode(request.headers.token);
			if (user && user.role === 'buyer') {
				request.User = user;
				next()
			}
			return response.status(403).json({
				data: {
					message: "Unauthorized request"
				}
			});
		}	
	}
}