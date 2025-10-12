import { LoginRequest, LoginResponse } from '@/routes/schemas/login.schema.js';
import LoginService from '@/services/login.service.js';
import { AuthUser, FastifyReply, FastifyRequest } from 'fastify';

class LoginController {
  static async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
  ): Promise<void> {
    // get auth
    const auth: AuthUser = request.auth;
    const response: LoginResponse = await LoginService.login(
      auth,
      request.body.email,
      request.body.password
    );

    reply.send(response);
  }
}

export default LoginController;
