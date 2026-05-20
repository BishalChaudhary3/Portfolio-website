// app/admin/projects/page.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, Edit, Trash2, Eye, ExternalLink, Copy, 
  Search, Filter, ChevronLeft, ChevronRight, 
  CheckCircle, XCircle, Calendar, Eye as ViewIcon,
  ArrowUpDown, Grid, List, Download, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // table, grid
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [searchTerm, filterStatus, sortBy, sortOrder, projects]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects?all=true');
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus === 'published') {
      filtered = filtered.filter(project => project.published === true);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(project => project.published === false);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortBy === 'views') {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
        setSelectedProjects(prev => prev.filter(pid => pid !== id));
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });
      
      if (response.ok) {
        toast.success(`Project ${!currentStatus ? 'published' : 'unpublished'} successfully`);
        fetchProjects();
      } else {
        toast.error('Failed to update project status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDuplicate = async (project) => {
    const duplicatedProject = {
      ...project,
      id: undefined,
      title: `${project.title} (Copy)`,
      slug: `${project.slug}-copy-${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    delete duplicatedProject.id;
    
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedProject),
      });
      
      if (response.ok) {
        toast.success('Project duplicated successfully');
        fetchProjects();
      } else {
        toast.error('Failed to duplicate project');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedProjects.length} projects? This action cannot be undone.`)) return;
    
    let successCount = 0;
    for (const id of selectedProjects) {
      try {
        const response = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
        if (response.ok) successCount++;
      } catch (error) {
        console.error(`Failed to delete ${id}`);
      }
    }
    
    toast.success(`Deleted ${successCount} projects`);
    fetchProjects();
    setSelectedProjects([]);
  };

  const handleBulkPublish = async (publish) => {
    let successCount = 0;
    for (const id of selectedProjects) {
      try {
        const response = await fetch(`/api/admin/projects/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: publish }),
        });
        if (response.ok) successCount++;
      } catch (error) {
        console.error(`Failed to update ${id}`);
      }
    }
    
    toast.success(`${successCount} projects ${publish ? 'published' : 'unpublished'}`);
    fetchProjects();
    setSelectedProjects([]);
  };

  const toggleSelectAll = () => {
    if (selectedProjects.length === paginatedProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(paginatedProjects.map(p => p.id));
    }
  };

  const toggleSelectProject = (id) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Slug', 'Description', 'Tech Stack', 'GitHub URL', 'Demo URL', 'Views', 'Status', 'Created At', 'Updated At'];
    const csvData = filteredProjects.map(project => [
      project.title,
      project.slug,
      project.description,
      project.techStack?.join(', ') || '',
      project.githubUrl || '',
      project.demoUrl || '',
      project.views || 0,
      project.published ? 'Published' : 'Draft',
      new Date(project.createdAt).toLocaleDateString(),
      new Date(project.updatedAt).toLocaleDateString(),
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (published) => {
    return published ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
        <CheckCircle className="w-3 h-3" />
        Published
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded-full">
        <XCircle className="w-3 h-3" />
        Draft
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 glassmorphic rounded-lg hover:bg-white/10 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-4 py-2 glassmorphic rounded-lg hover:bg-white/10 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link href="/admin/projects/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold hover:shadow-lg transition">
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glassmorphic p-4">
          <p className="text-sm text-gray-400">Total Projects</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="glassmorphic p-4">
          <p className="text-sm text-gray-400">Published</p>
          <p className="text-2xl font-bold text-green-500">{projects.filter(p => p.published).length}</p>
        </div>
        <div className="glassmorphic p-4">
          <p className="text-sm text-gray-400">Drafts</p>
          <p className="text-2xl font-bold text-yellow-500">{projects.filter(p => !p.published).length}</p>
        </div>
        <div className="glassmorphic p-4">
          <p className="text-sm text-gray-400">Total Views</p>
          <p className="text-2xl font-bold text-primary">{projects.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphic p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or tech..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 px-4 transition ${viewMode === 'table' ? 'bg-primary' : 'hover:bg-white/10'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 px-4 transition ${viewMode === 'grid' ? 'bg-primary' : 'hover:bg-white/10'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="glassmorphic p-4 mb-8 flex flex-wrap justify-between items-center gap-4">
          <span className="text-sm">
            {selectedProjects.length} project(s) selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => handleBulkPublish(true)}
              className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition text-sm"
            >
              Publish Selected
            </button>
            <button
              onClick={() => handleBulkPublish(false)}
              className="px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition text-sm"
            >
              Unpublish Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition text-sm"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Projects Display - Table View */}
      {viewMode === 'table' && (
        <div className="glassmorphic overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/5">
                <tr className="text-left">
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedProjects.length === paginatedProjects.length && paginatedProjects.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-white/20 bg-white/5"
                    />
                  </th>
                  <th className="p-4 w-20">Image</th>
                  <th className="p-4 cursor-pointer hover:text-primary" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1">
                      Title
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4">Tech Stack</th>
                  <th className="p-4 cursor-pointer hover:text-primary" onClick={() => handleSort('views')}>
                    <div className="flex items-center gap-1">
                      Views
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 cursor-pointer hover:text-primary" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedProjects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => toggleSelectProject(project.id)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5"
                        />
                      </td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                          {project.images?.[0] ? (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              No img
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{project.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{project.description}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack?.slice(0, 2).map(tech => (
                            <span key={tech} className="px-2 py-1 text-xs bg-primary/20 rounded-full">
                              {tech}
                            </span>
                          ))}
                          {project.techStack?.length > 2 && (
                            <span className="px-2 py-1 text-xs text-gray-400">+{project.techStack.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <ViewIcon className="w-3 h-3 text-gray-400" />
                          <span>{project.views?.toLocaleString() || 0}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(project.published)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/projects/${project.slug}`} target="_blank">
                            <button className="p-1.5 hover:bg-white/10 rounded transition" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/projects/edit/${project.id}`}>
                            <button className="p-1.5 hover:bg-white/10 rounded transition" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDuplicate(project)}
                            className="p-1.5 hover:bg-white/10 rounded transition"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(project.id, project.published)}
                            className="p-1.5 hover:bg-white/10 rounded transition"
                            title={project.published ? "Unpublish" : "Publish"}
                          >
                            {project.published ? <XCircle className="w-4 h-4 text-yellow-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded transition text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-white/10">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg transition ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-primary to-dark text-white'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No projects found</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="mt-4 text-primary hover:text-secondary"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Projects Display - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paginatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="glassmorphic overflow-hidden group"
              >
                {/* Select Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => toggleSelectProject(project.id)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                </div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {project.images?.[0] ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Code className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(project.published)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack?.slice(0, 3).map(tech => (
                      <span key={tech} className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <ViewIcon className="w-3 h-3" />
                      <span>{project.views?.toLocaleString() || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    <Link href={`/projects/${project.slug}`} target="_blank" className="flex-1">
                      <button className="w-full px-2 py-1.5 glassmorphic rounded-lg text-xs hover:bg-white/10 transition">
                        View
                      </button>
                    </Link>
                    <Link href={`/admin/projects/edit/${project.id}`} className="flex-1">
                      <button className="w-full px-2 py-1.5 glassmorphic rounded-lg text-xs hover:bg-white/10 transition">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-2 py-1.5 glassmorphic rounded-lg text-xs text-red-500 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination for Grid View */}
      {viewMode === 'grid' && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg glassmorphic hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg glassmorphic hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
