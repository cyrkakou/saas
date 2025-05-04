import { NextRequest, NextResponse } from 'next/server';
import { CreateUserSchema } from '@/core/domain/entities/user';
import { getUserRepository } from '@/infrastructure/database';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body);

    // Get user repository
    const userRepository = await getUserRepository();

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(validatedData.password, salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword = `${salt}:${hash}`;

    // Create the user
    const user = await userRepository.create({
      email: validatedData.email,
      name: validatedData.name,
      password: hashedPassword, // Securely hashed password
      roleId: '1', // Assuming '1' is the ID for the 'user' role
      isActive: true
    });

    // Return response without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
