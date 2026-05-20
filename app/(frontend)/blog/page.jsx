// app/(frontend)/blog/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, Search } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      
      // Parse tags from JSON string to array
      const parsedData = data.map(post => ({
        ...post,
        tags: typeof post.tags === 'string' 
          ? JSON.parse(post.tags) 
          : (Array.isArray(post.tags) ? post.tags : [])
      }));
      
      setPosts(parsedData);
      setFilteredPosts(parsedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    if (!searchTerm) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredPosts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-dark dark:text-light">My </span>
          <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development and technology
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg glassmorphic focus:border-primary focus:outline-none text-dark dark:text-light placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No blog posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
                    
                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags && post.tags.length > 0 ? (
                        post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-primary/20 text-primary dark:text-primary-light rounded-full">
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">No tags</span>
                      )}
                      {post.tags && post.tags.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-500 dark:text-gray-400 rounded-full">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}