
import React from 'react';
import { ServicesTemplate } from '../../components/templates/ServicesTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expert Web Development Services | Custom AI & Cloud Solutions',
    description: 'Specializing in custom web applications, premium websites, and AI/Automation solutions. Transform your digital presence with scalable, high-performance code.',
    openGraph: {
        title: 'Expert Web Development Services | Custom AI & Cloud Solutions',
        description: 'Scalable web applications, premium design, and intelligent automation built for growth.',
        // Add images if available, e.g., images: ['/og-services.jpg']
    }
};

export default function ServicesPage() {
    return <ServicesTemplate />;
}
