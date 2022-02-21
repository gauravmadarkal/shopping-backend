import { ExpressMiddlewareInterface } from "routing-controllers";
import { decode } from "../Utils/crypto";

export class AuthorizationMiddleware implements ExpressMiddlewareInterface {
	use(request: any, response: any, next: (err?: any) => any) {
		if (request.headers.token) {
			const user = decode(request.headers.token);
			if (user) {
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