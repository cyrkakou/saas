import { User } from '@/core/domain/entities/user';
import { AuthenticationService } from '@/core/domain/services/authentication-service';

export class LoginUserUseCase {
  constructor(private authService: AuthenticationService) {}

  async execute(email: string, password: string): Promise<User | null> {
    try {
      return await this.authService.login(email, password);
    } catch (error) {
      throw error;
    }
  }
}
