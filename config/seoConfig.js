// config/seoConfig.js

export const seoConfig = {
    // Default SEO settings for the entire site
    default: {
      title: 'John Doe | Full Stack Developer Portfolio',
      description: 'Professional full-stack developer specializing in React, Next.js, Node.js, and modern web technologies. View my projects, skills, and experience.',
      keywords: 'portfolio, full stack developer, web developer, react, next.js, node.js, tailwind, javascript, typescript, ui/ux',
      author: 'John Doe',
      robots: 'index, follow',
      language: 'en_US',
      siteName: 'John Doe Portfolio',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.com',
      twitterHandle: '@yourusername',
      githubUsername: 'yourusername',
      linkedinUsername: 'yourusername',
    },
  
    // Home page SEO
    home: {
      title: 'John Doe | Full Stack Developer Portfolio',
      description: 'Welcome to my portfolio. I build amazing web applications with modern technologies including React, Next.js, and Node.js. Explore my work and get in touch.',
      ogTitle: 'John Doe - Full Stack Developer',
      ogDescription: 'Professional portfolio showcasing web development projects, skills, and experience.',
      twitterTitle: 'John Doe | Full Stack Developer',
      twitterDescription: 'Check out my portfolio featuring modern web development projects.',
    },
  
    // Projects page SEO
    projects: {
      title: 'Projects | John Doe Portfolio',
      description: 'Explore my collection of web development projects including e-commerce platforms, AI tools, task managers, and more. Each project showcases different technologies and solutions.',
      ogTitle: 'Web Development Projects Portfolio',
      ogDescription: 'View my latest projects built with React, Next.js, Node.js, and other modern technologies.',
      twitterTitle: 'My Development Projects',
      twitterDescription: 'Check out the projects I\'ve built and the problems they solve.',
    },
  
    // Individual project SEO (dynamic)
    project: {
      titleTemplate: '%s | Project Portfolio',
      descriptionTemplate: 'Explore %s - a web development project built with modern technologies. View live demo, source code, and project details.',
      ogTitleTemplate: '%s - Project Showcase',
      ogDescriptionTemplate: 'Learn about %s, its features, tech stack, and development process.',
    },
  
    // About page SEO
    about: {
      title: 'About Me | John Doe Portfolio',
      description: 'Learn about my journey as a full-stack developer, my skills, experience, and what drives me to create amazing digital experiences.',
      ogTitle: 'About John Doe - Full Stack Developer',
      ogDescription: 'Discover my background, technical skills, and passion for web development.',
      twitterTitle: 'About Me | Full Stack Developer',
      twitterDescription: 'Get to know the developer behind the portfolio.',
    },
  
    // Contact page SEO
    contact: {
      title: 'Contact | John Doe Portfolio',
      description: 'Get in touch with me for collaborations, freelance work, or just to say hello. I\'m always open to discussing new projects and opportunities.',
      ogTitle: 'Contact John Doe - Full Stack Developer',
      ogDescription: 'Reach out for project inquiries, collaborations, or questions.',
      twitterTitle: 'Contact Me',
      twitterDescription: 'Let\'s work together on your next project.',
    },
  
    // Blog page SEO
    blog: {
      title: 'Blog | John Doe Portfolio',
      description: 'Read my thoughts on web development, programming best practices, technology trends, and tutorials. Stay updated with the latest in tech.',
      ogTitle: 'Development Blog | John Doe',
      ogDescription: 'Articles about web development, coding tips, and technology insights.',
      twitterTitle: 'Tech Blog',
      twitterDescription: 'Latest posts about web development and programming.',
    },
  
    // Individual blog post SEO (dynamic)
    blogPost: {
      titleTemplate: '%s | Blog',
      descriptionTemplate: 'Read %s - a blog post about web development, programming insights, and technology trends.',
      ogTitleTemplate: '%s - Development Blog',
      ogDescriptionTemplate: 'Explore this article about %s and learn something new.',
    },
  
    // Admin panel SEO
    admin: {
      title: 'Admin Dashboard | Portfolio CMS',
      description: 'Content management system for portfolio website. Manage projects, view messages, and analyze site analytics.',
      robots: 'noindex, nofollow', // Don't index admin pages
    },
  
    // Login page SEO
    login: {
      title: 'Admin Login | Portfolio CMS',
      description: 'Secure login page for portfolio content management system.',
      robots: 'noindex, nofollow',
    },
  
    // 404 page SEO
    notFound: {
      title: '404 - Page Not Found | John Doe Portfolio',
      description: 'The page you are looking for does not exist. Return to the homepage to explore my portfolio.',
      robots: 'noindex, follow',
    },
  };
  
  // Helper function to generate page title
  export function generatePageTitle(page, customTitle = null) {
    if (customTitle) {
      return `${customTitle} | John Doe Portfolio`;
    }
    
    const config = seoConfig[page];
    if (config && config.title) {
      return config.title;
    }
    
    return seoConfig.default.title;
  }
  
  // Helper function to generate page description
  export function generatePageDescription(page, customDescription = null) {
    if (customDescription) {
      return customDescription;
    }
    
    const config = seoConfig[page];
    if (config && config.description) {
      return config.description;
    }
    
    return seoConfig.default.description;
  }
  
  // Helper function to generate Open Graph meta tags
  export function generateOpenGraph(page, data = {}) {
    const config = seoConfig[page];
    const defaultConfig = seoConfig.default;
    
    let title = defaultConfig.title;
    let description = defaultConfig.description;
    
    if (config) {
      if (config.ogTitle) title = config.ogTitle;
      else if (config.title) title = config.title;
      
      if (config.ogDescription) description = config.ogDescription;
      else if (config.description) description = config.description;
    }
    
    // Handle dynamic templates
    if (page === 'project' && data.project) {
      title = config.ogTitleTemplate.replace('%s', data.project.title);
      description = config.ogDescriptionTemplate.replace('%s', data.project.title);
    }
    
    if (page === 'blogPost' && data.post) {
      title = config.ogTitleTemplate.replace('%s', data.post.title);
      description = config.ogDescriptionTemplate.replace('%s', data.post.title);
    }
    
    return {
      title,
      description,
      url: data.url || defaultConfig.siteUrl,
      siteName: defaultConfig.siteName,
      images: data.image ? [{ url: data.image, width: 1200, height: 630, alt: title }] : [],
      locale: defaultConfig.language,
      type: data.type || 'website',
    };
  }
  
  // Helper function to generate Twitter Card meta tags
  export function generateTwitterCard(page, data = {}) {
    const config = seoConfig[page];
    const defaultConfig = seoConfig.default;
    
    let title = defaultConfig.title;
    let description = defaultConfig.description;
    
    if (config) {
      if (config.twitterTitle) title = config.twitterTitle;
      else if (config.title) title = config.title;
      
      if (config.twitterDescription) description = config.twitterDescription;
      else if (config.description) description = config.description;
    }
    
    // Handle dynamic templates
    if (page === 'project' && data.project) {
      title = config.titleTemplate?.replace('%s', data.project.title) || title;
      description = config.descriptionTemplate?.replace('%s', data.project.title) || description;
    }
    
    if (page === 'blogPost' && data.post) {
      title = config.titleTemplate?.replace('%s', data.post.title) || title;
      description = config.descriptionTemplate?.replace('%s', data.post.title) || description;
    }
    
    return {
      card: 'summary_large_image',
      site: defaultConfig.twitterHandle,
      title,
      description,
      image: data.image || null,
      creator: defaultConfig.twitterHandle,
    };
  }
  
  // Helper function to generate JSON-LD structured data
  export function generateStructuredData(page, data = {}) {
    const defaultConfig = seoConfig.default;
    const baseUrl = defaultConfig.siteUrl;
    
    // Person structured data (for homepage/about)
    if (page === 'person') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'John Doe',
        url: baseUrl,
        sameAs: [
          `https://github.com/${defaultConfig.githubUsername}`,
          `https://linkedin.com/in/${defaultConfig.linkedinUsername}`,
          `https://twitter.com/${defaultConfig.twitterHandle.replace('@', '')}`,
        ],
        jobTitle: 'Full Stack Developer',
        worksFor: {
          '@type': 'Organization',
          name: 'Freelance',
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Your University',
        },
        knowsAbout: ['React', 'Next.js', 'Node.js', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
      };
    }
    
    // Website structured data
    if (page === 'website') {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: defaultConfig.siteName,
        url: baseUrl,
        description: defaultConfig.description,
        author: {
          '@type': 'Person',
          name: 'John Doe',
        },
      };
    }
    
    // Project structured data
    if (page === 'project' && data.project) {
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.project.title,
        description: data.project.description,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web',
        url: `${baseUrl}/projects/${data.project.slug}`,
        screenshot: data.project.images?.[0] || null,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          name: 'John Doe',
        },
      };
    }
    
    // Blog post structured data
    if (page === 'blogPost' && data.post) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.post.title,
        description: data.post.excerpt,
        image: data.post.image || null,
        datePublished: data.post.createdAt,
        dateModified: data.post.updatedAt || data.post.createdAt,
        author: {
          '@type': 'Person',
          name: 'John Doe',
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: defaultConfig.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${data.post.slug}`,
        },
      };
    }
    
    // Breadcrumb structured data
    if (page === 'breadcrumb' && data.items) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.url}`,
        })),
      };
    }
    
    return null;
  }
  
  // Helper to get robots meta content
  export function getRobotsContent(page) {
    const config = seoConfig[page];
    if (config && config.robots) {
      return config.robots;
    }
    return seoConfig.default.robots || 'index, follow';
  }
  
  // Helper for canonical URL
  export function getCanonicalUrl(path) {
    const baseUrl = seoConfig.default.siteUrl;
    return `${baseUrl}${path}`;
  }
  
  // Export all configurations
  export default seoConfig;