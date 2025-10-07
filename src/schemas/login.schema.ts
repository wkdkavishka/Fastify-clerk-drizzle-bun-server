import type { FastifySchema } from 'fastify';

export const loginSchema = {
  type: 'object',
  required: ['email', 'password', 'birthdate'],
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
      maxLength: 100,
      errorMessage: {
        type: 'Password must be a string',
        minLength: 'Password must be at least 8 characters long',
        maxLength: 'Password must be less than 100 characters',
      },
    },
    birthdate: {
      type: 'string',
      format: 'date',
      errorMessage: {
        type: 'Birthdate must be a string',
        format: 'Please provide a valid birthdate',
      },
    },
  },
  additionalProperties: false,
} as const;

export const loginResponseSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['id', 'email'],
    },
  },
  required: ['accessToken', 'user'],
} as const;

// export type LoginBody = {
//   email: string;
//   password: string;
//   birthdate: string;
// };

// export type LoginResponse = {
//   accessToken: string;
//   refreshToken?: string;
//   user: {
//     id: string;
//     email: string;
//   };
// };

export const loginRouteSchema: FastifySchema = {
  body: loginSchema,
  response: {
    200: loginResponseSchema,
    400: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    401: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
} as const;
