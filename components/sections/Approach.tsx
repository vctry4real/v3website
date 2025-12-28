"use client";

import React, { useEffect, useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Approach: React.FC = () => {
    const { scrollReveal } = useGSAP();
    const lineRef = useRef<HTMLDivElement>(null);

    const steps = [
        {
            id: '01',
            title: "Discovery & Strategy",
            description: "We dive deep into your goals, target audience, and market to create a strategic roadmap for success. Understanding the 'why' before the 'how'.",
        },
        {
            id: '02',
            title: "Design & Prototyping",
            description: "Visualizing the concept with high-fidelity mockups and interactive prototypes. We iterate until the vision is crystal clear and aligned with your brand.",
        },
        {
            id: '03',
            title: "Development",
            description: "Writing clean, scalable code to bring the designs to life. We focus on performance, accessibility, and ensuring a seamless experience across all devices.",
        },
        {
            id: '04',
            title: "Launch & Growth",
            description: "Deploying your site with full SEO optimization and providing ongoing support. We don't just launch; we set you up for long-term growth.",
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.from('.approach-header', {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: '.approach-header',
                    start: 'top 80%',
                }
            });

            // Timeline line animation
            if (lineRef.current) {
                gsap.fromTo(lineRef.current,
                    { height: '0%' },
                    {
                        height: '100%',
                        duration: 1.5,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '#approach-timeline',
                            start: 'top 60%',
                            end: 'bottom 80%',
                            scrub: 0.5,
                        }
                    }
                );
            }

            // Steps animation
            gsap.utils.toArray('.approach-step').forEach((step: any, i) => {
                gsap.from(step, {
                    x: i % 2 === 0 ? -50 : 50,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 75%',
                    }
                });
            });

        });

        return () => ctx.revert();
    }, []);


    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="approach-header text-center mb-20">
                    <h3 className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
                        My Method
                    </h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
                        Methodical Execution, <br /> Exceptional Outcomes.
                    </h2>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        A proven process designed to deliver results, efficiency, and excellence at every stage.
                    </p>
                </div>

                {/* Vertical Timeline */}
                <div id="approach-timeline" className="relative max-w-4xl mx-auto">
                    {/* Central Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-border h-full -translate-x-1/2 md:translate-x-0">
                        <div ref={lineRef} className="w-full bg-primary shadow-[0_0_10px_rgba(0,255,157,0.5)]"></div>
                    </div>

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <div key={step.id} className={`approach-step relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Dot/Number */}
                                <div className="absolute left-[20px] md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                                    <div className="w-10 h-10 rounded-full bg-bg-dark border border-primary text-primary font-mono text-sm font-bold flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                                        {step.id}
                                    </div>
                                </div>

                                {/* Content Spacer for Desktop (Empty side) */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Content Box */}
                                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}>
                                        <h3 className="text-2xl font-bold text-text mb-3">{step.title}</h3>
                                        <p className="text-text-muted leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Approach;
