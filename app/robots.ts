import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Disallow admin routes
        },
        sitemap: 'https://vctry4real.com/sitemap.xml',
    };
}
