import { getAuth } from '@clerk/fastify';
import { FastifyReply, FastifyRequest } from 'fastify';

export const loginPreHandler = (request: FastifyRequest, reply: FastifyReply): void => {
  try {
    // Use `getAuth()` to access `isAuthenticated` and the user's ID
    const { isAuthenticated, userId } = getAuth(request);

    // if user is not authenticated
    if (!isAuthenticated) {
      throw new Error('Unauthorized : from login preHandler');
    }

    // // set cookie
    // reply.setCookie('userId', userId, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'lax',
    //   path: '/',
    // });
  } catch (error) {
    reply.log.error(error);
    reply.status(401).send({ error: `${error} : from login preHandler : ` });
  }
};
