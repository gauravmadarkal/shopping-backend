import { Application, json, Request, Response } from 'express';
import {
    MicroframeworkLoader,
    MicroframeworkSettings,
} from 'microframework-w3tec';
import { Action, createExpressServer } from 'routing-controllers';
import { decode } from '../Utils/crypto';
import { UserController } from '../Controllers/UserController';
import { BuyerController } from '../Controllers/BuyerController';
import { SellerController } from '../Controllers/SellerController';
import { BuyerMiddleware, SellerMiddleware } from '../Middlewares/RoleBasedMiddlerware';

export const expressLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined,
) => {
	const expressApp: Application = createExpressServer({ 
		routePrefix: '/api',
		// controllers: [UserController],
		controllers: [UserController, BuyerController, SellerController],
		middlewares: [SellerMiddleware, BuyerMiddleware],
		authorizationChecker: async (action: Action, roles: string[]) => {
			const token = action.request.headers['token'];
			if (token) {
				const user = decode(token);
				console.log(user);
				if (user) {
					action.request.User = user;
					return true;
				}
			}
			return false;
		},
		cors: { origin: '*' }
	});
	expressApp.get('/api', (req: Request, res: Response) => {
		return res.json({ 
			name: 'Ecommerce Application',
			apiVersion: '1.0.0',
			author: 'Gaurav Madarkal'	
		});
	});
	expressApp.use(json());
	const expressServer = expressApp.listen(3000);
	settings.setData('expressServer', expressServer);
};
