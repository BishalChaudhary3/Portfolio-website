'use client';

import {
  Users,
  Eye,
  Mail,
  FolderGit2,
  LogOut
} from 'lucide-react';

import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');

    toast.success('Logged out successfully');

    router.replace('/admin/login');
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Dashboard
          </h1>

          <p className="text-gray-400">
            Welcome to your admin dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <DashboardCard
          icon={<Users className="w-6 h-6 text-light" />}
          value="0"
          label="Visitors"
        />

        <DashboardCard
          icon={<FolderGit2 className="w-6 h-6 text-light" />}
          value="0"
          label="Projects"
        />

        <DashboardCard
          icon={<Mail className="w-6 h-6 text-light" />}
          value="0"
          label="Messages"
        />

        <DashboardCard
          icon={<Eye className="w-6 h-6 text-light" />}
          value="0"
          label="Views"
        />

      </div>

      <div className="bg-dark/90 rounded-xl p-6 border border-[#6D8196]/20">

        <h2 className="text-xl font-bold mb-4 text-white">
          Quick Actions
        </h2>

        <div className="flex gap-4 flex-wrap">

          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-[#6D8196] text-light rounded-lg"
          >
            Add Project
          </Link>

          <Link
            href="/admin/messages"
            className="px-4 py-2 bg-[#6D8196] text-light rounded-lg"
          >
            View Messages
          </Link>

        </div>

      </div>

    </div>
  );
}

function DashboardCard({ icon, value, label }) {
  return (
    <div className="bg-dark/90 rounded-xl p-6 border border-[#6D8196]/20">

      <div className="w-12 h-12 rounded-lg bg-[#6D8196] flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-white">
        {value}
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        {label}
      </p>

    </div>
  );
}