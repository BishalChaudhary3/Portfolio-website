// app/api/projects/route.js (updated)
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

const parseList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const serializeProject = (project) => ({
  ...project,
  techStack: parseList(project.techStack),
  images: parseList(project.images),
});

const serializeList = (value) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return JSON.stringify(value);
  return JSON.stringify([]);
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const user = all ? await getCurrentUser(request) : null;
    
    const projects = await prisma.project.findMany({
      where: all && user?.role === 'admin' ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(projects.map(serializeProject));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/ /g, '-'),
        description: body.description,
        content: body.content,
        techStack: serializeList(body.techStack),
        githubUrl: body.githubUrl,
        demoUrl: body.demoUrl,
        images: serializeList(body.images),
        published: body.published ?? true,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}