// import type { AuthUser } from '@/types/fastify.d.js';
import { DEV } from '@/configs/env.config.js';
import { logError } from '@/configs/log.config.js';
import { getAuth } from '@clerk/fastify';
import { AuthUser, FastifyReply, FastifyRequest } from 'fastify';

export const clerkMiddleware = (request: FastifyRequest, reply: FastifyReply): void => {
  try {
    // Use `getAuth()` to access `isAuthenticated` and the user's ID
    const { isAuthenticated, userId } = getAuth(request);

    // if user is not authenticated
    if (!isAuthenticated) {
      throw new Error('Unauthorized : User is not authenticated');
    }

    const authUser: AuthUser = {
      isAuthenticated,
      userId,
    };

    // Add the auth object to the request with type safety
    request.auth = authUser;
  } catch (error: unknown) {
    logError('Unauthorized : from clerk middleware', error);
    if (DEV) {
      const message: string = 'Unauthorized : User is not authenticated';
      logError(message, error);
    }
    reply.status(401).send({ error: `${error}` });
  }
};
