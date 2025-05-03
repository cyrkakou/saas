import { NextRequest, NextResponse } from 'next/server';
import { CreateUserSchema } from '@/core/domain/entities/user';
import crypto from 'crypto';
import Database from 'better-sqlite3';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body);

    // Connect to the database
    const db = new Database('sqlite.db');

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create the user
    const now = Date.now();
    const userId = crypto.randomUUID();

    db.prepare(`
      INSERT INTO users (id, email, name, password, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      validatedData.email,
      validatedData.name || null,
      validatedData.password, // In a real app, you would hash this
      'user',
      now,
      now
    );

    // Get the created user
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    // Close the database connection
    db.close();

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
