"use client";

import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
    // We can use the hook or custom GSAP logic
    // Using custom logic for specific "scroll in animations on elements" requirement to be precise
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    end: 'bottom 80%',
                }
            });

            // Image Animation (from right)
            tl.from('.about-image', {
                x: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, 0);

            // Content Animation (from left)
            tl.from('.about-content > *', {
                x: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            }, 0.2);

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="py-24 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-16">

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 about-content">
                        <h3 className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
                            About Me
                        </h3>
                        <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
                            Allwell Onen | <span className="text-text-muted font-serif italic">The Web Architect</span>
                        </h2>
                        <p className="text-lg text-text-muted leading-relaxed mb-6">
                            I don't just build websites; I architect digital experiences. With a meticulous eye for detail and a passion for clean, efficient code, I transform complex requirements into elegant, user-centric solutions.
                        </p>
                        <p className="text-lg text-text-muted leading-relaxed mb-8">
                            My journey is defined by a relentless pursuit of engineering excellence. Whether it's optimizing backend performance or crafting immersive frontend interactions, I bring a methodical approach to every project.
                        </p>

                        {/* Social Handles */}
                        <div className="flex gap-4">
                            <a href="#" className="p-3 rounded-full border border-border bg-bg-light/50 text-text hover:text-primary hover:border-primary transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 rounded-full border border-border bg-bg-light/50 text-text hover:text-primary hover:border-primary transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 rounded-full border border-border bg-bg-light/50 text-text hover:text-primary hover:border-primary transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 rounded-full border border-border bg-bg-light/50 text-text hover:text-primary hover:border-primary transition-all duration-300">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 about-image relative">
                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-sm overflow-hidden bg-bg-light">
                            {/* Image Placeholder - Replace with actual image */}
                            <div className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
                                style={{ backgroundImage: 'url(/assets/Portfolio_image.png)' }}
                            ></div>

                            {/* Overlay/Border Effect */}
                            <div className="absolute inset-0 border-2 border-primary/20 m-4 rounded-sm"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
