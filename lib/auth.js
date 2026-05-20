// lib/auth.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const jwtSecret = () => process.env.JWT_SECRET || 'portfolio-demo-secret-change-me';

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId, email, role = 'user') {
  return jwt.sign(
    { userId, email, role },
    jwtSecret(),
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret());
  } catch (error) {
    return null;
  }
}

// Get current user from token
export async function getCurrentUser(request) {
  try {
    // Get token from cookies or authorization header
    let token = cookies().get('admin_token')?.value;
    
    if (!token && request?.headers?.get('authorization')) {
      token = request.headers.get('authorization').replace('Bearer ', '');
    }
    
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded) return null;

    return {
      id: decoded.userId || decoded.email || 'admin',
      email: decoded.email,
      name: decoded.name || 'Admin',
      role: decoded.role || 'admin',
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is admin
export async function isAdmin(request) {
  const user = await getCurrentUser(request);
  return user?.role === 'admin';
}

// Middleware to protect routes
export function requireAuth(handler) {
  return async (request, ...args) => {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return handler(request, ...args, user);
  };
}

// Middleware to require admin
export function requireAdmin(handler) {
  return async (request, ...args) => {
    const user = await getCurrentUser(request);
    
    if (!user || user.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return handler(request, ...args, user);
  };
}

// Create admin user (run this once)
export async function createAdminUser(email, password, name = 'Admin') {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      console.log('Admin user already exists');
      return existingUser;
    }
    
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      },
    });
    
    console.log('Admin user created successfully');
    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Set auth cookie
export function setAuthCookie(token) {
  cookies().set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Remove auth cookie
export function removeAuthCookie() {
  cookies().delete('admin_token');
}

// Generate reset token
export function generateResetToken(email) {
  return jwt.sign(
    { email, purpose: 'reset' },
    jwtSecret(),
    { expiresIn: '1h' }
  );
}

// Verify reset token
export function verifyResetToken(token) {
  try {
    const decoded = jwt.verify(token, jwtSecret());
    if (decoded.purpose !== 'reset') return null;
    return decoded;
  } catch (error) {
    return null;
  }
}
