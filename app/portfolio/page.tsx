
import React from 'react';
import { PortfolioTemplate } from '@/components/templates/PortfolioTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Portfolio | Full-Stack Development Projects',
    description: 'Explore my diverse portfolio of custom web applications, SaaS platforms, and digital solutions. See how I solve complex engineering challenges.',
    openGraph: {
        title: 'Portfolio | Full-Stack Development Projects',
        description: 'Selected works showcasing full-stack engineering, React, Node.js, and cloud architecture.',
    }
};

export default function PortfolioPage() {
    return <PortfolioTemplate />;
}
