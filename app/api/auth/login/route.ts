import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Database from 'better-sqlite3';
import crypto from 'crypto';
import { AuditAction, EntityType } from '@/core/domain/entities/audit-log';

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

    // Connect to the database
    const db = new Database('sqlite.db');

    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    // Check if user exists and password is correct
    // In a real app, you would use a proper password hashing and comparison
    if (!user || user.password !== password) {
      // Log failed login attempt
      const now = Date.now();
      const logId = crypto.randomUUID();

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, entity_type, details, ip_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        logId,
        user ? user.id : null,
        AuditAction.FAILED_LOGIN,
        EntityType.USER,
        JSON.stringify({
          email,
          reason: user ? 'Invalid password' : 'User not found'
        }),
        ipAddress,
        now
      );

      // Close the database connection
      db.close();

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Log successful login
    const now = Date.now();
    const logId = crypto.randomUUID();

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      logId,
      user.id,
      AuditAction.LOGIN,
      EntityType.USER,
      user.id,
      JSON.stringify({ email: user.email }),
      ipAddress,
      now
    );

    // Close the database connection
    db.close();

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
