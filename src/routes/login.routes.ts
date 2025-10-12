import { ENV } from '@/configs/env.config.js';
import LoginController from '@/controllers/login.controller.js';
import { clerkMiddleware } from '@/middlewares/clerk.middleware.js';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { loginPreHandler } from './preHandlers/login.preHandler.js';
import { loginSchema, type LoginRequest } from './schemas/login.schema.js';

export const loginRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: LoginRequest }>(
    '/protected',
    {
      preHandler: ENV.BUN_ENV === 'prod' ? clerkMiddleware : loginPreHandler,
      schema: loginSchema,
    },
    LoginController.login
  );
};

export default loginRoutes;
