import { User, CreateUserInput } from '../entities/user';
import { UserRepository } from '../repositories/user-repository.interface';
import { AuditService } from './audit-service';
import { AuditAction, EntityType } from '../entities/audit-log';

export interface AuthenticationService {
  register(userData: CreateUserInput, ipAddress?: string): Promise<User>;
  login(email: string, password: string, ipAddress?: string): Promise<User | null>;
  validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export class DefaultAuthenticationService implements AuthenticationService {
  constructor(
    private userRepository: UserRepository,
    private auditService?: AuditService
  ) {}

  async register(userData: CreateUserInput, ipAddress?: string): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create the user with hashed password
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Log the registration action
    if (this.auditService && user.id) {
      await this.auditService.logUserAction(
        user.id,
        AuditAction.REGISTER,
        EntityType.USER,
        user.id,
        { email: user.email, roleId: user.roleId },
        ipAddress
      );
    }

    return user;
  }

  async login(email: string, password: string, ipAddress?: string): Promise<User | null> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Log failed login attempt if audit service is available
      if (this.auditService) {
        await this.auditService.logAction({
          action: AuditAction.FAILED_LOGIN,
          entityType: EntityType.USER,
          details: JSON.stringify({ email, reason: 'User not found' }),
          ipAddress
        });
      }
      return null;
    }

    // Validate password
    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt if audit service is available
      if (this.auditService && user.id) {
        await this.auditService.logUserAction(
          user.id,
          AuditAction.FAILED_LOGIN,
          EntityType.USER,
          user.id,
          { reason: 'Invalid password' },
          ipAddress
        );
      }
      return null;
    }

    // Log successful login if audit service is available
    if (this.auditService && user.id) {
      await this.auditService.logUserAction(
        user.id,
        AuditAction.LOGIN,
        EntityType.USER,
        user.id,
        { email: user.email },
        ipAddress
      );
    }

    return user;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // In a real implementation, this would use bcrypt.compare or similar
    // For now, we'll just simulate password validation
    return plainPassword === hashedPassword;
  }

  async hashPassword(password: string): Promise<string> {
    // In a real implementation, this would use bcrypt.hash or similar
    // For now, we'll just return the password as-is
    return password;
  }
}
