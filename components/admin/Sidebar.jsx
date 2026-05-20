// components/admin/Sidebar.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderGit2, Mail, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FolderGit2, label: 'Projects', href: '/admin/projects' },
    { icon: Mail, label: 'Messages', href: '/admin/messages' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-dark/90 border-r border-[#6D8196]/20 p-6">
      <h2 className="text-2xl font-bold mb-8 text-[#6D8196]">Admin Panel</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-[#6D8196] text-light' 
                    : 'text-gray-300 hover:bg-[#6D8196]/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 w-full mt-8 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}