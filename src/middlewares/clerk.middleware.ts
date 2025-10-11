import { getAuth } from '@clerk/fastify';
import { FastifyReply, FastifyRequest } from 'fastify';

export const clerkMiddleware = (request: FastifyRequest, reply: FastifyReply): void => {
  try {
    // Use `getAuth()` to access `isAuthenticated` and the user's ID
    const { isAuthenticated, userId } = getAuth(request);

    // if user is not authenticated
    if (!isAuthenticated) {
      throw new Error('Unauthorized : User is not authenticated');
    }

    // Add the auth object to the request with type safety
    request.auth = {
      isAuthenticated,
      userId,
    };
  } catch (error) {
    reply.status(401).send({ error });
  }
};
