// app/admin/projects/edit/[id]/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProjectForm from '@/components/forms/ProjectForm';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`);
      if (!response.ok) throw new Error('Project not found');
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      router.push('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Project updated successfully!');
        router.push('/admin/projects');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update project');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Project deleted successfully');
        router.push('/admin/projects');
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <Link href="/admin/projects">
          <button className="px-4 py-2 bg-primary rounded-lg">
            Back to Projects
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <button className="p-2 glassmorphic rounded-lg hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Project</h1>
            <p className="text-gray-400">Update your project information</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/projects/${project.slug}`} target="_blank">
            <button className="flex items-center gap-2 px-4 py-2 glassmorphic rounded-lg hover:bg-white/10 transition">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Project Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphic p-6"
      >
        <ProjectForm
          initialData={project}
          onSubmit={handleSubmit}
          isSubmitting={saving}
          submitButtonText="Update Project"
        />
      </motion.div>
    </div>
  );
}
