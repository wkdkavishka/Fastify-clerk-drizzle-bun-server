export class LoginService {
  constructor() {}

  async login(email: string, password: string, birthdate: string) {
    return { email, password, birthdate };
  }
}
