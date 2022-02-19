import { Application, json, Request, Response } from 'express';
import {
    MicroframeworkLoader,
    MicroframeworkSettings,
} from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
import { UserController } from '../Controllers/UserController';


export const expressLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined,
) => {
	const expressApp: Application = createExpressServer({ 
		routePrefix: '/api',
		controllers: [UserController],
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
