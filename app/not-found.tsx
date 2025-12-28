"use client";

import React from 'react';
import Link from 'next/link';
// import { Helmet } from 'react-helmet-async'; // Next.js uses Metadata usually, but client components have limits
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center px-4">
                {/* 404 Animation */}
                <div className="mb-8">
                    <div className="relative">
                        <h1 className="text-9xl font-bold text-gray-800">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Search className="w-16 h-16 text-blue-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-4xl font-bold text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Oops! The page you're looking for doesn't exist. It might have been moved,
                    deleted, or you entered the wrong URL.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/">
                        <Button size="lg" className="flex items-center">
                            <Home className="w-5 h-5 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </Button>
                </div>

                {/* Quick Links */}
                <div className="mt-12">
                    <h3 className="text-lg font-medium text-white mb-4">Quick Links</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/#projects"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            Projects
                        </Link>
                        <Link
                            href="/#blog"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/#contact"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/about" // Changed from #about as we now have /about page
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            About
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
