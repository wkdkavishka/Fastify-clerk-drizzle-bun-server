import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { loginRouteSchema } from '../schemas/login.schema.js';

export default async function loginRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/test',
    {
      schema: loginRouteSchema,
      // preHandler: fastify.clerk.login()
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log(request.body);
      // mock response // loginResponseSchema
      const response = {
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
        user: {
          id: 'mocked-user-id',
          email: 'mocked-user-email',
        },
      };
      reply.send(response);
    }
  );
}
