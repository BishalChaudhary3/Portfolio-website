// components/admin/MessageList.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, CheckCircle, Reply, Trash2, Eye, 
  Star, StarOff, Filter, Search, Download,
  ChevronLeft, ChevronRight, User, Calendar, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessageList({ messages: initialMessages, onMessageUpdate }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, read, unread, starred
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, detail
  const itemsPerPage = 10;

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      });
      
      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === id ? { ...msg, isRead: true } : msg
        ));
        toast.success('Marked as read');
        if (onMessageUpdate) onMessageUpdate();
      }
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
        toast.success('Message deleted');
        if (onMessageUpdate) onMessageUpdate();
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleStar = (id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'read' ? msg.isRead :
      filter === 'unread' ? !msg.isRead :
      filter === 'starred' ? msg.starred : true;
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Date', 'Status'];
    const csvData = messages.map(msg => [
      msg.name,
      msg.email,
      msg.subject,
      msg.message.replace(/,/g, ' '),
      new Date(msg.createdAt).toLocaleString(),
      msg.isRead ? 'Read' : 'Unread'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.isRead).length,
    read: messages.filter(m => m.isRead).length,
    starred: messages.filter(m => m.starred).length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glassmorphic p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="glassmorphic p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.unread}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="glassmorphic p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Read</p>
              <p className="text-2xl font-bold text-green-500">{stats.read}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="glassmorphic p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Starred</p>
              <p className="text-2xl font-bold text-amber-500">{stats.starred}</p>
            </div>
            <Star className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphic p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {['all', 'unread', 'read', 'starred'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                  filter === f 
                    ? 'bg-gradient-to-r from-primary to-dark text-white'
                    : 'hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <button
            onClick={exportToCSV}
            className="px-3 py-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="glassmorphic overflow-hidden">
        {viewMode === 'list' ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr className="text-left">
                    <th className="p-4 w-12"></th>
                    <th className="p-4">From</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginatedMessages.map((message) => (
                      <motion.tr
                        key={message.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-b border-white/5 hover:bg-white/5 transition cursor-pointer ${
                          !message.isRead ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          setSelectedMessage(message);
                          setViewMode('detail');
                        }}
                      >
                        <td className="p-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStar(message.id);
                            }}
                          >
                            {message.starred ? (
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{message.name}</p>
                            <p className="text-xs text-gray-400">{message.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{message.subject}</p>
                          <p className="text-sm text-gray-400 line-clamp-1">{message.message}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {!message.isRead ? (
                            <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-500 rounded-full">
                              Unread
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                              Read
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {!message.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(message.id);
                                }}
                                className="p-1 hover:bg-green-500/20 rounded transition"
                                title="Mark as read"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </button>
                            )}
                            <a href={`mailto:${message.email}`}>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 hover:bg-primary/20 rounded transition"
                                title="Reply"
                              >
                                <Reply className="w-4 h-4 text-primary" />
                              </button>
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(message.id);
                              }}
                              className="p-1 hover:bg-red-500/20 rounded transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
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
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          // Detail View
          <div className="p-6">
            <button
              onClick={() => setViewMode('list')}
              className="mb-4 text-primary hover:text-primary transition flex items-center gap-2"
            >
              ← Back to messages
            </button>
            
            {selectedMessage && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary">
                          {selectedMessage.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a href={`mailto:${selectedMessage.email}`}>
                      <button className="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition flex items-center gap-2">
                        <Reply className="w-4 h-4" />
                        Reply
                      </button>
                    </a>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="glassmorphic p-6">
                  <div className="whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}