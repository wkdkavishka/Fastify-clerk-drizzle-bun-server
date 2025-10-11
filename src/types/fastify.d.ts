import 'fastify';

declare module 'fastify' {
  interface AuthUser {
    isAuthenticated: boolean;
    userId: string;
  }

  interface FastifyRequest {
    auth: AuthUser;
  }
}
