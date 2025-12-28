"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useGSAP } from '../hooks/useGSAP';
import { projectService, type ProjectData } from '../lib/adminService';

export const Projects: React.FC = () => {
    const { scrollReveal } = useGSAP();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectService.getAll();
                // Filter for featured projects and limit to 4, or just take first 4 if none featured
                const featured = data.filter(p => p.featured);
                setProjects(featured.length > 0 ? featured.slice(0, 4) : data.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!loading && projects.length > 0) {
            scrollReveal('.projects-header');
            scrollReveal('.project-card', 0.1 as any);
        }
    }, [scrollReveal, loading, projects]);

    if (loading) {
        // Optional: meaningful loading state or just return null to not shift layout too much
        return (
            <section id="projects" className="py-24 bg-transparent relative min-h-[600px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </section>
        )
    }

    return (
        <section id="projects" className="py-24 bg-transparent relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header with See All Button */}
                <div className="projects-header flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="w-full md:w-auto">
                        <h3 className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
                            Featured Work
                        </h3>
                        <h2 className="text-3xl md:text-5xl font-bold text-text mb-4">
                            A showcase of my recent works
                        </h2>
                        <p className="text-xl text-text-muted max-w-2xl leading-relaxed">
                            Demonstrating expertise across different technologies and domains
                        </p>
                    </div>
                    {/* See All Button - Aligned with title on desktop */}
                    <div className="w-full md:w-auto flex justify-start md:justify-end">
                        <Link
                            href="/portfolio"
                            className="group inline-flex items-center text-text hover:text-primary transition-colors duration-300 border-b border-transparent hover:border-primary pb-1"
                        >
                            <span className="text-sm font-medium mr-2">See All Work</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>

                {/* Projects Grid - 2x2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {projects.map((project, index) => (
                        <Link
                            key={project.id || index}
                            href={`/portfolio/${project.slug}`}
                            className="project-card group relative block w-full aspect-[4/3] overflow-hidden rounded-sm bg-bg-light"
                        >
                            {/* Image with Zoom Effect */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                {project.image && (
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                        style={{ backgroundImage: `url(${project.image})` }}
                                    >
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                                    </div>
                                )}
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-black bg-white/90 rounded-full backdrop-blur-sm">
                                            {project.category}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                    </div>
                                    <div className="bg-primary rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        <ArrowUpRight className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};