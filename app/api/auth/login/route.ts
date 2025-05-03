import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { AuditAction, EntityType } from '@/core/domain/entities/audit-log';
import { getUserRepository, getAuditLogRepository } from '@/infrastructure/database';

// Login input validation schema
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    // Get IP address for audit logging
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';

    // Get repositories
    const userRepository = await getUserRepository();
    const auditLogRepository = await getAuditLogRepository();

    // Find user by email
    const user = await userRepository.findByEmail(email);

    // Check if user exists and password is correct
    // In a real app, you would use a proper password hashing and comparison
    if (!user || user.password !== password) {
      // Log failed login attempt
      await auditLogRepository.create({
        userId: user ? user.id : undefined,
        action: AuditAction.FAILED_LOGIN,
        entityType: EntityType.USER,
        details: JSON.stringify({
          email,
          reason: user ? 'Invalid password' : 'User not found'
        }),
        ipAddress
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Log successful login
    await auditLogRepository.create({
      userId: user.id,
      action: AuditAction.LOGIN,
      entityType: EntityType.USER,
      entityId: user.id,
      details: JSON.stringify({ email: user.email }),
      ipAddress
    });

    // Set a cookie to simulate authentication
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    response.cookies.set('auth-token', 'true', {
      path: '/',
      maxAge: 86400, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}
