'use client';

import React from 'react';
import { useGSAP } from '../hooks/useGSAP';
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiNodedotjs,
    SiPostgresql,
    SiTailwindcss,
    SiOpenai,
    SiSupabase,
    SiGraphql,
    SiDocker,
    SiAmazon,
    SiFramer
} from 'react-icons/si';

const techs = [
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'OpenAI', icon: SiOpenai, color: '#412991' },
    { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED' },
    { name: 'AWS', icon: SiAmazon, color: '#FF9900' },
    { name: 'Framer Motion', icon: SiFramer, color: '#0055FF' }
];

export default function TechStack() {
    const { fadeIn } = useGSAP();

    // Duplicate list for seamless marquee
    const marqueeTechs = [...techs, ...techs];

    return (
        <section className="py-20 bg-bg-dark border-y border-border/20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Powered By</p>
                <h2 className="text-3xl font-black text-text">World-Class Technologies</h2>
            </div>

            <div className="relative w-full">
                <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap" style={{ animationDuration: '10s' }}>
                    {marqueeTechs.map((tech, index) => {
                        const Icon = tech.icon;
                        return (
                            <div key={index} className="mx-8 group flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                <Icon className="w-12 h-12 mb-3 text-text-muted group-hover:text-primary transition-colors" />
                                <span className="text-sm font-medium text-text-muted">{tech.name}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-dark to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-dark to-transparent z-10 pointer-events-none"></div>
            </div>
        </section>
    );
}
