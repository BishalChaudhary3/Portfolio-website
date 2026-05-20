// lib/db.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Database connection check
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Generic CRUD operations
export const db = {
  // Projects
  projects: {
    async getAll(publishedOnly = true) {
      return await prisma.project.findMany({
        where: publishedOnly ? { published: true } : {},
        orderBy: { createdAt: 'desc' },
      });
    },
    
    async getById(id) {
      return await prisma.project.findUnique({
        where: { id },
      });
    },
    
    async getBySlug(slug) {
      return await prisma.project.findUnique({
        where: { slug },
      });
    },
    
    async create(data) {
      return await prisma.project.create({
        data: {
          ...data,
          slug: data.slug || data.title.toLowerCase().replace(/ /g, '-'),
        },
      });
    },
    
    async update(id, data) {
      return await prisma.project.update({
        where: { id },
        data,
      });
    },
    
    async delete(id) {
      return await prisma.project.delete({
        where: { id },
      });
    },
    
    async incrementViews(slug) {
      return await prisma.project.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    },
  },
  
  // Contact Messages
  messages: {
    async getAll() {
      return await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
    
    async getUnread() {
      return await prisma.contactMessage.findMany({
        where: { isRead: false },
        orderBy: { createdAt: 'desc' },
      });
    },
    
    async create(data) {
      return await prisma.contactMessage.create({
        data,
      });
    },
    
    async markAsRead(id) {
      return await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      });
    },
    
    async delete(id) {
      return await prisma.contactMessage.delete({
        where: { id },
      });
    },
  },
  
  // Skills
  skills: {
    async getAll() {
      return await prisma.skill.findMany({
        orderBy: { order: 'asc' },
      });
    },
    
    async getByCategory(category) {
      return await prisma.skill.findMany({
        where: { category },
        orderBy: { order: 'asc' },
      });
    },
    
    async create(data) {
      return await prisma.skill.create({
        data,
      });
    },
    
    async update(id, data) {
      return await prisma.skill.update({
        where: { id },
        data,
      });
    },
    
    async delete(id) {
      return await prisma.skill.delete({
        where: { id },
      });
    },
  },
  
  // Visitors
  visitors: {
    async getCount() {
      const total = await prisma.visitor.count();
      const today = await prisma.visitor.count({
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      });
      return { total, today };
    },
    
    async add(sessionId, userAgent) {
      return await prisma.visitor.create({
        data: { sessionId, userAgent },
      });
    },
    
    async getStats(days = 30) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const visitors = await prisma.visitor.findMany({
        where: {
          timestamp: { gte: startDate },
        },
        orderBy: { timestamp: 'asc' },
      });
      
      // Group by date
      const grouped = visitors.reduce((acc, visitor) => {
        const date = visitor.timestamp.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      
      return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    },
  },
  
  // Blog
  blog: {
    async getAll(publishedOnly = true) {
      return await prisma.blogPost.findMany({
        where: publishedOnly ? { published: true } : {},
        orderBy: { createdAt: 'desc' },
      });
    },
    
    async getBySlug(slug) {
      return await prisma.blogPost.findUnique({
        where: { slug },
      });
    },
    
    async create(data) {
      return await prisma.blogPost.create({
        data: {
          ...data,
          slug: data.slug || data.title.toLowerCase().replace(/ /g, '-'),
        },
      });
    },
    
    async update(id, data) {
      return await prisma.blogPost.update({
        where: { id },
        data,
      });
    },
    
    async delete(id) {
      return await prisma.blogPost.delete({
        where: { id },
      });
    },
    
    async incrementViews(slug) {
      return await prisma.blogPost.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    },
  },
};

// Transaction helper
export async function transaction(callback) {
  return await prisma.$transaction(callback);
}

// Disconnect database
export async function disconnectDB() {
  await prisma.$disconnect();
}

export default prisma;