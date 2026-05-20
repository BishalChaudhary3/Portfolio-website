// app/api/projects/[id]/route.js (updated with admin checks)
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

const serializeProjectData = (body) => ({
  ...body,
  ...(body.techStack !== undefined && {
    techStack: typeof body.techStack === 'string' ? body.techStack : JSON.stringify(body.techStack || []),
  }),
  ...(body.images !== undefined && {
    images: typeof body.images === 'string' ? body.images : JSON.stringify(body.images || []),
  }),
});

// GET - Public route (no auth needed)
export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(serializeProject(project));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Admin only
export async function PUT(request, { params }) {
  try {
    // Check if user is admin
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const project = await prisma.project.update({
      where: { id: params.id },
      data: serializeProjectData(body),
    });
    
    return NextResponse.json(serializeProject(project));
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Admin only
export async function DELETE(request, { params }) {
  try {
    // Check if user is admin
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}