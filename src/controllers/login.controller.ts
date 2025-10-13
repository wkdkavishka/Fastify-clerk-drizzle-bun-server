import type { AuthUser, FastifyReply, FastifyRequest } from "fastify";
import type {
	LoginRequest,
	LoginResponse,
} from "@/routes/schemas/login.schema.js";
import { LoginService } from "@/services/login.service.js";

class LoginController {
	loginService: LoginService;
	constructor() {
		this.loginService = new LoginService();
	}
	async login(
		request: FastifyRequest<{ Body: LoginRequest }>,
		reply: FastifyReply,
	): Promise<void> {
		// get auth
		const auth: AuthUser = request.auth;
		const response: LoginResponse = await this.loginService.login(
			auth,
			request.body.email,
			request.body.password,
		);

		reply.send(response);
	}
}

export default LoginController;
