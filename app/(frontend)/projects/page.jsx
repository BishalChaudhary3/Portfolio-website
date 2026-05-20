// app/(frontend)/projects/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Github, ExternalLink, Eye, Search, Filter, X, Grid, List,
  ChevronLeft, ChevronRight, Calendar, Star, Code, Loader2
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [allTechnologies, setAllTechnologies] = useState([]);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [searchTerm, selectedTech, sortBy, projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      // Parse JSON strings for techStack and images
      const parsedData = data.map(project => ({
        ...project,
        techStack: typeof project.techStack === 'string' 
          ? JSON.parse(project.techStack) 
          : (project.techStack || []),
        images: typeof project.images === 'string'
          ? JSON.parse(project.images)
          : (project.images || [])
      }));
      
      setProjects(parsedData);
      
      // Extract unique technologies
      const techs = new Set();
      parsedData.forEach(project => {
        project.techStack?.forEach(tech => techs.add(tech));
      });
      setAllTechnologies(['all', ...Array.from(techs).sort()]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTech !== 'all') {
      filtered = filtered.filter(project =>
        project.techStack?.includes(selectedTech)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostViewed':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTech('all');
    setSortBy('newest');
  };

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading amazing projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-dark dark:text-light">My </span>
          <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my collection of web development projects. Each project represents a unique challenge and solution.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search projects by title, tech stack, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg glassmorphic focus:border-primary focus:outline-none transition text-dark dark:text-light placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-primary to-dark text-white' 
                    : 'glassmorphic hover:bg-white/10 text-dark dark:text-light'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-primary to-dark text-white' 
                    : 'glassmorphic hover:bg-white/10 text-dark dark:text-light'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="glassmorphic overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.images?.[0] || '/placeholder-project.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Links */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110">
                        <Github className="w-6 h-6 text-white" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110">
                        <ExternalLink className="w-6 h-6 text-white" />
                      </a>
                    )}
                    <Link href={`/projects/${project.slug}`}>
                      <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110">
                        <Eye className="w-6 h-6 text-white" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-dark dark:text-light mb-2 line-clamp-1 group-hover:text-primary dark:group-hover:text-primary-light transition">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack && project.techStack.length > 0 ? (
                      project.techStack.slice(0, 3).map(tech => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-primary/20 text-primary dark:text-primary-light rounded-full"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">No technologies listed</span>
                    )}
                    {project.techStack && project.techStack.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-500 dark:text-gray-400 rounded-full">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{project.views?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Projects List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glassmorphic p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={project.images?.[0] || '/placeholder-project.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                      <h3 className="text-xl font-bold text-dark dark:text-light hover:text-primary dark:hover:text-primary-light transition">
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition">
                            <Github className="w-4 h-4 text-dark dark:text-light" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition">
                            <ExternalLink className="w-4 h-4 text-dark dark:text-light" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.techStack && project.techStack.slice(0, 4).map(tech => (
                        <span key={tech} className="px-2 py-1 text-xs bg-primary/20 text-primary dark:text-primary-light rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.views?.toLocaleString() || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.createdAt).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg glassmorphic disabled:opacity-50 hover:bg-white/10 transition"
            >
              <ChevronLeft className="w-5 h-5 text-dark dark:text-light" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-primary to-dark text-white'
                    : 'glassmorphic hover:bg-white/10 text-dark dark:text-light'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg glassmorphic disabled:opacity-50 hover:bg-white/10 transition"
            >
              <ChevronRight className="w-5 h-5 text-dark dark:text-light" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Search className="w-12 h-12 text-primary dark:text-primary-light" />
            </div>
            <h3 className="text-2xl font-bold text-dark dark:text-light mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gradient-to-r from-primary to-dark text-white rounded-lg font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}