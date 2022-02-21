import {
	Body,
	HttpCode,
	JsonController, Param, Post, Put, Res
} from 'routing-controllers';
import { Service } from 'typedi';
import { UserService } from '../Service/UserService';
import { ResponseFormatter } from '../Utils';

@JsonController('/user')
@Service()
export class UserController {
	constructor(
		private readonly userService: UserService
	) {}

	@HttpCode(200)
	@Post('/login')
	public async login(
		@Body() body: any,
		@Res() res: any
	): Promise<any> {
		try {
			const user = await this.userService.verifyUser(body.userName, body.password);
			if (user) {
				const token = await this.userService.generateUserToken(user);
				return ResponseFormatter({ token }, 200);
			}
			return ResponseFormatter("Unauthorized user", 403);
		} catch(err) {
			return ResponseFormatter(err, 400);
		}
	}

	@Put('/logout/:id')
	public async logout(
		@Param('id') id: string
	): Promise<any> {
		try {
			await this.userService.logout(id);
			return ResponseFormatter("User logged out successfully", 200);
		} catch(err) {
			return ResponseFormatter(err, 400);
		}
	}

	@Post('/seller/register')
	public async registerSeller(
		@Body() body: any
	): Promise<any> {
		try {
			await this.userService.addUser(body, 'seller');	
			return ResponseFormatter("User Registered successfully", 200);
		} catch(err) {
			return ResponseFormatter(err, 400);
		}
	}

	@Post('/buyer/register')
	public async registerBuyer(
		@Body() body: any
	): Promise<any> {
		try {
			await this.userService.addUser(body, 'buyer');	
			return ResponseFormatter("User Registered successfully", 200);
		} catch(err) {
			return ResponseFormatter(err, 400);
		}
	}
};