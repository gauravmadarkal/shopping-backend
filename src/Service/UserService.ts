import { encode } from "../Utils/crypto";
import { Service } from "typedi";
import { DBRepository } from "../Repository";
import * as crypto from 'crypto';


@Service()
export class UserService {
	constructor(
		private readonly dbRepository: DBRepository
	) {}
	
	public async verifyUser(userName: string, password: string): Promise<any> {
		const users = await this.dbRepository.getUsers();
		console.log(users);
		const user = users.filter((u: any) => u.userName === userName && u.password === password)?.[0];
		if (user) {
			return user;
		}
		return undefined;
	}

	public async generateUserToken(user: any): Promise<string> {
		const token = encode(user.userId, user.role);
		const users = await this.dbRepository.getUsers();
		const updatedUsers = users.map((u: any) => {
			if (u.userId === user.userId) {
				const uUser = { ...u, token: token };
				return uUser; 
			}
			return u;
		});
		await this.dbRepository.updateUsers(updatedUsers);
		return token;
	}

	public async addUser(creds: any, role: string): Promise<any> {
		const user = {
			userName: creds.userName,
			password: creds.password,
			role,
			token: null,
			userId: crypto.randomBytes(16).toString('hex')
		};
		await this.dbRepository.addUser(user);
	}

	public async logout(userId: any): Promise<any> {
		const users = await this.dbRepository.getUsers();
		const updatedUsers = users.map((u: any) => {
			if (u.userId === userId) {
				const uUser = { ...u, token: null };
				return uUser; 
			}
			return u;
		});
		await this.dbRepository.updateUsers(updatedUsers);
	}
}