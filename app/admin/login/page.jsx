'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || 'Invalid credentials');
                return;
            }

            localStorage.setItem('admin_token', data.token);
            toast.success('Login successful!');
            router.replace('/admin/dashboard');
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#4A4A4A] px-4">
            <div className="bg-dark/90 rounded-lg p-8 w-full max-w-md shadow-xl">

                <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Admin Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#6D8196] focus:outline-none text-white placeholder-gray-400"
                        required
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-[#6D8196] focus:outline-none text-white placeholder-gray-400"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#6D8196] text-light font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Demo: admin@example.com / admin123
                </p>

            </div>
        </div>
    );
}
