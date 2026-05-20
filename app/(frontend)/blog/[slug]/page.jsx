// app/(frontend)/blog/[slug]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Heart, Share2, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();
      
      // Parse tags from JSON string to array
      const parsedPost = {
        ...data,
        tags: typeof data.tags === 'string' 
          ? JSON.parse(data.tags) 
          : (Array.isArray(data.tags) ? data.tags : [])
      };
      
      setPost(parsedPost);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark dark:text-light mb-4">Post not found</h2>
          <Link href="/blog" className="text-primary dark:text-primary-light hover:text-primary-dark">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </motion.button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark dark:text-light mb-4">{post.title}</h1>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="glassmorphic p-8">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              {post.tags && post.tags.length > 0 ? (
                post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-primary/20 text-primary dark:text-primary-light rounded-full text-sm">
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm">No tags</span>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={handleShare}
                className="p-2 glassmorphic rounded-full hover:bg-white/20 transition text-dark dark:text-light"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 glassmorphic rounded-full hover:bg-white/20 transition text-dark dark:text-light">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 glassmorphic rounded-full hover:bg-white/20 transition text-dark dark:text-light">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}