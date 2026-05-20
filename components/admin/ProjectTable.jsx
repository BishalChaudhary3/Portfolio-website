// components/admin/ProjectTable.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Edit, Trash2, Eye, Copy,
    ChevronLeft, ChevronRight, Search,
    Calendar, Eye as ViewIcon, CheckCircle, XCircle,
    ArrowUpDown, Grid, List
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectTable({ projects: initialProjects, onProjectUpdate }) {
    const [projects, setProjects] = useState(initialProjects || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('table');
    const [selectedProjects, setSelectedProjects] = useState([]);
    const itemsPerPage = 10;

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/admin/projects/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProjects(prev => prev.filter(p => p.id !== id));
                toast.success('Project deleted successfully');
                if (onProjectUpdate) onProjectUpdate();
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
                body: JSON.stringify({ published: !currentStatus })
            });

            if (response.ok) {
                setProjects(prev => prev.map(p =>
                    p.id === id ? { ...p, published: !currentStatus } : p
                ));
                toast.success(`Project ${!currentStatus ? 'published' : 'unpublished'}`);
                if (onProjectUpdate) onProjectUpdate();
            }
        } catch (error) {
            toast.error('Failed to update project');
        }
    };

    const handleDuplicate = async (project) => {
        const duplicatedProject = {
            ...project,
            id: undefined,
            title: `${project.title} (Copy)`,
            slug: `${project.slug}-copy-${Date.now()}`,
            views: 0,
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(duplicatedProject)
            });

            if (response.ok) {
                const newProject = await response.json();
                setProjects(prev => [newProject, ...prev]);
                toast.success('Project duplicated successfully');
                if (onProjectUpdate) onProjectUpdate();
            }
        } catch (error) {
            toast.error('Failed to duplicate project');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedProjects.length} projects?`)) return;

        let successCount = 0;
        for (const id of selectedProjects) {
            try {
                await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
                successCount++;
            } catch (error) {
                console.error(`Failed to delete ${id}`);
            }
        }

        setProjects(prev => prev.filter(p => !selectedProjects.includes(p.id)));
        setSelectedProjects([]);
        toast.success(`Deleted ${successCount} projects`);
        if (onProjectUpdate) onProjectUpdate();
    };

    const toggleSelectAll = () => {
        if (selectedProjects.length === paginatedProjects.length && paginatedProjects.length > 0) {
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

    const filteredProjects = projects.filter(project => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.techStack && project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesStatus =
            filterStatus === 'all' ? true :
                filterStatus === 'published' ? project.published :
                    filterStatus === 'draft' ? !project.published : true;

        return matchesSearch && matchesStatus;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === 'views') {
            aVal = a.views || 0;
            bVal = b.views || 0;
        } else if (sortBy === 'createdAt') {
            aVal = new Date(a.createdAt).getTime();
            bVal = new Date(b.createdAt).getTime();
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
    const paginatedProjects = sortedProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

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

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects by title, description, or tech..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>

                    <div className="flex rounded-lg overflow-hidden border border-white/10">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 transition ${viewMode === 'table' ? 'bg-primary' : 'hover:bg-white/10'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition ${viewMode === 'grid' ? 'bg-primary' : 'hover:bg-white/10'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>

                    <Link href="/admin/projects/new">
                        <button className="px-4 py-2 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold hover:shadow-lg transition">
                            + New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedProjects.length > 0 && (
                <div className="glassmorphic p-3 flex justify-between items-center">
                    <span className="text-sm">{selectedProjects.length} project(s) selected</span>
                    <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition text-sm"
                    >
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Projects Display */}
            {viewMode === 'table' ? (
                // Table View
                <div className="glassmorphic overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10">
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
                                    {paginatedProjects.map((project) => (
                                        <motion.tr
                                            key={project.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
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
                                                    {project.images && project.images[0] ? (
                                                        <img
                                                            src={project.images[0]}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                            No img
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-semibold">{project.title}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-1">{project.description}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {project.techStack && project.techStack.slice(0, 2).map(tech => (
                                                        <span key={tech} className="px-2 py-1 text-xs bg-primary/20 rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.techStack && project.techStack.length > 2 && (
                                                        <span className="px-2 py-1 text-xs text-gray-400">+{project.techStack.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <ViewIcon className="w-3 h-3 text-gray-400" />
                                                    <span>{(project.views || 0).toLocaleString()}</span>
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
                                            className={`w-8 h-8 rounded-lg transition ${currentPage === pageNum
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
                </div>
            ) : (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {paginatedProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="glassmorphic overflow-hidden group relative"
                            >
                                {/* Select Checkbox */}
                                <div className="absolute top-2 left-2 z-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedProjects.includes(project.id)}
                                        onChange={() => toggleSelectProject(project.id)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5"
                                    />
                                </div>

                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    {project.images && project.images[0] ? (
                                        <img
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <span className="text-gray-500">No image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute top-2 right-2">
                                        {getStatusBadge(project.published)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.techStack && project.techStack.slice(0, 3).map(tech => (
                                            <span key={tech} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack && project.techStack.length > 3 && (
                                            <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded-full">
                                                +{project.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <ViewIcon className="w-3 h-3" />
                                            <span>{(project.views || 0).toLocaleString()} views</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(project.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-white/10">
                                        <Link href={`/projects/${project.slug}`} target="_blank" className="flex-1">
                                            <button className="w-full px-3 py-2 glassmorphic rounded-lg text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </Link>
                                        <Link href={`/admin/projects/edit/${project.id}`} className="flex-1">
                                            <button className="w-full px-3 py-2 glassmorphic rounded-lg text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="px-3 py-2 glassmorphic rounded-lg text-sm hover:bg-red-500/20 text-red-500 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="glassmorphic p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <Search className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No projects found</h3>
                    <p className="text-gray-400 mb-4">
                        {searchTerm || filterStatus !== 'all'
                            ? "Try adjusting your search or filter criteria"
                            : "Get started by creating your first project"}
                    </p>
                    <Link href="/admin/projects/new">
                        <button className="px-4 py-2 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold">
                            + Create New Project
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
