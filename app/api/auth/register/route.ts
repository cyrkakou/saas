import { NextRequest, NextResponse } from 'next/server';
import { CreateUserSchema } from '@/core/domain/entities/user';
import { getUserRepository } from '@/infrastructure/database';

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

    // Create the user
    const user = await userRepository.create({
      email: validatedData.email,
      name: validatedData.name,
      password: validatedData.password, // In a real app, you would hash this
      role: 'user'
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
