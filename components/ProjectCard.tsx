import React from 'react';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
    project: {
        id?: string;
        slug: string;
        title: string;
        description: string;
        category: 'fullstack' | 'backend' | 'frontend';
        tags: string[];
        tech: string[];
        github?: string;
        live?: string;
        featured: boolean;
        image?: string;
    };
    viewMode: 'grid' | 'list';
}

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'fullstack':
            return 'bg-purple-600 text-white'; // Updated color class for Tailwind v3
        case 'backend':
            return 'bg-green-600 text-white'; // Updated color class
        case 'frontend':
            return 'bg-blue-600 text-white'; // Updated color class
        default:
            return 'bg-gray-600 text-gray-300';
    }
};

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, viewMode }) => {
    return (
        <div
            className={`relative block bg-bg-light rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 hover:bg-bg-light/80 transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''
                }`}
        >
            {/* Stretched Link to cover the Card */}
            <Link
                href={`/portfolio/${project.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`View project: ${project.title}`}
            />

            {/* Project Image */}
            {project.image && (
                <div className={`overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'}`}>
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Project Content */}
            <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${project.category === 'fullstack' ? 'bg-primary/10 text-primary border-primary/20' :
                        project.category === 'backend' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                            'bg-text/10 text-text border-text/20'
                        }`}>
                        {project.category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors duration-200">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="text-text-muted mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                </p>

                {/* Technologies */}
                {project.tech && Array.isArray(project.tech) && project.tech.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-text-muted mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-bg-dark/50 text-text-muted text-xs rounded border border-border"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-primary/5 text-primary text-xs rounded-full border border-primary/10"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Project Links */}
                <div className="flex items-center justify-between relative z-20" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-4">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-text-muted hover:text-text transition-colors duration-200"
                            >
                                <Github className="w-4 h-4" />
                                <span className="text-sm">Code</span>
                            </a>
                        )}
                        {project.live && (
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors duration-200"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-sm">Live Demo</span>
                            </a>
                        )}
                    </div>

                    {/* Read More Button - no need for extra link, visually indicates card is clickable */}
                    <span className="text-primary hover:text-secondary font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform duration-200">
                        Read More →
                    </span>
                </div>
            </div>
        </div>
    );
});

ProjectCard.displayName = 'ProjectCard';
