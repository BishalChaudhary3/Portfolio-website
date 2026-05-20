// app/api/experience/route.js (optional improvement)
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [
        { order: 'asc' },      // Primary sort by order field
        { startDate: 'asc' },  // Secondary sort by date
      ],
    });
    
    // Parse JSON strings before sending
    const parsedExperiences = experiences.map(exp => ({
      ...exp,
      technologies: exp.technologies ? JSON.parse(exp.technologies) : [],
      // Ensure dates are properly formatted
      startDate: exp.startDate.toISOString(),
      endDate: exp.endDate?.toISOString() || null,
    }));
    
    return NextResponse.json(parsedExperiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Good practice to disconnect
  }
}