"use client";

import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { heroService, type HeroData } from '../lib/adminService';

export const Hero: React.FC = () => {
    const { fadeInUp, staggerFadeIn } = useGSAP();
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const data = await heroService.get();
                setHeroData(data);
            } catch (error) {
                console.error('Failed to fetch hero data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    useEffect(() => {
        if (!loading && heroData) {
            const isMobile = window.innerWidth <= 768;
            const baseDelay = isMobile ? 0.1 : 0.2;

            fadeInUp('.hero-title', baseDelay);
            fadeInUp('.hero-description', baseDelay + 0.4);
            staggerFadeIn('.hero-scroll', baseDelay + 0.6);
        }
    }, [loading, heroData]);

    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center relative bg-bg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                </div>
            </section>
        );
    }

    // Marquee text lines
    const marqueeLines = [
        "WEB ENGINEERING • FRONTEND MASTERY • CLOUD SOLUTIONS • ",
        "INSPIRING INNOVATION • BUILDING PRODUCTS • ARCHITECTING SUCCESS • ",
        "SOFTWARE EXCELLENCE • TECHNICAL LEADERSHIP • DIGITAL TRANSFORMATION • "
    ];

    return (
        <section className="min-h-screen flex items-center relative overflow-hidden bg-bg-light">
            {/* Animated Background Marquee Text */}
            <div className="absolute inset-0 flex flex-col justify-center gap-4 sm:gap-8 overflow-hidden pointer-events-none select-none">
                {marqueeLines.map((line, index) => (
                    <div
                        key={index}
                        className="whitespace-nowrap opacity-100 "
                        style={{
                            animation: `marquee-${index % 2 === 0 ? 'left' : 'right'} ${40 + index * 5}s linear infinite`
                        }}
                    >
                        <span className="text-[25vh] sm:text-[12vw] font-black text-text/5 tracking-tighter leading-none inline-block">
                            {line.repeat(3)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-20 py-20 w-full">
                <div className="max-w-4xl">
                    {/* Main Heading */}
                    <h1 className="hero-title opacity-0 mb-8">
                        <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-text tracking-tight leading-[0.95]">
                            Build Smarter
                        </span>
                        <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95]">
                            Scale <span className="text-primary">Faster</span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="hero-description opacity-0 text-xl sm:text-2xl md:text-3xl text-text-muted mb-12 max-w-2xl leading-relaxed">
                        I partner with visionary leaders to transform their most ambitious dreams into sophisticated digital realities that inspire profound trust and lasting connection.
                    </p>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll absolute bottom-10 right-10 z-20">
                <div
                    className="w-16 h-16 rounded-full border-4 border-text/20 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
                    onClick={() => {
                        const element = document.querySelector('#about');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ArrowDown className="w-6 h-6 text-text/60 group-hover:text-primary transition-colors" />
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
        </section>
    );
};