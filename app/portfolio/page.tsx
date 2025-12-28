"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { projectService, type ProjectData } from '@/components/lib/adminService';
import { debounce, measurePerformance } from '@/components/lib/utils';
import { ProjectCard } from '@/components/ProjectCard';

export default function PortfolioPage() {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Debounced search for better performance
    const debouncedSetSearchTerm = useCallback(
        debounce((value: string) => {
            setSearchTerm(value);
        }, 300),
        []
    );

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                measurePerformance('Projects fetch', async () => {
                    const data = await projectService.getAll();
                    setProjects(data);
                    setFilteredProjects(data);
                });
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!loading) {
            const header = document.querySelector('.portfolio-header');
            const filters = document.querySelector('.portfolio-filters');
            const grid = document.querySelector('.portfolio-grid');

            if (header) header.classList.remove('opacity-0');
            if (filters) setTimeout(() => filters.classList.remove('opacity-0'), 200);
            if (grid) setTimeout(() => grid.classList.remove('opacity-0'), 400);
        }
    }, [loading]);

    useEffect(() => {
        let filtered = projects;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(project => project.category === activeFilter);
        }

        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchLower) ||
                project.description.toLowerCase().includes(searchLower) ||
                (project.tech && Array.isArray(project.tech) && project.tech.some(tech => tech.toLowerCase().includes(searchLower))) ||
                (project.tags && Array.isArray(project.tags) && project.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
        }

        setFilteredProjects(filtered);
    }, [projects, activeFilter, searchTerm]);

    const filters = [
        { key: 'all', label: 'All Work' },
        { key: 'fullstack', label: 'Fullstack' },
        { key: 'backend', label: 'Backend' },
        { key: 'frontend', label: 'Frontend' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-dark pt-24 pb-20">
            {/* Header */}
            <div className="portfolio-header opacity-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center transition-opacity duration-700">
                <h1 className="text-5xl md:text-6xl font-black text-text mb-6 tracking-tight">
                    Portfolio
                </h1>
                <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                    A curated collection of my most ambitious engineering challenges and digital solutions.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="portfolio-filters opacity-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 transition-opacity duration-700 delay-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search portfolio..."
                            defaultValue={searchTerm}
                            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-bg-light border border-border rounded text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {filters.map((filter) => (
                            <Button
                                key={filter.key}
                                variant={activeFilter === filter.key ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveFilter(filter.key)}
                                className={activeFilter === filter.key ? 'bg-primary text-bg-dark font-bold' : 'text-text-muted hover:text-text'}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="hidden md:flex bg-bg-light rounded p-1 border border-border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-bg-dark text-primary' : 'text-text-muted hover:text-text'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-bg-dark text-primary' : 'text-text-muted hover:text-text'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-center text-text-muted text-sm border-b border-border/30 pb-4">
                    Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                    {(searchTerm || activeFilter !== 'all') && ' (filtered)'}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="portfolio-grid opacity-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-700 delay-400">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-border/30 rounded-lg">
                        <div className="max-w-md mx-auto">
                            <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                            <p className="text-text text-lg mb-2">
                                No projects found
                            </p>
                            <p className="text-text-muted text-sm">
                                Try adjusting your search or filters to see more results.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className={`grid gap-8 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1'
                        }`}>
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                viewMode={viewMode}
                            // We might need to ensure ProjectCard links correctly to /portfolio/[slug]
                            // Assuming ProjectCard uses some logic, but wait, ProjectCard is imported.
                            // I should check ProjectCard source to ensure it doesn't hardcode /projects.
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
