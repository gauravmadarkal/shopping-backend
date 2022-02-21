import { Service } from "typedi";
// import * as grpc from '@grpc/grpc-js';
// import * as protoLoader from '@grpc/proto-loader';
// import * as path from 'path';
import { Product } from "../Models/Product";
// import { User } from "../Models/User";
import { GrpcService } from "../Decorators/GrpcService";


@Service()
export class DBRepository {
	// const PROTO_PATH = "./data";
	constructor(
		@GrpcService('product') private productServiceClient: any,
		@GrpcService('seller') private sellerServiceClient: any,
		@GrpcService('sellerProduct') private sellerProductsServiceClient: any,
		@GrpcService('user') private userServiceClient: any,
		@GrpcService('token') private tokenServiceClient: any,
		@GrpcService('cart') private cartServiceClient: any,
	) {}

	public getProducts(): Promise<Product[]> {
		return new Promise((resolve, reject) => {
			this.productServiceClient.getProducts({}, (error: any, response: any) => {
				if (error) {
					reject(error);
				}
				resolve(response.products);
			});
		});
	};
	
	public addProduct(product: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.productServiceClient.addProduct({ product }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};
	
	public updateProducts(products: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.productServiceClient.updateProducts({ products }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};
	
	public getSellers(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.sellerServiceClient.getSellers({}, (error: any, response: any) => {
				if (error) {
					reject(error);
				}
				resolve(response.sellers);
			});
		});
	};
	
	public addSeller(seller: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.sellerServiceClient.addSeller({ seller }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};

	public getSellerProducts(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.sellerProductsServiceClient.getSellerProducts({}, (error: any, response: any) => {
				if (error) {
					reject(error);
				}
				resolve(response.sellerProducts);
			});
		});
	};

	public putSellerProduct(sellerProducts: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.sellerProductsServiceClient.putSellerProduct({ sellerProducts }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};

	public getUsers(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.userServiceClient.getUsers({}, (error: any, response: any) => {
				if (error) {
					reject(error);
				}
				resolve(response.users);
			});
		});
	};

	public addUser(user: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.userServiceClient.addUser({ user }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};

	public updateUsers(users: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.userServiceClient.updateUsers({ users }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};

	public getToken(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.tokenServiceClient.getToken({}, (error: any, tokens: any) => {
				if (error) {
					reject(error);
				}
				resolve(tokens);
			});
		});
	};

	public putTokens(tokens: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.tokenServiceClient.addUser({ tokens }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};

	public getCart(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cartServiceClient.getCart({}, (error: any, cart: any) => {
				if (error) {
					reject(error);
				}
				resolve(cart);
			});
		});
	};

	public putCart(cart: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.cartServiceClient.updateCart({ cart }, (error: any, _: any) => {
				if (error) {
					reject(error);
				}
				resolve(null);
			});
		});
	};
}