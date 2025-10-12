import LoginController from '@/controllers/login.controller.js';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { loginSchema, type LoginRequest } from './schemas/login.schema.js';

export const loginRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: LoginRequest }>(
    '/protected',
    {
      // preHandler: loginPreHandler,
      schema: loginSchema,
    },
    LoginController.login
  );
};

export default loginRoutes;
