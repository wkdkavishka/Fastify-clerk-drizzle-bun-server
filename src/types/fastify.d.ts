import "fastify";
import { JSONSchema7 } from "json-schema";

declare module "fastify" {
	interface AuthUser {
		isAuthenticated: boolean;
		userId: string;
	}

	interface FastifyRequest {
		auth: AuthUser;
	}

	interface FastifySchema {
		cookies?: {
			type?: "object";
			properties?: Record<string, JSONSchema7>;
			required?: string[];
			additionalProperties?: boolean;
		};
	}
}
