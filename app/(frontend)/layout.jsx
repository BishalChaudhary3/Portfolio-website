// app/(frontend)/layout.jsx
'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function FrontendLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}