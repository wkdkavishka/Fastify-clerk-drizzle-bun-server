import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import LoginController from "@/controllers/login.controller.js";
import { clerkMiddleware } from "@/middlewares/clerk.middleware.js";
import { type LoginRequest, loginSchema } from "./schemas/login.schema.js";

export const loginRoutes: FastifyPluginAsync = async (
	fastify: FastifyInstance,
) => {
	const loginController = new LoginController();
	// just a test route
	fastify.post<{ Body: LoginRequest }>(
		"/protected",
		{
			preHandler: clerkMiddleware,
			schema: loginSchema,
		},
		loginController.login,
	);
};

export default loginRoutes;
