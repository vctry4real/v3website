
import React from 'react';
import { Metadata } from 'next';
import { blogService, profileImageService } from '@/components/lib/adminService';
import { BlogDetailsTemplate } from '@/components/templates/BlogDetailsTemplate';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await blogService.getBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found | Victory Johnson',
            description: 'The requested blog post could not be found.',
        };
    }

    return {
        title: `${post.title} | Victory Johnson Blog`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            type: 'article',
            publishedTime: post.createdAt,
            images: post.coverImage ? [post.coverImage] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function BlogDetailsPage({ params }: PageProps) {
    const { slug } = await params;

    // Parallel data fetching
    const [post, profileImage] = await Promise.all([
        blogService.getBySlug(slug),
        profileImageService.get(),
    ]);

    return <BlogDetailsTemplate post={post} profileImage={profileImage} slug={slug} />;
}
