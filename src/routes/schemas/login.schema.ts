import type { FastifySchema } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import { commonErrorResponses } from "@/configs/error.config.js";

export const loginRequestSchema = {
	type: "object",
	required: ["email", "password"],
	properties: {
		email: {
			type: "string",
			format: "email",
			errorMessage: {
				type: "Email must be a string",
				format: "Please provide a valid email address",
			},
		},
		password: {
			type: "string",
			minLength: 8,
			maxLength: 100,
			errorMessage: {
				type: "Password must be a string",
				minLength: "Password must be at least 8 characters long",
				maxLength: "Password must be less than 100 characters",
			},
		},
		platform: {
			// optional for dev login
			type: "string",
		},
	},
	additionalProperties: false,
} as const;

export const loginResponseSchema = {
	type: "object",
	properties: {
		accessToken: { type: "string" },
		user: {
			type: "object",
			properties: {
				id: { type: "string" },
			},
			required: ["id"],
		},
		cookies: {
			type: "object",
			properties: {
				session_id: { type: "string" },
				access_token: { type: "string" },
			},
			required: ["session_id", "access_token"],
			additionalProperties: false,
		},
	},
	required: ["accessToken", "user", "cookies"],
} as const;

export const loginSchema: FastifySchema = {
	body: loginRequestSchema,
	response: {
		200: loginResponseSchema,
		...commonErrorResponses,
	},
} as const;

// Export TypeScript types from JSON schemas
export type LoginRequest = FromSchema<typeof loginRequestSchema>;
export type LoginResponse = FromSchema<typeof loginResponseSchema>;
