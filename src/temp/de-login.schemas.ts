// src/routes/dev-login.ts

import type { FastifySchema } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import { commonErrorResponses } from "@/configs/error.config.js";

export const devLoginRequestSchema = {
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
			errorMessage: {
				type: "Password must be a string",
				minLength: "Password must be at least 8 characters long",
			},
		},
	},
	additionalProperties: false,
} as const;

export const devLoginResponseSchema = {
	type: "object",
	properties: {
		token: { type: "string" },
		user: {
			type: "object",
			properties: {
				id: { type: "string" },
				email: { type: "string", format: "email" },
			},
			required: ["id", "email"],
		},
	},
	required: ["token", "user"],
	additionalProperties: false,
} as const;

export const devLoginSchema: FastifySchema = {
	body: devLoginRequestSchema,
	response: {
		200: {
			...devLoginResponseSchema,
			description: "Successful login",
		},
		...commonErrorResponses,
	},
	cookies: {
		type: "object",
		properties: {
			session_id: { type: "string" },
			access_token: { type: "string" },
		},
	},
} as const;

export type DevLoginRequest = FromSchema<typeof devLoginRequestSchema>;
export type DevLoginResponse = FromSchema<typeof devLoginResponseSchema>;
export type DevLoginSchema = FromSchema<typeof devLoginSchema>;
