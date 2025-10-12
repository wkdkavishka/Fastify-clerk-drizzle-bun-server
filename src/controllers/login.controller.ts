import { LoginRequest, LoginResponse } from '@/routes/schemas/login.schema.js';
import LoginService from '@/services/login.service.js';
import { FastifyReply, FastifyRequest } from 'fastify';

class LoginController {
  static async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    // get auth
    const auth = request.auth;
    const userId = auth.userId;
    reply.log.info({ userId }, 'User ID:');
    const response: LoginResponse = await LoginService.login(
      request.body.email,
      request.body.password,
      request.body.birthdate
    );

    reply.send(response);
  }
}

export default LoginController;
