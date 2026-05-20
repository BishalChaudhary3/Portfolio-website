// app/api/visitor/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalVisitors = await prisma.visitor.count();
    const todayVisitors = await prisma.visitor.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    
    return NextResponse.json({ total: totalVisitors, today: todayVisitors });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies();
    let sessionId = cookieStore.get('visitor_id')?.value;
    
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(7);
      cookies().set('visitor_id', sessionId, { 
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      await prisma.visitor.create({
        data: { sessionId, userAgent },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}