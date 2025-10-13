// src/routes/dev-login.ts
import clerk from '@/configs/clerk.config.js';
import { DEV } from '@/configs/env.config.js';
import { logError } from '@/configs/log.config.js';
import type { FastifyPluginAsync } from 'fastify';
import { DevLoginRequest, DevLoginResponse, devLoginSchema } from './de-login.schemas.js';

// Route
export const devLoginRoute: FastifyPluginAsync = async fastify => {
  // Dev Login Route
  fastify.post<{ Body: DevLoginRequest }>(
    '/dev-login',
    {
      schema: devLoginSchema,
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        // Find or create test user
        const existingUsers = await clerk.users.getUserList({ emailAddress: [email] });
        let user = existingUsers.data[0];
        if (!user) {
          fastify.log.info(`Creating test user: ${email}`);
          user = await clerk.users.createUser({
            emailAddress: [email],
            password: password,
          });
        }

        // Create a new session
        const session = await clerk.sessions.createSession({ userId: user.id });

        // Get a short-lived session token
        const token = await clerk.sessions.getToken(session.id);

        // Store the session ID in a cookie (used for refresh)
        reply.setCookie('session_id', session.id, {
          httpOnly: true,
          secure: DEV ? false : true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Store user Id in a cookie (used for refresh)
        reply.setCookie('user_id', user.id, {
          httpOnly: true,
          secure: DEV ? false : true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Store the access token (optional)
        reply.setCookie('access_token', token.jwt, {
          httpOnly: true,
          secure: DEV ? false : true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60, // 1 hour
        });

        const toReturn: DevLoginResponse = {
          token: token.jwt,
          user: {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
          },
        };

        return reply.send(toReturn);
      } catch (error: unknown) {
        const message: string = 'Failed to generate token.';
        logError(message, error);
        return reply.code(400).send({
          error: 'Failed to generate token.',
          details: error instanceof Error ? [error.message, error?.cause] : error,
        });
      }
    }
  );

  // Add refresh route
  fastify.get('/refresh', async (request, reply) => {
    const sessionId = request.cookies.session_id;
    const userId = request.cookies.user_id;
    if (!sessionId) {
      return reply.code(401).send({ error: 'No session found' });
    }
    if (!userId) {
      return reply.code(401).send({ error: 'No user found' });
    }
    try {
      // Get New Token
      const token = await clerk.sessions.getToken(sessionId);
      // Create a new session
      // const session = await clerkClient.sessions.createSession({ userId });
      reply.setCookie('access_token', token.jwt, {
        httpOnly: true,
        secure: DEV ? false : true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });

      return reply.send({ access_token: token.jwt });
    } catch (error: unknown) {
      const message: string = 'Failed to generate token.';
      logError(message, error);
      return reply.code(401).send({
        error: 'Session invalid or expired',
        details: error instanceof Error ? [error.message, error?.cause] : 'unknown error',
      });
    }
  });
};
