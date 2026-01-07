"use client";

import React, { useState, useEffect } from 'react';
import {
    ArrowRight,
    CheckCircle,
    Calendar,
    Code,
    Palette,
    Brain,
    Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AppointmentBooking } from '@/components/sections/AppointmentBooking';
import { useGSAP } from '@/components/hooks/useGSAP';
import CaseStudiesSection from '@/components/sections/CaseStudies';
import MarqueeTestimonials from '@/components/sections/MarqueeTestimonials';
import TechStack from '@/components/sections/TechStack';
import FAQ from '@/components/sections/FAQ';

export const ServicesTemplate = () => {
    const { fadeInUp, staggerFadeIn } = useGSAP();
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        fadeInUp('.animate-hero');
        staggerFadeIn('.animate-service');
        staggerFadeIn('.animate-process');
    }, [fadeInUp, staggerFadeIn]);

    const services = [
        {
            icon: Code,
            title: 'Custom Web Applications',
            description: 'Scalable, high-performance web apps built with React, Node.js, and modern cloud architecture.',
            features: ['Full-Stack Development', 'Cloud Infrastructure', 'API Integrations', 'Real-time Features'],
            cta: 'Start Building'
        },
        {
            icon: Palette,
            title: 'Premium Website Development',
            description: 'Stunning, conversion-focused websites that elevate your brand and engage your audience.',
            features: ['Responsive Design', 'SEO Optimization', 'Performance Tuning', 'CMS Integration'],
            cta: 'Get a Quote'
        },
        {
            icon: Brain,
            title: 'AI & Automation Solutions',
            description: 'Intelligent systems that streamline operations and provide competitive advantages.',
            features: ['Custom AI Models', 'Process Automation', 'Data Analysis', 'Smart Chatbots'],
            cta: 'Explore AI'
        },
        {
            icon: Terminal,
            title: 'Technical Consultation',
            description: 'Providing expert advice on technology stacks, code quality, and best practices. I help you make informed decisions to optimize your development process.',
            features: ['Tech Stack Selection', 'Code Audits', 'Best Practices', 'Performance Optimization'],
            cta: 'Book Consultation'
        }
    ];

    const processSteps = [
        {
            number: "01",
            title: "Discovery",
            description: "We dive deep into your business goals, requirements, and challenges."
        },
        {
            number: "02",
            title: "Strategy",
            description: "Creating a comprehensive roadmap and technical architecture for success."
        },
        {
            number: "03",
            title: "Development",
            description: "Agile build process with regular updates and continuous feedback loops."
        },
        {
            number: "04",
            title: "Launch",
            description: "Seamless deployment, rigorous testing, and post-launch support."
        }
    ];

    return (
        <div className="bg-bg-dark min-h-screen relative overflow-hidden pt-24">
            {/* Background Texture */}


            {/* Hero Section */}
            <section className="relative z-10 pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <div className="animate-hero opacity-0">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/10 text-primary font-medium text-sm tracking-wide">
                        Expert Development Services
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-text mb-6 leading-tight">
                        Transforming Ideas into <br /><span className="text-primary">Digital Reality</span>
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        From complex web applications to stunning marketing sites, I deliver premium code and design that drives real business growth.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" onClick={() => setShowBookingModal(true)} className="min-w-[200px] py-4 text-lg">
                            <Calendar className="w-5 h-5 mr-2" />
                            Book Consultation
                        </Button>
                        <Button variant="outline" className="min-w-[200px] py-4 text-lg bg-transparent border-border/50 hover:bg-bg-light text-text hover:text-white">
                            View Work
                        </Button>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-text mb-4">Core Services</h2>
                        <p className="text-text-muted max-w-2xl mx-auto">Focused expertise to deliver exceptional quality across the stack.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div key={index} className="animate-service opacity-0 bg-bg-light border border-border/30 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 group">

                                    <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                                    <p className="text-text-muted mb-6 leading-relaxed">{service.description}</p>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-text-muted text-sm font-medium">
                                                <CheckCircle className="w-4 h-4 text-primary mr-3" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-6 border-t border-border/30">
                                        <button onClick={() => setShowBookingModal(true)} className="flex items-center text-text font-bold text-sm uppercase tracking-wider group-hover:text-primary transition-colors">
                                            {service.cta} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-bg-dark border-y border-border/20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Methodology</span>
                            <h2 className="text-4xl font-black text-text">How We Work</h2>
                        </div>
                        <p className="text-text-muted max-w-md text-lg text-center md:text-right">A transparent, collaborative process designed to deliver results on time and within budget.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {processSteps.map((step, index) => (
                            <div key={index} className="animate-process opacity-0 bg-bg-light/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 hover:bg-bg-light transition-colors duration-300">
                                <div className="text-5xl font-black text-primary mb-4 font-mono">{step.number}</div>
                                <h3 className="text-xl font-bold text-text mb-3">{step.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Injected Components */}
            <div className="relative z-10 py-10 space-y-0">
                <TechStack />
                <div className="py-20">
                    <CaseStudiesSection />
                </div>
                <MarqueeTestimonials />
                <FAQ />
            </div>

            {/* CTA */}
            <section className="py-24 relative z-10">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-primary/20 to-bg-light/50 rounded-3xl p-12 lg:p-16 border border-primary/20 relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

                        <h2 className="text-4xl md:text-5xl font-black text-text mb-6 relative z-10">Ready to Start Your Project?</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10 relative z-10">
                            Schedule a free strategy session to discuss your goals and how we can help you achieve them.
                        </p>
                        <Button size="lg" onClick={() => setShowBookingModal(true)} className="text-lg px-8 py-6 relative z-10 shadow-xl shadow-primary/20">
                            Schedule Free Call <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            <AppointmentBooking
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />
        </div>
    );
};
