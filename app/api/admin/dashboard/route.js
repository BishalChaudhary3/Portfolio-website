// app/api/admin/dashboard/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      totalVisitors,
      totalProjects,
      totalMessages,
      totalBlogPosts,
      totalViews,
      unreadMessages,
    ] = await Promise.all([
      prisma.visitor.count(),
      prisma.project.count(),
      prisma.contactMessage.count(),
      prisma.blogPost.count(),
      prisma.project.aggregate({ _sum: { views: true } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);
    
    // Get recent visitors (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentVisitors = await prisma.visitor.findMany({
      where: {
        timestamp: { gte: sevenDaysAgo },
      },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    
    // Get recent messages
    const recentMessages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    
    return NextResponse.json({
      totalVisitors,
      totalProjects,
      totalMessages,
      totalBlogPosts,
      totalViews: totalViews._sum.views || 0,
      unreadMessages,
      recentVisitors,
      recentMessages,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}