// Base error response type
export type ErrorResponse = {
	statusCode: number;
	error: string;
	message: string;
	[key: string]: unknown;
};

// Type for HTTP status codes
export type HttpStatusCode =
	| 400 // Bad Request
	| 401 // Unauthorized
	| 403 // Forbidden
	| 404 // Not Found
	| 409 // Conflict
	| 422 // Unprocessable Entity
	| 429 // Too Many Requests
	| 500; // Internal Server Error

// Type for error response schema
type ErrorResponseSchema = {
	type: "object";
	properties: {
		statusCode: { type: "number" };
		error: { type: "string" };
		message: { type: "string" };
	};
	required: ["statusCode", "error", "message"];
	additionalProperties: true;
	description?: string;
};

// Base error response schema
const errorResponseSchema: ErrorResponseSchema = {
	type: "object",
	properties: {
		statusCode: { type: "number" },
		error: { type: "string" },
		message: { type: "string" },
	},
	required: ["statusCode", "error", "message"],
	additionalProperties: true,
} as const;

// Type for error responses mapping
type ErrorResponses = {
	[K in HttpStatusCode]: ErrorResponseSchema & { description: string };
};

// Error responses with proper typing
const errorResponses: ErrorResponses = {
	400: {
		...errorResponseSchema,
		description: "Bad Request",
	},
	401: {
		...errorResponseSchema,
		description: "Unauthorized",
	},
	403: {
		...errorResponseSchema,
		description: "Forbidden",
	},
	404: {
		...errorResponseSchema,
		description: "Not Found",
	},
	409: {
		...errorResponseSchema,
		description: "Conflict",
	},
	422: {
		...errorResponseSchema,
		description: "Unprocessable Entity",
	},
	429: {
		...errorResponseSchema,
		description: "Too Many Requests",
	},
	500: {
		...errorResponseSchema,
		description: "Internal Server Error",
	},
} as const;

// Type-safe error response creator
export function createErrorResponse<
	T extends Record<string, unknown> = Record<string, never>,
>(
	statusCode: HttpStatusCode,
	message: string,
	error: string = "Error",
	additionalInfo?: T,
): ErrorResponse & T {
	return {
		statusCode,
		error,
		message,
		...(additionalInfo || ({} as T)),
	} as ErrorResponse & T;
}

// Type for common error responses
export type CommonErrorResponses = {
	[K in keyof typeof errorResponses]: (typeof errorResponses)[K];
};

// Export common error responses with proper typing
export const commonErrorResponses: CommonErrorResponses = {
	400: errorResponses[400],
	401: errorResponses[401],
	403: errorResponses[403],
	404: errorResponses[404],
	409: errorResponses[409],
	422: errorResponses[422],
	429: errorResponses[429],
	500: errorResponses[500],
} as const;
