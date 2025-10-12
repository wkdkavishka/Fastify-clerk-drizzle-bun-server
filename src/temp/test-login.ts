// src/routes/dev-login.ts
import { ENV } from '@/configs/env.config.js';
import { createClerkClient } from '@clerk/fastify';
import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import type { FromSchema } from 'json-schema-to-ts';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// Route
export const devLoginRoute: FastifyPluginAsync = async fastify => {
  fastify.post<{ Body: DevLoginRequest }>(
    '/dev-login',
    {
      schema: devLoginSchema,
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        // Find or create test user
        const existingUsers = await clerkClient.users.getUserList({ emailAddress: [email] });
        let user = existingUsers.data[0];
        if (!user) {
          fastify.log.info(`Creating test user: ${email}`);
          user = await clerkClient.users.createUser({
            emailAddress: [email],
            password: password,
          });
        }

        // Create a new session
        const session = await clerkClient.sessions.createSession({ userId: user.id });

        // Get a short-lived session token
        const token = await clerkClient.sessions.getToken(session.id);

        // Store the session ID in a cookie (used for refresh)
        reply.setCookie('session_id', session.id, {
          httpOnly: true,
          secure: ENV.BUN_ENV === 'prod',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Store the access token (optional)
        reply.setCookie('access_token', token.jwt, {
          httpOnly: true,
          secure: ENV.BUN_ENV === 'prod',
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
      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send({
          error: 'Failed to generate token.',
          details: err.errors || err.message,
        });
      }
    }
  );

  // Add refresh route
  fastify.get('/refresh', async (request, reply) => {
    const sessionId = request.cookies.session_id;
    if (!sessionId) {
      return reply.code(401).send({ error: 'No session found' });
    }

    try {
      const token = await clerkClient.sessions.getToken(sessionId);
      reply.setCookie('access_token', token.jwt, {
        httpOnly: true,
        secure: ENV.BUN_ENV === 'prod',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });
      return reply.send({ access_token: token.jwt });
    } catch (err: any) {
      return reply.code(401).send({ error: 'Session invalid or expired' });
    }
  });
};

export const devLoginRequestSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      errorMessage: {
        type: 'Email must be a string',
        format: 'Please provide a valid email address',
      },
    },
    password: {
      type: 'string',
      minLength: 8,
      errorMessage: {
        type: 'Password must be a string',
        minLength: 'Password must be at least 8 characters long',
      },
    },
  },
  additionalProperties: false,
} as const;

export const devLoginResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['id', 'email'],
    },
  },
  required: ['token', 'user'],
  additionalProperties: false,
} as const;

// Schemas
export const devLoginSchema: FastifySchema = {
  body: devLoginRequestSchema,
  response: {
    200: {
      ...devLoginResponseSchema,
      description: 'Successful login',
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        details: { type: ['string', 'object'] },
      },
      additionalProperties: false,
    },
    401: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
      additionalProperties: false,
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
  cookies: {
    type: 'object',
    properties: {
      session_id: { type: 'string' },
      access_token: { type: 'string' },
    },
  },
} as const;

export type DevLoginRequest = FromSchema<typeof devLoginRequestSchema>;
export type DevLoginResponse = FromSchema<typeof devLoginResponseSchema>;
