// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.visitor.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.project.deleteMany({});

  // Create sample projects (storing arrays as JSON strings)
  await prisma.project.createMany({
    data: [
      {
        title: 'E-Commerce Platform',
        slug: 'ecommerce-platform',
        description: 'A full-featured e-commerce platform with cart, payments, and admin dashboard',
        content: 'This project is a complete e-commerce solution built with Next.js, Stripe, and PostgreSQL. Features include user authentication, product management, shopping cart, payment processing, order tracking, and an admin dashboard.',
        techStack: JSON.stringify(['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Stripe']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1557821552-17105176677c']),
        githubUrl: 'https://github.com/yourusername/ecommerce',
        demoUrl: 'https://ecommerce-demo.com',
        published: true,
        views: 1247,
      },
      {
        title: 'AI Image Generator',
        slug: 'ai-image-generator',
        description: 'Generate stunning images using OpenAI DALL-E API',
        content: 'An AI-powered image generation tool that uses OpenAI\'s DALL-E API to create unique images from text descriptions. Includes gallery, download functionality, and sharing features.',
        techStack: JSON.stringify(['React', 'Node.js', 'OpenAI API', 'MongoDB']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1545235617-7a424c1a60cb']),
        githubUrl: 'https://github.com/yourusername/ai-image-generator',
        demoUrl: 'https://ai-generator-demo.com',
        published: true,
        views: 892,
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'Collaborative task management with real-time updates',
        content: 'A Trello-like task management application with drag-and-drop functionality, real-time updates using WebSockets, team collaboration features, and detailed analytics.',
        techStack: JSON.stringify(['React', 'Express', 'Socket.io', 'MongoDB', 'Tailwind']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d']),
        githubUrl: 'https://github.com/yourusername/task-manager',
        demoUrl: 'https://taskmanager-demo.com',
        published: true,
        views: 2341,
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description: 'Real-time weather tracking with interactive maps',
        content: 'A beautiful weather application that shows current conditions, 7-day forecasts, and interactive radar maps.',
        techStack: JSON.stringify(['React', 'Next.js', 'OpenWeather API', 'Leaflet']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1592210454359-9045f05b7a3c']),
        githubUrl: 'https://github.com/yourusername/weather-dashboard',
        demoUrl: 'https://weather-demo.com',
        published: true,
        views: 567,
      },
    ],
  });

  // Create skills
  await prisma.skill.createMany({
    data: [
      { name: 'React', category: 'frontend', proficiency: 92, order: 1 },
      { name: 'Next.js', category: 'frontend', proficiency: 88, order: 2 },
      { name: 'JavaScript', category: 'frontend', proficiency: 95, order: 3 },
      { name: 'TypeScript', category: 'frontend', proficiency: 85, order: 4 },
      { name: 'Tailwind CSS', category: 'frontend', proficiency: 90, order: 5 },
      { name: 'Node.js', category: 'backend', proficiency: 87, order: 1 },
      { name: 'Python', category: 'backend', proficiency: 82, order: 2 },
      { name: 'PostgreSQL', category: 'backend', proficiency: 78, order: 3 },
      { name: 'MongoDB', category: 'backend', proficiency: 80, order: 4 },
      { name: 'GraphQL', category: 'backend', proficiency: 75, order: 5 },
      { name: 'Git', category: 'tools', proficiency: 92, order: 1 },
      { name: 'Docker', category: 'tools', proficiency: 74, order: 2 },
      { name: 'AWS', category: 'tools', proficiency: 70, order: 3 },
    ],
  });

  // Create experience entries (UPDATED: Added 6 experiences for snake timeline)
  await prisma.experience.createMany({
    data: [
      {
        title: 'Junior Web Developer',
        company: 'StartUp Labs',
        location: 'Austin, TX',
        startDate: new Date('2018-06-01'),
        endDate: new Date('2019-12-31'),
        current: false,
        description: 'Started my professional journey as a junior developer. Learned modern web development practices, worked on client projects, and contributed to internal tools.',
        technologies: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'jQuery', 'PHP']),
        order: 1,
      },
      {
        title: 'Frontend Developer',
        company: 'Digital Agency',
        location: 'New York, NY',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-06-30'),
        current: false,
        description: 'Built responsive web applications for Fortune 500 clients. Collaborated with designers to implement pixel-perfect UIs using modern frameworks.',
        technologies: JSON.stringify(['React', 'Vue.js', 'Tailwind CSS', 'GraphQL', 'Figma']),
        order: 2,
      },
      {
        title: 'Full Stack Developer',
        company: 'E-Commerce Solutions',
        location: 'Seattle, WA',
        startDate: new Date('2021-07-01'),
        endDate: new Date('2022-12-31'),
        current: false,
        description: 'Developed end-to-end features for a major e-commerce platform. Implemented payment gateways, optimized database queries, and improved site performance.',
        technologies: JSON.stringify(['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Redis']),
        order: 3,
      },
      {
        title: 'Senior Frontend Engineer',
        company: 'FinTech Innovations',
        location: 'New York, NY',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-03-31'),
        current: false,
        description: 'Led frontend architecture for a banking dashboard serving 1M+ users. Implemented real-time data visualization and complex state management.',
        technologies: JSON.stringify(['React', 'TypeScript', 'Redux', 'D3.js', 'WebSocket']),
        order: 4,
      },
      {
        title: 'Lead Full Stack Developer',
        company: 'HealthTech Startup',
        location: 'Boston, MA',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-01-31'),
        current: false,
        description: 'Built a telemedicine platform from scratch. Managed a team of 3 developers and coordinated with product managers and stakeholders.',
        technologies: JSON.stringify(['Next.js', 'NestJS', 'PostgreSQL', 'Docker', 'AWS']),
        order: 5,
      },
      {
        title: 'Principal Software Engineer',
        company: 'Global Tech Corp',
        location: 'San Francisco, CA',
        startDate: new Date('2025-02-01'),
        endDate: null,
        current: true,
        description: 'Currently leading multiple teams in building scalable microservices. Focus on system architecture, technical strategy, and mentoring senior engineers.',
        technologies: JSON.stringify(['React', 'Node.js', 'Kubernetes', 'Kafka', 'AWS', 'Terraform']),
        order: 6,
      },
    ],
  });

  // Create testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Sarah Johnson',
        role: 'CTO',
        company: 'Tech Corp',
        content: 'John is an exceptional developer who delivered our project ahead of schedule. His attention to detail and problem-solving skills are outstanding.',
        rating: 5,
        approved: true,
      },
      {
        name: 'Michael Chen',
        role: 'Product Manager',
        company: 'StartupX',
        content: 'Working with John was a pleasure. He communicates clearly and produces high-quality code. Would definitely hire again.',
        rating: 5,
        approved: true,
      },
      {
        name: 'Emily Rodriguez',
        role: 'Design Director',
        company: 'Creative Studio',
        content: 'John brings designs to life perfectly. His frontend skills are exceptional and he always delivers on time.',
        rating: 5,
        approved: true,
      },
    ],
  });

  // Create blog posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Getting Started with Next.js 14',
        slug: 'getting-started-with-nextjs-14',
        excerpt: 'Learn the new features and improvements in Next.js 14',
        content: 'Next.js 14 introduces several exciting features including improved performance, better DX, and new rendering patterns. In this post, we\'ll explore everything you need to know to get started.',
        tags: JSON.stringify(['Next.js', 'React', 'Web Development']),
        published: true,
        views: 342,
      },
      {
        title: 'Mastering Tailwind CSS',
        slug: 'mastering-tailwind-css',
        excerpt: 'Advanced techniques for building beautiful UIs faster',
        content: 'Tailwind CSS has revolutionized how we style applications. In this post, we\'ll explore advanced patterns like component extraction, custom plugins, and optimization techniques.',
        tags: JSON.stringify(['CSS', 'Tailwind', 'Design']),
        published: true,
        views: 289,
      },
      {
        title: '10 Tips for Better Code Reviews',
        slug: '10-tips-for-better-code-reviews',
        excerpt: 'Improve your team\'s code review process with these actionable tips',
        content: 'Code reviews are essential for maintaining code quality. Here are 10 tips to make your code reviews more effective and less painful for everyone involved.',
        tags: JSON.stringify(['Best Practices', 'Team Work', 'Code Quality']),
        published: true,
        views: 456,
      },
    ],
  });

  // Create site settings
  await prisma.siteSetting.createMany({
    data: [
      { key: 'site_name', value: 'John Doe Portfolio' },
      { key: 'site_description', value: 'Full Stack Developer Portfolio' },
      { key: 'contact_email', value: 'john.doe@example.com' },
      { key: 'github_username', value: 'yourusername' },
      { key: 'linkedin_username', value: 'yourusername' },
      { key: 'twitter_handle', value: '@yourusername' },
    ],
  });

  // Create newsletter subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      {
        email: 'demo1@example.com',
        name: 'Demo User',
        isVerified: true,
      },
      {
        email: 'demo2@example.com',
        name: 'Test User',
        isVerified: false,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Stats:');
  console.log(`   - ${await prisma.project.count()} projects`);
  console.log(`   - ${await prisma.skill.count()} skills`);
  console.log(`   - ${await prisma.experience.count()} experiences`);
  console.log(`   - ${await prisma.testimonial.count()} testimonials`);
  console.log(`   - ${await prisma.blogPost.count()} blog posts`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });