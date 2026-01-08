"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, Share2, User } from 'lucide-react';
import { useGSAP } from '@/components/hooks/useGSAP';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { type BlogData, type ProfileImageData } from '@/components/lib/adminService';
import { LikeButton } from '@/components/blog/LikeButton';
import { CommentSection } from '@/components/blog/CommentSection';

interface BlogDetailsTemplateProps {
    post: BlogData | null;
    profileImage: ProfileImageData | null;
    slug: string;
}

export const BlogDetailsTemplate: React.FC<BlogDetailsTemplateProps> = ({ post, profileImage, slug }) => {
    const { fadeInUp } = useGSAP();

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (post) {
            fadeInUp('.blog-element');
        }
    }, [post, fadeInUp]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Function to render content (Markdown)
    const renderContent = (content: string) => {
        return (
            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed prose-headings:text-text prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80 prose-strong:text-text prose-code:text-primary prose-code:bg-bg-light/50 prose-code:px-1 prose-code:rounded prose-pre:bg-bg-dark prose-pre:border prose-pre:border-border/50 prose-p:text-base sm:text-lg prose-li:text-base prose-blockquote:border-l-primary prose-blockquote:bg-bg-light/10 prose-blockquote:py-1 prose-img:rounded-xl">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                >
                    {content}
                </ReactMarkdown>
            </div>
        );
    };

    if (!post) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="text-center blog-element">
                    <h2 className="text-2xl font-bold text-text mb-4">Post Not Found</h2>
                    <p className="text-text-muted mb-6">The blog post you're looking for doesn't exist.</p>
                    <Link href="/blog" className="text-primary hover:text-primary/80 font-medium">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }


    const handleShare = async () => {
        const shareData = {
            title: post?.title || 'Blog Post',
            text: post?.description || 'Check out this article!',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            // Ignore abort errors (user cancelled share)
            if (err instanceof Error && err.name !== 'AbortError') {
                toast.error('Failed to share article');
            }
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    style={{ backgroundImage: `url(/assets/noisy-bg.jpg)` }}
                    className="w-full h-full absolute inset-0 bg-repeat opacity-[0.03] mix-blend-overlay"
                ></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-32 sm:pb-20 relative z-10">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="blog-element opacity-0 inline-flex items-center text-text-muted hover:text-primary mb-8 sm:mb-12 transition-colors duration-200 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Back to Blog</span>
                    <span className="sm:hidden">Back</span>
                </Link>

                {/* Article Header */}
                <article className="blog-element opacity-0">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-text-muted text-xs sm:text-sm mb-6 uppercase tracking-wider font-medium">
                        {post.createdAt && (
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-primary" />
                                {formatDate(post.createdAt)}
                            </div>
                        )}
                        {post.readTime && (
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                {post.readTime}
                            </div>
                        )}
                        <LikeButton slug={slug} />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text mb-8 leading-tight">
                        {post.title}
                    </h1>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 ring-1 ring-border/20 group">
                            <div className="aspect-video w-full">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="absolute inset-0 bg-linear-to-t from-bg-dark/80 via-transparent to-transparent opacity-60"></div>

                            {post.featured && (
                                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                    Featured
                                </div>
                            )}
                        </div>
                    )}
                </article>

                {/* Content */}
                <div className="blog-element opacity-0 bg-bg-light/30 backdrop-blur-sm rounded-2xl p-6 sm:p-10 border border-border/30 shadow-lg mb-16">
                    {renderContent(post.content)}
                </div>

                {/* Tags & Share */}
                <div className="blog-element opacity-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-8 border-t border-border/20 mb-16">
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1.5 bg-bg-dark/50 text-text-muted rounded-full text-xs border border-border/50 hover:border-primary/50 transition-colors cursor-default"
                                >
                                    <Tag className="w-3 h-3 mr-1.5 text-primary" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleShare}
                        className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Article
                    </button>
                </div>

                {/* Author Box */}
                <div className="blog-element opacity-0 bg-bg-light rounded-xl p-8 border border-border/30 shadow-lg mb-16">
                    <div className="flex items-center gap-6">
                        <div className="shrink-0">
                            {profileImage?.image ? (
                                <img
                                    src={profileImage.image}
                                    alt={profileImage.alt || "Victory Johnson"}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/50 shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-bg-dark border-2 border-primary/50 flex items-center justify-center text-text-muted shadow-md">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text mb-1">Victory Johnson</h3>
                            <p className="text-primary font-medium text-sm mb-3">Full-Stack Software Engineer</p>
                            <p className="text-text-muted text-sm leading-relaxed max-w-lg">
                                Passionate about building scalable applications and sharing knowledge with the developer community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="blog-element opacity-0">
                    <CommentSection slug={slug} />
                </div>
            </div >
        </div >
    );
};
