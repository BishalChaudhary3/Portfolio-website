// app/api/projects/[id]/route.js (should already exist)
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

export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id },
        ],
      },
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(serializeProject(project));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = {
      ...body,
      ...(body.techStack !== undefined && {
        techStack: typeof body.techStack === 'string' ? body.techStack : JSON.stringify(body.techStack || []),
      }),
      ...(body.images !== undefined && {
        images: typeof body.images === 'string' ? body.images : JSON.stringify(body.images || []),
      }),
    };
    const project = await prisma.project.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(serializeProject(project));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}