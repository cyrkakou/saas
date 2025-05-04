import { NextRequest, NextResponse } from 'next/server';
import { getUserRepository } from '@/infrastructure/database';
import { initializeDatabase } from '@/lib/db-init';

export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    // Check if the user is authenticated
    const authToken = request.cookies.get('auth-token');

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // In a real implementation, you would decode the JWT token to get the user ID
    // For this simple implementation, we'll just return the first user in the database

    try {
      // Get user repository
      const userRepository = await getUserRepository();

      // Get all users and take the first one
      const users = await userRepository.findAll();
      const user = users.length > 0 ? users[0] : null;

      if (!user) {
        // If no user is found, return a mock user
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roleId: '1', // Regular user role
        };
        return NextResponse.json(mockUser);
      }

      return NextResponse.json(user);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return a mock user if there's a database error
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        roleId: '1', // Regular user role
      };
      return NextResponse.json(mockUser);
    }
  } catch (error: any) {
    console.error('Auth check error:', error);

    return NextResponse.json(
      { error: error.message || 'An error occurred during authentication check' },
      { status: 500 }
    );
  }
}
