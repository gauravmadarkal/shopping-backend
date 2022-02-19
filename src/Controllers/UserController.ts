import {
	Body,
	Controller, Get, Param, Post, Put
} from 'routing-controllers';
import { ResponseFormatter } from '../Utils';


@Controller('/user')
export class UserController {

	@Post('/login')
	public async login(
		@Body() body: any
	) {
		console.log('User login');
		return ResponseFormatter("logged in successfully", 200);
	}

	@Post('/register')
	public async register(
		@Body() body: any
	) {
		console.log('User login');
		return ResponseFormatter("registered successfully", 200);
	}

	@Put('/logout/:id')
	public async logout(
		@Param('id') id: string
	) {
		console.log('User login');
		return ResponseFormatter("logged out successfully", 200);
	}

};