// app/api/admin/analytics/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const visitors = await prisma.visitor.groupBy({
      by: ['timestamp'],
      where: {
        timestamp: { gte: thirtyDaysAgo },
      },
      _count: true,
    });
    
    // Format data for chart
    const chartData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const count = visitors.filter(v => 
        v.timestamp.toDateString() === date.toDateString()
      ).length;
      
      chartData.unshift({
        date: date.toLocaleDateString(),
        visitors: count,
      });
    }
    
    return NextResponse.json(chartData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}