import LoginController from '@/controllers/login.controller.js';
import { FastifyInstance } from 'fastify';
import { loginPreHandler } from './preHandlers/login.preHandler.js';
import { loginSchema, type LoginRequest } from './schemas/login.schema.js';

export default async function loginRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: LoginRequest }>(
    '/protected',
    {
      preHandler: loginPreHandler,
      schema: loginSchema,
    },
    LoginController.login
  );
}
