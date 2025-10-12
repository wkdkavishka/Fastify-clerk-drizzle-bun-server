import LoginController from '@/controllers/login.controller.js';
import { clerkMiddleware } from '@/middlewares/clerk.middleware.js';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { loginSchema, type LoginRequest } from './schemas/login.schema.js';

export const loginRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // just a test route
  fastify.post<{ Body: LoginRequest }>(
    '/protected',
    {
      preHandler: clerkMiddleware,
      schema: loginSchema,
    },
    LoginController.login
  );
};

export default loginRoutes;
