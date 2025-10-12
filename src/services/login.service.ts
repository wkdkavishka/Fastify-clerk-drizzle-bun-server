import { ENV } from '@/configs/env.config.js';
import { logger } from '@/configs/log.config.js';
import { LoginResponse } from '@/routes/schemas/login.schema.js';

class LoginService {
  static async login(email: string, password: string, birthdate: string): Promise<LoginResponse> {
    if (ENV.BUN_ENV === 'dev') {
      logger.info({ email, password, birthdate }, 'LoginService.login');
    }
    // mock response // loginResponseSchema
    const response: LoginResponse = {
      accessToken: 'mocked-access-token',
      refreshToken: 'mocked-refresh-token',
      user: {
        id: 'mocked-user-id',
        email: 'mocked-user-email',
      },
    };
    return response;
  }
}

export default LoginService;
