import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { loginRouteSchema } from '../schemas/login.schema.js';

export default async function loginRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post(
    '/login',
    {
      schema: loginRouteSchema,
      // preHandler: fastify.clerk.login()
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return { message: 'List of users' };
    }
  );
}
