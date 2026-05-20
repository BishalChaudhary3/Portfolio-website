// app/admin/projects/new/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    techStack: [],
    githubUrl: '',
    demoUrl: '',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085'],
  });
  const [techInput, setTechInput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTech = () => {
    if (techInput && !formData.techStack.includes(techInput)) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput],
      });
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Project created successfully!');
        router.push('/admin/projects');
      } else {
        toast.error('Failed to create project');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects">
          <button className="p-2 glassmorphic rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
          <p className="text-gray-400">Add a new project to your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glassmorphic p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Project Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Tech Stack</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              placeholder="e.g., React"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map(tech => (
              <span key={tech} className="px-3 py-1 bg-primary/20 rounded-full flex items-center gap-2">
                {tech}
                <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Demo URL</label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Image URL</label>
          <input
            type="url"
            name="images"
            value={formData.images[0]}
            onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </motion.button>
          <Link href="/admin/projects">
            <button type="button" className="px-6 py-3 glassmorphic rounded-lg font-semibold">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
