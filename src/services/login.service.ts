import type { AuthUser } from "fastify";
import { DEV } from "@/configs/env.config.js";
import { logger } from "@/configs/log.config.js";
import type { LoginResponse } from "@/routes/schemas/login.schema.js";

export class LoginService {
	async login(
		auth: AuthUser,
		email: string,
		password: string,
	): Promise<LoginResponse> {
		if (DEV) {
			logger.info({ email, password }, "LoginService.login");
		}
		// mock response // loginResponseSchema
		const response: LoginResponse = {
			accessToken: "mocked-access-token",
			user: {
				id: auth.userId,
			},
			cookies: {
				session_id: "mocked-session-id",
				access_token: "mocked-access-token",
			},
		};
		return response;
	}
}
