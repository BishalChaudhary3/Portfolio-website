// middleware/auth.js
import { NextResponse } from 'next/server';

export function authMiddleware(request) {
  const token = request.cookies.get('admin_token') || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/admin/login', '/api/admin/login'];
  
  if (pathname.startsWith('/admin') && !publicPaths.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}