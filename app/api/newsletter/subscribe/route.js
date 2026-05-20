// app/api/newsletter/subscribe/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, name } = await request.json();
    
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }
    
    // Save to database
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { 
        email, 
        name,
        subscribedAt: new Date(),
      },
    });
    
    // Send welcome email (optional)
    // ... email logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}