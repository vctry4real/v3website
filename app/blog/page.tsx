"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Search, Filter } from 'lucide-react';
import { blogService, type BlogData } from '../../components/lib/adminService';
import { SearchFilter, useSearchFilter } from '../../components/ui/SearchFilter';
import toast from 'react-hot-toast';

import { useGSAP } from '../../components/hooks/useGSAP';

export default function BlogPage() {
    const { fadeInUp, staggerFadeIn } = useGSAP();
    const [blogPosts, setBlogPosts] = useState<BlogData[]>([]);
    const [loading, setLoading] = useState(true);

    // Search and filter functionality
    const {
        searchValue,
        setSearchValue,
        activeFilters,
        setActiveFilters,
        filteredData: filteredBlogPosts,
        filterOptions,
    } = useSearchFilter(blogPosts, ['title', 'summary', 'content']);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    useEffect(() => {
        if (!loading) {
            fadeInUp('.blog-header');
            staggerFadeIn('.blog-card');
        }
    }, [loading]);

    const fetchBlogPosts = async () => {
        try {
            const posts = await blogService.getAll();
            setBlogPosts(posts);
        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
            toast.error('Unable to load blog posts. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-muted">Loading blog posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-dark pt-32 pb-20">
            {/* Header */}
            <div className="blog-header opacity-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-black text-text mb-6">Latest Insights</h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                    Thoughts on software development, technology trends, and industry insights
                </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    {/* Note: Ideally SearchFilter should be updated to accept custom classes or use theme tokens internally. 
                        Assuming it inherits some or might need a wrapper context. 
                        If SearchFilter has hardcoded styles, we might need to modify that component too. 
                        For now, putting it in a container. */}
                    <div className="bg-bg-light/30 backdrop-blur-sm p-2 rounded-lg border border-border/30">
                        <SearchFilter
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            filters={filterOptions}
                            activeFilters={activeFilters}
                            onFilterChange={setActiveFilters}
                            placeholder="Search blog posts..."
                        />
                    </div>
                </div>

                {/* Results Summary */}
                {blogPosts.length > 0 && (
                    <div className="flex items-center justify-between text-sm text-text-muted mb-8 px-2">
                        <span>
                            Showing {filteredBlogPosts.length} of {blogPosts.length} posts
                            {(searchValue || activeFilters.length > 0) && ' (filtered)'}
                        </span>
                        {(searchValue || activeFilters.length > 0) && (
                            <button
                                onClick={() => {
                                    setSearchValue('');
                                    setActiveFilters([]);
                                }}
                                className="text-primary hover:text-primary/80 font-bold transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* Blog Posts Grid */}
                {filteredBlogPosts.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-border/30 rounded-xl bg-bg-light/5">
                        <div className="max-w-md mx-auto">
                            <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                            <p className="text-text text-lg mb-2">
                                No posts found
                            </p>
                            <p className="text-text-muted text-sm">
                                Try adjusting your search terms or filters.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="blog-card opacity-0 block h-full"
                            >
                                <article className="bg-bg-light rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full flex flex-col hover:shadow-2xl hover:shadow-primary/5">
                                    {post.coverImage && (
                                        <div className="aspect-video overflow-hidden relative">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                                        </div>
                                    )}
                                    <div className="p-8 flex flex-col grow">
                                        <div className="flex items-center space-x-4 text-xs font-medium text-text-muted mb-4 uppercase tracking-wider">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                            {post.readTime && (
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-2xl font-bold text-text mb-4 leading-tight group-hover:text-primary transition-colors duration-200">
                                            {post.title}
                                        </h2>

                                        <p className="text-text-muted mb-6 leading-relaxed line-clamp-3 text-sm grow">
                                            {post.summary}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-border/10 flex flex-col gap-4">
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags?.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-bg-dark/50 text-text-muted text-[10px] rounded border border-border/50 uppercase tracking-wide"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform duration-200">
                                                    Read Article <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
