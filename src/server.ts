import { clerkPlugin } from "@clerk/fastify";
import cookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySensible from "@fastify/sensible";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

import Fastify, { type FastifyInstance } from "fastify";
import db from "./configs/db.config.js";
import { DEV, ENV } from "./configs/env.config.js";
import { logError, logger, loggerConfig } from "./configs/log.config.js";
import { clerkMiddleware } from "./middlewares/clerk.middleware.js";
import loginRoutes from "./routes/login.routes.js";
import { devLoginRoute } from "./temp/dev-login.routes.js";

// Initialize Fastify with JSON Schema type provider and AJV configuration
const server: FastifyInstance = Fastify({
	logger: loggerConfig,
	ajv: {
		customOptions: {
			allErrors: true,
			strict: false,
		},
		plugins: [
			(ajv: unknown) => {
				const ajvErrors = require("ajv-errors");
				return ajvErrors(ajv, { singleError: true });
			},
		],
	},
}).withTypeProvider<JsonSchemaToTsProvider>();

// Initialize database connection
async function checkDatabaseConnection() {
	try {
		// Test the connection
		await db.execute("select 1");
		logger.info(
			"🚀 Database connection established successfully (using postgres-js).",
		);
		return true;
	} catch (error: unknown) {
		const message: string = "Failed to connect to the database:";
		logError(message, error);
		process.exit(1);
	}
}

// Register plugins
async function registerPlugins() {
	// Security headers
	await server.register(fastifyHelmet);

	// CORS
	const origin = `http://${ENV.HOST}:${ENV.PORT}`;
	await server.register(fastifyCors, {
		origin: [origin],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		// allowedHeaders: ['Content-Type', 'Authorization'],
	});
	server.log.info(`CORS enabled for: ${origin}`);

	// Swagger documentation
	await server.register(fastifySwagger, {
		swagger: {
			info: {
				title: "Fastify Clerk Drizzle API",
				description: "API documentation for Fastify Clerk Drizzle Server",
				version: "1.0.0",
			},
			externalDocs: {
				url: "https://swagger.io",
				description: "Find more info here",
			},
			host: `${ENV.HOST}:${ENV.PORT}`,
			schemes: ["http"],
			consumes: ["application/json"],
			produces: ["application/json"],
			securityDefinitions: {
				Bearer: {
					type: "apiKey",
					name: "Authorization",
					in: "header",
					description: "Enter JWT Bearer token in the format: Bearer <token>",
				},
			},
			security: [
				{
					Bearer: [],
				},
			],
			tags: [
				{ name: "health", description: "Health check endpoints" },
				{ name: "auth", description: "Authentication endpoints" },
				// Add more tags as you add more routes
			],
		},
	});

	// Swagger UI
	await server.register(fastifySwaggerUi, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "list",
			deepLinking: false,
		},
		uiHooks: {
			onRequest: (_request, _reply, next) => {
				next();
			},
			preHandler: (_request, _reply, next) => {
				next();
			},
		},
		staticCSP: true,
		transformStaticCSP: (header) => header,
		transformSpecification: (swaggerObject) => {
			return swaggerObject;
		},
		transformSpecificationClone: true,
	});

	// Rate limiting
	await server.register(fastifyRateLimit, {
		max: 100,
		timeWindow: "1 minute",
	});

	// Sensible defaults for Fastify
	await server.register(fastifySensible);

	// Register cookie
	await server.register(cookie, {
		// A secret is required to sign/unsign cookies for security
		secret: ENV.CLERK_COOKIE_SECRET,
		// You can optionally configure auto-parsing options here
	});

	// Register Clerk
	await server.register(clerkPlugin);
}

// register hooks
function registerHooks() {
	//* Clerk middleware for all routes except /docs
	if (DEV) {
		// only for dev environment
		server.addHook("preHandler", async (request, reply) => {
			// Skip middleware for routes
			const routeList = ["/docs", "/dev/dev-login", "/dev/refresh"];
			if (routeList.includes(request.url)) {
				return;
			}
			return clerkMiddleware(request, reply);
		});
	}
}

// routes
async function registerRoutes() {
	//! tood: remove this after testing
	await server.register(devLoginRoute, { prefix: "/dev" });
	//* login routes
	await server.register(loginRoutes, { prefix: "/login" });
}

// Start the server
const start = async () => {
	try {
		// 1. First establish database connection
		logger.info("🔌 Establishing database connection...");
		await checkDatabaseConnection();

		// 2. Register all plugins
		logger.info("🔌 Registering plugins...");
		await registerPlugins();

		// 3. Register hooks
		logger.info("🔌 Registering hooks...");
		registerHooks();

		// 4. Register routes
		logger.info("🔌 Registering routes...");
		await registerRoutes();

		// 5. Start the server only after everything is ready
		const port: number = ENV.PORT;
		const host: string = ENV.HOST;

		logger.info("🚀 Starting server...");
		await server.listen({ port, host });
		logger.info(`✅ Server is running at http://${host}:${port}`);
	} catch (error: unknown) {
		const message: string = "Failed to start server";
		logError(message, error);
		process.exit(1);
	}
};

// Handle graceful shutdown
["SIGINT", "SIGTERM"].forEach((signal) => {
	process.on(signal, async () => {
		await server.close();
		process.exit(0);
	});
});

// Start the application
start();
