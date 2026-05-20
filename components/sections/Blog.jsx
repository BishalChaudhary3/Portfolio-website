// components/sections/Blog.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    fetchPosts();
  }, []);

// In components/sections/Blog.jsx
const fetchPosts = async () => {
    const response = await fetch('/api/blog');
    const data = await response.json();
    const parsedData = data.map(post => ({
      ...post,
      tags: typeof post.tags === 'string' 
        ? JSON.parse(post.tags) 
        : (post.tags || [])
    }));
    setPosts(parsedData);
  };

  if (posts.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-dark dark:text-light">Latest </span>
          <span className="text-gradient">Blog</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glassmorphic overflow-hidden group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-dark dark:text-light mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <button className="px-8 py-3 glassmorphic rounded-full font-semibold text-dark dark:text-light hover:bg-white/20 transition">
              View All Posts →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}