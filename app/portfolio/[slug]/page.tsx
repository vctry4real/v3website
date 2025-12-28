"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, User, Code, Calendar, Layers } from 'lucide-react';
import { projectService, type ProjectData } from '../../../components/lib/adminService';

export default function ProjectDetailPage() {
    const { slug } = useParams();
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const slugStr = Array.isArray(slug) ? slug[0] : slug;
                const data = await projectService.getBySlug(slugStr);
                setProject(data);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-light">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-light">
                <div className="text-center z-10">
                    <h1 className="text-3xl font-bold text-text mb-4">Project Not Found</h1>
                    <p className="text-text-muted mb-8">The project you're looking for doesn't exist.</p>
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center px-6 py-3 bg-primary text-bg-dark font-bold rounded hover:bg-secondary transition-colors duration-300"
                    >
                        Back to Portfolio
                    </Link>
                </div>
            </div>
        );
    }

    // Marquee text lines (same as Hero)
    const marqueeLines = [
        "WEB ENGINEERING • FRONTEND MASTERY • CLOUD SOLUTIONS • ",
        "INSPIRING INNOVATION • BUILDING PRODUCTS • ARCHITECTING SUCCESS • ",
        "SOFTWARE EXCELLENCE • TECHNICAL LEADERSHIP • DIGITAL TRANSFORMATION • "
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-bg-light relative overflow-hidden">
            {/* Animated Background Marquee Text */}
            <div className="fixed inset-0 flex flex-col justify-center gap-8 overflow-hidden pointer-events-none select-none z-0">
                {marqueeLines.map((line, index) => (
                    <div
                        key={index}
                        className="whitespace-nowrap opacity-100"
                        style={{
                            animation: `marquee-${index % 2 === 0 ? 'left' : 'right'} ${40 + index * 5}s linear infinite`
                        }}
                    >
                        <span className="text-[12vw] font-black text-text/4 tracking-tighter leading-none inline-block">
                            {line.repeat(3)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                {/* Back Link */}
                <div className="mb-12">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center text-text-muted hover:text-primary transition-colors duration-300 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Portfolio</span>
                    </Link>
                </div>

                {/* Project Header */}
                <div className="mb-16">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                            {project.category}
                        </span>
                        {project.featured && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-text/10 text-text border border-text/20 backdrop-blur-sm">
                                Featured
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text mb-6 leading-tight">
                        {project.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-text-muted max-w-3xl leading-relaxed mb-8">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm md:text-base border-y border-border/30 py-6 backdrop-blur-sm bg-bg-light/30 rounded-lg px-4">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <span>{project.role}</span>
                        </div>
                        {project.analytics?.linesOfCode && (
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-primary" />
                                <span>{project.analytics.linesOfCode.toLocaleString()} LOC</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" />
                            <span>{project.tech?.length || 0} Technologies</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Project Image */}
                        {project.image && (
                            <div className="rounded-sm overflow-hidden border border-border/50 bg-bg-light/30 shadow-2xl relative">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-auto object-cover relative z-10"
                                />
                            </div>
                        )}

                        {/* About */}
                        <div className="bg-bg-light/40 backdrop-blur-md p-8 rounded-sm border border-border/30">
                            <h2 className="text-2xl font-bold text-text mb-6 flex items-center">
                                <span className="w-8 h-[2px] bg-primary mr-3"></span>
                                About This Project
                            </h2>
                            <div className="text-text-muted leading-relaxed whitespace-pre-wrap text-lg space-y-4">
                                {project.content}
                            </div>
                        </div>

                        {/* Screenshots Grid */}
                        {project.screenshots && project.screenshots.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-text mb-6 flex items-center">
                                    <span className="w-8 h-[2px] bg-primary mr-3"></span>
                                    Gallery
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.screenshots.map((screenshot, index) => (
                                        <div key={index} className="rounded-sm overflow-hidden border border-border/50 group shadow-lg">
                                            <img
                                                src={screenshot}
                                                alt={`${project.title} screenshot ${index + 1}`}
                                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-10">
                        {/* Links Card */}
                        <div className="p-8 bg-bg-light/40 backdrop-blur-md border border-border/50 rounded-sm">
                            <h3 className="text-lg font-bold text-text mb-6">Project Links</h3>
                            <div className="space-y-4">
                                {project.live && (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center space-x-2 w-full p-4 bg-primary text-bg-dark font-bold rounded hover:bg-secondary transition-all duration-300"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        <span>View Live Demo</span>
                                    </a>
                                )}
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center space-x-2 w-full p-4 bg-transparent border border-border text-text hover:border-primary hover:text-primary transition-all duration-300 rounded"
                                    >
                                        <Github className="w-5 h-5" />
                                        <span>View Source Code</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Technologies */}
                        {project.tech && project.tech.length > 0 && (
                            <div className="p-8 bg-bg-light/40 backdrop-blur-md border border-border/50 rounded-sm">
                                <h3 className="text-lg font-bold text-text mb-6">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-bg-dark/50 border border-border text-text-muted text-sm rounded hover:border-primary/50 hover:text-primary transition-colors duration-300"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="p-8 bg-transparent border-t border-border/30">
                                <h3 className="text-lg font-bold text-text mb-6">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-sm text-text-muted italic bg-bg-dark/30 px-2 py-1 rounded"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inline styles for marquee animations */}
            <style jsx>{`
                @keyframes marquee-left {
                    from {
                        transform: translateX(0%);
                    }
                    to {
                        transform: translateX(-33.333%);
                    }
                }
                
                @keyframes marquee-right {
                    from {
                        transform: translateX(-33.333%);
                    }
                    to {
                        transform: translateX(0%);
                    }
                }
            `}</style>
        </div>
    );
}
