// app/(frontend)/projects/[slug]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Eye, Calendar, ArrowLeft, Code, Zap } from 'lucide-react';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    // Track view
    fetch(`/api/projects/${slug}/view`, { method: 'POST' });
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${slug}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link href="/projects" className="text-primary hover:text-primary-dark">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/projects">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Image */}
          <div className="relative h-[60vh] rounded-lg overflow-hidden">
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Project Info */}
          <div className="glassmorphic p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
              <div className="flex gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 glassmorphic hover:bg-white/20 transition">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-3 glassmorphic hover:bg-white/20 transition">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{project.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>{project.techStack.length} technologies</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map(tech => (
                <span key={tech} className="px-3 py-1 bg-primary/20 text-primary-dark dark:text-primary rounded-full text-sm font-semibold">
                  {tech}
                </span>
              ))}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {project.content}
              </p>
            </div>

            {/* Key Features */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-dark/10 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Key Features</h3>
              </div>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
                <li>✓ Fully responsive design</li>
                <li>✓ Modern tech stack</li>
                <li>✓ Optimized performance</li>
                <li>✓ Clean, maintainable code</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}