// app/admin/messages/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Reply, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/contact/messages/${id}`, { method: 'PUT' });
      fetchMessages();
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-gray-400">View and manage contact form submissions</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="glassmorphic p-12 text-center">
            <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glassmorphic p-6 ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{message.name}</h3>
                  <p className="text-gray-400">{message.email}</p>
                </div>
                <div className="flex gap-2">
                  {!message.isRead && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="p-2 hover:bg-green-500/20 rounded-lg transition"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </button>
                  )}
                  <a href={`mailto:${message.email}`}>
                    <button className="p-2 hover:bg-primary/20 rounded-lg transition" title="Reply">
                      <Reply className="w-4 h-4" />
                    </button>
                  </a>
                </div>
              </div>
              <p className="text-sm font-semibold mb-2">Subject: {message.subject}</p>
              <p className="text-gray-300 mb-4 whitespace-pre-wrap">{message.message}</p>
              <p className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}