import { MetadataRoute } from 'next';
import { blogService, projectService } from '@/components/lib/adminService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://vctry4real.com'; // Replace with actual domain

    // Get all dynamic data
    const posts = await blogService.getAll();
    const projects = await projectService.getAll();

    const blogUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.createdAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const projectUrls = projects.map((project) => ({
        url: `${baseUrl}/portfolio/${project.slug}`, // Assuming portfolio detail pages exist or will exist
        // If portfolio detail pages don't exist yet, this might 404. 
        // Given the task, I will include them, but strictly speaking only if the page exists.
        // The previous analysis showed /portfolio/page.tsx, but not /portfolio/[slug]/page.tsx.
        // However, the user asked to guide crawlers through project history "MineApp to RetailBox".
        // I should create these detail pages or at least anchors?
        // Actually, looking at the code, `projectService` has `slug`.
        // But `app/portfolio` only has `page.tsx`. There is no `[slug]`.
        // So generating these URLs is premature if the pages don't exist.
        // Reviewing user request: "guide search crawlers through your project history, from MineApp to RetailBox."
        // This implies these pages SHOULD exist. But I haven't been asked to create them, only the sitemap.
        // I will exclude them for now or ask user?
        // Wait, the user said "Generate a sitemap... to guide search crawlers through your project history".
        // If I generate links that don't exist, that's bad SEO.
        // I'll stick to static pages + blog posts for now, unless I see a project detail page.
        // Checked file list: dynamic project page does not exist.
        // So I will only include the main portfolio page, NOT individual project pages yet.
        // EXCEPT: The user explicitly said "guide ... through your project history".
        // Maybe they meant the Portfolio page itself handles it?
        // Or maybe I should list the projects as anchors? Sitemaps don't do anchors.
        // I'll add the STATIC pages: /, /about, /services, /portfolio, /blog, /contact
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    })).filter(() => false); // DISABLED for now until route exists

    const routes = [
        '',
        '/about',
        '/services',
        '/portfolio',
        '/blog',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes, ...blogUrls];
}
