
import React from 'react';

export const JsonLd = () => {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Victory Johnson',
        url: 'https://vctry4real.com', // Replace with actual domain
        image: 'https://vctry4real.com/profile.jpg', // Replace with actual profile image URL
        sameAs: [
            'https://github.com/vctry4real', // Replace with actual GitHub
            'https://linkedin.com/in/vctry4real', // Replace with actual LinkedIn
            'https://twitter.com/vctry4real',
        ],
        jobTitle: 'Software Engineer',
        worksFor: {
            '@type': 'Organization',
            name: 'Freelance / Self-Employed',
        },
        description: 'Full-stack software engineer specializing in custom web applications and AI solutions.',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
};
