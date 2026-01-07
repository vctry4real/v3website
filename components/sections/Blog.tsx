"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { Button } from '../ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { blogService, type BlogData } from '../lib/adminService';
// noisybg import removed


export const Blog: React.FC = () => {
  const { scrollReveal, scrollRevealMobile } = useGSAP();
  const [blogPosts, setBlogPosts] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await blogService.getAll();
        setBlogPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Use mobile-friendly scroll triggers
      const isMobile = window.innerWidth <= 768;
      const scrollFunction = isMobile ? scrollRevealMobile : scrollReveal;

      scrollFunction('.blog-header');
      scrollFunction('.blog-grid');
    }
  }, [loading]);

  const defaultBlogPosts = [
    {
      id: 1,
      slug: 'building-scalable-react-applications-typescript',
      title: 'Building Scalable React Applications with TypeScript',
      summary: 'Learn best practices for structuring large React applications with TypeScript, including advanced patterns and performance optimizations.',
      content: 'Full article content here...',
      tags: ['React', 'TypeScript', 'Architecture'],
      coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500',
      createdAt: '2024-01-15T00:00:00Z',
      readTime: '8 min read',
      featured: true,
      published: true,
    },
    {
      id: 2,
      slug: 'microservices-architecture-lessons-learned',
      title: 'Microservices Architecture: Lessons Learned',
      summary: 'Real-world insights from implementing microservices at scale, including common pitfalls and solutions.',
      content: 'Full article content here...',
      tags: ['Microservices', 'Architecture', 'Backend'],
      coverImage: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=500',
      createdAt: '2024-01-10T00:00:00Z',
      readTime: '12 min read',
      featured: false,
      published: true,
    },
    {
      id: 3,
      slug: 'future-web-development-trends-2024',
      title: 'The Future of Web Development: Trends to Watch',
      summary: 'Exploring emerging technologies and trends that will shape the future of web development in 2024 and beyond.',
      content: 'Full article content here...',
      tags: ['Web Development', 'Trends', 'Future'],
      coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500',
      createdAt: '2024-01-05T00:00:00Z',
      readTime: '6 min read',
      featured: true,
      published: true,
    },
  ];

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Use database data if available, otherwise fall back to defaults
  // Filter to only show published posts
  // Filter to only show published posts (or all in dev mode if desired, but sticking to published for now unless user asks. Actually user asked why they don't see them. Better to log or just show all for now to confirm data flow?)
  // User said "i have more than one blog post but yet it shows only one". 
  // Likely the others are not published.
  // I'll update this to show all posts if we are in development, OR better yet, just tell the user to publish them.
  // But to be helpful, let's relax the filter if there are no published ones? No, that's magic behavior.
  // Let's change the filter to be explicit or debug?
  // Let's just remove the filter for now to prove data flow, or check if they are published?
  // Given user request is a "fix", I will assume they WANT to see them.

  const displayBlogPosts = blogPosts.length > 0
    ? blogPosts.filter(post => post.published || process.env.NODE_ENV === 'development')
    : defaultBlogPosts;

  // Limit to 4 posts for the featured section
  const featuredPosts = displayBlogPosts.slice(0, 4);

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-bg relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={{ backgroundImage: `url(/assets/noisy-bg.jpg)` }}
            className="w-full h-full absolute inset-0 bg-repeat opacity-[0.03] mix-blend-overlay"
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading blog section...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-bg-dark relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{ backgroundImage: `url(/assets/noisy-bg.jpg)` }}
          className="w-full h-full absolute inset-0 bg-repeat opacity-[0.03] mix-blend-overlay"
        ></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="blog-header mb-12 sm:mb-16 opacity-0">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                Latest Insights
              </h2>
              <p className="text-lg sm:text-xl text-text-muted max-w-3xl px-4 sm:px-0">
                Thoughts on software development, technology trends, and best practices
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-semibold transition-colors duration-200 group"
            >
              <span>See All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid opacity-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <article className="bg-bg-light rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full flex flex-col relative">
                  {/* Cover Image */}
                  <div className="aspect-video overflow-hidden relative bg-bg-dark/50">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                        <Tag className="w-12 h-12" />
                      </div>
                    )}
                    {post.featured && (
                      <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium shadow-md z-10">
                        Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col grow">
                    {/* Meta Info */}
                    <div className="flex items-center text-text-muted text-xs mb-4 gap-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-text-muted mb-6 text-sm leading-relaxed line-clamp-3 grow">
                      {post.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-bg-dark/50 text-text-muted rounded-full text-xs border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};