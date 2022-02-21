import { Container } from 'typedi';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

export function GrpcService(serviceId: string): ParameterDecorator {
    return (object: any, propertyKey, index): any => {
		const propertyName = propertyKey ? propertyKey.toString() : '';
		const options = {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true,
		};
		var packageDefinition = protoLoader.loadSync(path.join(__dirname,'/proto/data.proto'), options);
		const loadedPkgDef: any = grpc.loadPackageDefinition(packageDefinition);
		const connection = grpc.credentials.createInsecure();
		const db_host  = 'localhost';
		const db_port = '50051';
        switch(serviceId) {
			case 'product':
				const productServiceClient = new loadedPkgDef.ProductService(
					`${db_host}:${db_port}`,
					connection
				);
				Container.registerHandler({
					object,
					propertyName,
					index,
					value: () => productServiceClient,
				});
			case 'seller':
				const sellerServiceClient = new loadedPkgDef.SellerService(
					`${db_host}:${db_port}`,
					connection
				);
				Container.registerHandler({
					object,
					propertyName,
					index,
					value: () => sellerServiceClient,
				});
			case 'sellerProduct':
				const sellerProductServiceClient = new loadedPkgDef.SellerProductsService(
					`${db_host}:${db_port}`,
					connection
				);
				Container.registerHandler({
					object,
					propertyName,
					index,
					value: () => sellerProductServiceClient,
				});
			case 'user':
				const userServiceClient = new loadedPkgDef.UserService(
					`${db_host}:${db_port}`,
					connection
				);
				Container.registerHandler({
					object,
					propertyName,
					index,
					value: () => userServiceClient,
				});
			case 'token':
				const tokenServiceClient = new loadedPkgDef.TokenService(
					`${db_host}:${db_port}`,
					connection
				);
				Container.registerHandler({
					object,
					propertyName,
					index,
					value: () => tokenServiceClient,
				});
			case 'cart':
				const cartServiceClient = new loadedPkgDef.CartService(
					`${db_host}:${db_port}`,
					connection
				);
				Container.registerHandler({
					object,
					propertyName,
					index,
					value: () => cartServiceClient,
				});
			case 'history':
				const buyerHistoryServiceClient = new loadedPkgDef.BuyerHistoryService(
					`${db_host}:${db_port}`,
					connection
				);
				Container.registerHandler({
					object,
					propertyName,
					index,
					value: () => buyerHistoryServiceClient,
				});
		}
    };
}
