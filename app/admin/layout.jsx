'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    // LOGIN PAGE
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    // PROTECTED ROUTES
    if (!token) {
      router.replace('/admin/login');
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  // SHOW LOADER
  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4A4A4A] text-white">
        Loading...
      </div>
    );
  }

  // LOGIN PAGE WITHOUT SIDEBAR
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // ADMIN PAGES
  return (
    <div className="flex min-h-screen bg-[#4A4A4A]">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}