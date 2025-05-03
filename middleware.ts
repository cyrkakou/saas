import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Note: We can't import the database initialization here because middleware runs in a different environment
// The database initialization will happen in the API routes instead

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For now, we'll use a simple check for a cookie to simulate authentication
  // In a real app, you would verify a JWT token or session
  const isAuthenticated = request.cookies.has('auth-token');

  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Define protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // Define auth routes (login, register)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && isProtectedRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access an auth route
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
