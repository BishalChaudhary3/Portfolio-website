// components/sections/Hero.jsx
'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Typed from 'typed.js';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: [
                'Full Stack Developer',
                'UI/UX Enthusiast',
                'Problem Solver',
                'Open Source Contributor'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
        });

        return () => typed.destroy();
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 max-w-5xl mx-auto px-4"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="mb-8"
                >
                    <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary to-dark p-1 shadow-xl shadow-dark/10 animate-float">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-light to-secondary/50">
                            <Image
                                src="/images/profile/IMG_8256.PNG"
                                alt="Bishal Chaudhary"
                                fill
                                priority
                                sizes="128px"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold mb-4"
                >
                    <span className="text-dark dark:text-light">Hi, I'm </span>
                    <span className="text-gradient">Bishal Chaudhary</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
                >
                    <span ref={typedRef} className="font-semibold text-primary dark:text-primary-light" />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
                >
                    Building amazing web experiences with modern technologies.
                    Passionate about creating beautiful, performant, and user-friendly applications.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-4 justify-center flex-wrap"
                >
                    <Link href="/projects">
                        <button className="btn-primary">
                            View Projects
                        </button>
                    </Link>

                    <Link href="/contact">
                        <button className="btn-secondary">
                            Contact Me
                        </button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                >
                    <ArrowDown className="w-6 h-6 animate-bounce text-primary dark:text-primary-light" />
                </motion.div>
            </motion.div>
        </section>
    );
}