const user = await getCurrentUser(request);
if (!user || user.role !== 'admin') {
  return NextResponse.json(
    { error: 'Unauthorized. Admin access required.' },
    { status: 401 }
  );
}

const body = await request.json();

// Validate required fields
if (!body.title || !body.description || !body.content) {
  return NextResponse.json(
    { error: 'Missing required fields: title, description, content' },
    { status: 400 }
  );
}

// Generate slug if not provided
let slug = body.slug;
if (!slug) {
  slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Check if slug already exists
const existingProject = await prisma.project.findUnique({
  where: { slug },
});

if (existingProject) {
  // Append timestamp to make slug unique
  slug = `${slug}-${Date.now()}`;
}

const project = await prisma.project.create({
  data: {
    title: body.title,
    slug,
    description: body.description,
    content: body.content,
    techStack: serializeList(body.techStack),
    githubUrl: body.githubUrl || null,
    demoUrl: body.demoUrl || null,
    images: serializeList(body.images),
    published: body.published ?? true,
  },
});

return NextResponse.json(serializeProject(project), { status: 201 });
} catch (error) {
console.error('Error creating project:', error);
return NextResponse.json(
  { error: 'Failed to create project' },
  { status: 500 }
);
}
}

// PUT - Bulk update projects (publish/unpublish multiple)
export async function PUT(request) {
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
const { projectIds, action } = body; // action: 'publish', 'unpublish', 'delete'

if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
  return NextResponse.json(
    { error: 'Invalid request: projectIds array required' },
    { status: 400 }
  );
}

let result;

if (action === 'publish') {
  result = await prisma.project.updateMany({
    where: { id: { in: projectIds } },
    data: { published: true },
  });
  return NextResponse.json({ 
    message: `${result.count} projects published successfully`,
    count: result.count 
  });
} 
else if (action === 'unpublish') {
  result = await prisma.project.updateMany({
    where: { id: { in: projectIds } },
    data: { published: false },
  });
  return NextResponse.json({ 
    message: `${result.count} projects unpublished successfully`,
    count: result.count 
  });
}
else if (action === 'delete') {
  result = await prisma.project.deleteMany({
    where: { id: { in: projectIds } },
  });
  return NextResponse.json({ 
    message: `${result.count} projects deleted successfully`,
    count: result.count 
  });
}
else {
  return NextResponse.json(
    { error: 'Invalid action. Use: publish, unpublish, or delete' },
    { status: 400 }
  );
}
} catch (error) {
console.error('Error in bulk operation:', error);
return NextResponse.json(
  { error: 'Failed to perform bulk operation' },
  { status: 500 }
);
}
}

// DELETE - Delete multiple projects (admin only)
export async function DELETE(request) {
try {
// Check if user is admin
const user = await getCurrentUser(request);
if (!user || user.role !== 'admin') {
  return NextResponse.json(
    { error: 'Unauthorized. Admin access required.' },
    { status: 401 }
  );
}

const { searchParams } = new URL(request.url);
const ids = searchParams.get('ids');

if (!ids) {
  return NextResponse.json(
    { error: 'No project IDs provided' },
    { status: 400 }
  );
}

const projectIds = ids.split(',');

const result = await prisma.project.deleteMany({
  where: { id: { in: projectIds } },
});

return NextResponse.json({ 
  message: `${result.count} projects deleted successfully`,
  count: result.count 
});
} catch (error) {
console.error('Error deleting projects:', error);
return NextResponse.json(
  { error: 'Failed to delete projects' },
  { status: 500 }
);
}
}