import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { loginRouteSchema } from '../schemas/login.schema.js';

export default async function loginRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/login',
    {
      schema: loginRouteSchema,
      // preHandler: fastify.clerk.login()
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log(request.body);
      reply.send({ message: 'List of users' });
    }
  );
}
