import { User, CreateUserInput } from '@/core/domain/entities/user';
import { AuthenticationService } from '@/core/domain/services/authentication-service';

export class RegisterUserUseCase {
  constructor(private authService: AuthenticationService) {}

  async execute(userData: CreateUserInput): Promise<User> {
    try {
      return await this.authService.register(userData);
    } catch (error) {
      throw error;
    }
  }
}
