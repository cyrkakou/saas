import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET(request: NextRequest) {
  try {
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

    // Connect to the database
    const db = new Database('sqlite.db');

    // Get the first user
    const user = db.prepare('SELECT id, email, name, role FROM users LIMIT 1').get();

    // Close the database connection
    db.close();

    if (!user) {
      // If no user is found, return a mock user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      };
      return NextResponse.json(mockUser);
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Auth check error:', error);

    return NextResponse.json(
      { error: error.message || 'An error occurred during authentication check' },
      { status: 500 }
    );
  }
}
