// components/forms/ProjectForm.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, X, AlertCircle, 
  Github, ExternalLink, Image as ImageIcon, 
  Tag, Save, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
  description: z.string().min(20, 'Description must be at least 20 characters').max(200, 'Description too long'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  published: z.boolean().default(true),
});

export default function ProjectForm({ 
  initialData = null, 
  onSubmit, 
  isSubmitting = false,
  submitButtonText = 'Create Project'
}) {
  const [techInput, setTechInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const { register, control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      techStack: [],
      githubUrl: '',
      demoUrl: '',
      images: [],
      published: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techStack',
  });

  const watchImages = watch('images');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const addTech = () => {
    if (techInput.trim() && !fields.some(field => field === techInput)) {
      append(techInput);
      setTechInput('');
    }
  };

  const removeTech = (index) => {
    remove(index);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleFormSubmit = async (data) => {
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }
    onSubmit(data);
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none transition";
  const labelClasses = "block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300";
  const errorClasses = "text-red-500 text-sm mt-1 flex items-center gap-1";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'basic' 
              ? 'bg-gradient-to-r from-primary to-dark text-white' 
              : 'hover:bg-white/10'
          }`}
        >
          Basic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'media' 
              ? 'bg-gradient-to-r from-primary to-dark text-white' 
              : 'hover:bg-white/10'
          }`}
        >
          Media & Links
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'advanced' 
              ? 'bg-gradient-to-r from-primary to-dark text-white' 
              : 'hover:bg-white/10'
          }`}
        >
          Advanced
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <motion.div
            key="basic"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div>
              <label className={labelClasses}>Project Title *</label>
              <input
                {...register('title')}
                className={`${inputClasses} ${errors.title ? 'border-red-500' : ''}`}
                placeholder="My Amazing Project"
              />
              {errors.title && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Slug (URL)</label>
              <div className="flex gap-2">
                <input
                  {...register('slug')}
                  className={`${inputClasses} ${errors.slug ? 'border-red-500' : ''}`}
                  placeholder="my-amazing-project"
                />
                <button
                  type="button"
                  onClick={() => setValue('slug', generateSlug(watch('title')))}
                  className="px-3 py-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition"
                >
                  Auto
                </button>
              </div>
              {errors.slug && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Short Description *</label>
              <textarea
                {...register('description')}
                rows="3"
                className={`${inputClasses} resize-none ${errors.description ? 'border-red-500' : ''}`}
                placeholder="A brief description of your project..."
              />
              {errors.description && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {watch('description')?.length || 0} / 200 characters
              </p>
            </div>

            <div>
              <label className={labelClasses}>Full Content *</label>
              <textarea
                {...register('content')}
                rows="10"
                className={`${inputClasses} resize-none font-mono text-sm ${errors.content ? 'border-red-500' : ''}`}
                placeholder="Detailed description of your project..."
              />
              {errors.content && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.content.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                <Tag className="w-4 h-4 inline mr-2" />
                Technologies Used *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className={`flex-1 ${inputClasses}`}
                  placeholder="e.g., React, Next.js, Tailwind"
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
                {fields.map((field, index) => (
                  <span
                    key={field.id}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full flex items-center gap-2"
                  >
                    {field}
                    <button
                      type="button"
                      onClick={() => removeTech(index)}
                      className="hover:text-red-500 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.techStack && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.techStack.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <motion.div
            key="media"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div>
              <label className={labelClasses}>
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Project Images *
              </label>
              <ImageUploader
                onUpload={(url) => {
                  const currentImages = watchImages || [];
                  setValue('images', [...currentImages, url]);
                }}
                multiple
                maxFiles={5}
              />
              {watchImages && watchImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Uploaded Images:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {watchImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...watchImages];
                            newImages.splice(index, 1);
                            setValue('images', newImages);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.images && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.images.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                <Github className="w-4 h-4 inline mr-2" />
                GitHub Repository URL
              </label>
              <input
                {...register('githubUrl')}
                className={inputClasses}
                placeholder="https://github.com/username/project"
              />
              {errors.githubUrl && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.githubUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                <ExternalLink className="w-4 h-4 inline mr-2" />
                Live Demo URL
              </label>
              <input
                {...register('demoUrl')}
                className={inputClasses}
                placeholder="https://project-demo.com"
              />
              {errors.demoUrl && (
                <p className={errorClasses}>
                  <AlertCircle className="w-3 h-3" />
                  {errors.demoUrl.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between p-4 glassmorphic">
              <div>
                <label className="font-semibold">Published Status</label>
                <p className="text-sm text-gray-500">
                  Make this project visible to visitors
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary-dark peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="glassmorphic p-4">
              <h4 className="font-semibold mb-3">SEO Preview</h4>
              <div className="space-y-2">
                <p className="text-blue-500 text-sm">{watch('slug') ? `/${watch('slug')}` : '/project-slug'}</p>
                <p className="font-medium text-lg">{watch('title') || 'Project Title'}</p>
                <p className="text-gray-500 text-sm line-clamp-2">{watch('description') || 'Project description will appear here...'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-white/10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-primary to-dark rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {submitButtonText === 'Create Project' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {submitButtonText}
            </>
          )}
        </button>
        
        <Link href="/admin/projects">
          <button type="button" className="px-6 py-3 glassmorphic rounded-lg font-semibold hover:bg-white/10 transition">
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
}