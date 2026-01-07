"use client";

import React, { useEffect, useState } from "react";
import { Code, Zap, Users, Award, ArrowRight, Target, Rocket, Shield, Linkedin, Github, Mail, Twitter, Download } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "../../components/hooks/useGSAP";
import {
    aboutService,
    profileImageService,
    type AboutData,
} from "../../components/lib/adminService";

import { Button } from "../../components/ui/Button";

export default function AboutPage() {
    const { scrollReveal, scrollRevealMobile, fadeInUp, staggerFadeIn } = useGSAP();
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aboutDataResult] = await Promise.all([
                    aboutService.get(),
                    profileImageService.get(),
                ]);
                setAboutData(aboutDataResult);
            } catch (error) {
                console.error("Failed to fetch about data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            fadeInUp('.animate-hero');
            staggerFadeIn('.animate-stat');
            staggerFadeIn('.animate-value');
            scrollReveal('.animate-story');
        }
    }, [loading, fadeInUp, staggerFadeIn, scrollReveal]);

    const stats = [
        {
            icon: Code,
            label: "Years Experience",
            value: aboutData?.experience || "4+",
        },
        {
            icon: Zap,
            label: "Projects Completed",
            value: aboutData?.projects || "50+",
        },
        { icon: Users, label: "Happy Clients", value: aboutData?.clients || "25+" },
        {
            icon: Award,
            label: "Technologies",
            value: aboutData?.technologies || "20+",
        },
    ];

    const values = [
        {
            icon: Target,
            title: "Partnership First",
            description: "I'm not just a contractor—I'm invested in your success. Your wins are my wins, and I treat your project with the same care I would my own."
        },
        {
            icon: Rocket,
            title: "Radical Clarity",
            description: "No tech jargon, no confusing explanations. I ensure you always understand exactly what we're building, why we're building it, and how it works."
        },
        {
            icon: Shield,
            title: "Unwavering Dependability",
            description: "When I commit to a deadline, I deliver. Communication is proactive, transparent, and consistent. No surprises, ever."
        }
    ];

    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-bg-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </section>
        );
    }

    return (
        <div className="bg-bg-dark min-h-screen pt-24">

            {/* Background Texture */}
            {/* Background Texture - Clean */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Removed Gradient Blobs */}
            </div>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20 flex flex-col lg:flex-row items-center gap-16">
                {/* Content Side */}
                <div className="w-full lg:w-1/2 animate-hero opacity-0">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-primary text-sm font-bold tracking-wide uppercase">The Digital Craftsman</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-text mb-6 leading-[1.1]">
                        Architecting <br />
                        <span className="text-text">Digital Excellence</span>
                    </h1>
                    <p className="text-xl text-text-muted mb-8 leading-relaxed max-w-lg">
                        My journey is defined by a relentless pursuit of engineering excellence. Whether it's optimizing backend performance or crafting immersive frontend interactions, I bring a methodical approach to every project.
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-4 mb-10">
                        {[
                            { icon: Github, href: "https://github.com/vctry4real" },
                            { icon: Linkedin, href: "https://linkedin.com/in/victory-johnson" },
                            { icon: Twitter, href: "https://twitter.com/vctry4real" },
                            { icon: Mail, href: "mailto:hello@vctry4real.com" }
                        ].map((social, i) => (
                            <a key={i} href={social.href} target="_blank" rel="noreferrer" className="p-3 bg-bg-light border border-border/30 rounded-xl text-text-muted hover:text-primary hover:border-primary/50 hover:bg-bg-dark transition-all duration-300 transform hover:-translate-y-1">
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/appointments" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg shadow-xl shadow-primary/20">
                                Work With Me <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <a href="/Software Engineer - Victory Johnson.pdf" download="Victory_Johnson_Resume.pdf" className="inline-block w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg border-border/50 hover:border-primary/50 hover:bg-bg-light">
                                <Download className="w-5 h-5 mr-2" />
                                Resume
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative animate-hero opacity-0 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-border/30 shadow-2xl bg-bg-light/10">
                        {/* Use static image for stability, or could use profileImageService if guaranteed */}
                        <img
                            src="/assets/Portfolio_image.png"
                            alt="Victory Johnson"
                            className="w-full h-full object-cover object-center grayscale transition-all duration-700"
                        />
                        {/* Decoration Border */}
                        <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none"></div>
                    </div>
                </div>
            </section>



            {/* Philosophy Section */}
            <section className="relative z-10 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-story opacity-0">
                        <h2 className="text-3xl md:text-4xl font-black text-text mb-6">Driven by Quality & Trust</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">
                            I believe good software should feel effortless to use, work reliably, and actually help you achieve what you set out to do.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="animate-value opacity-0 bg-bg-light border border-border/30 p-8 rounded-2xl hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1">
                                <div className="w-14 h-14 bg-bg-dark rounded-xl flex items-center justify-center mb-6 border border-border/30 group-hover:border-primary/30 transition-colors">
                                    <value.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-text mb-4 group-hover:text-primary transition-colors">{value.title}</h3>
                                <p className="text-text-muted leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* My Story Text - Optional deeply personal section */}
            <section className="relative z-10 py-20 bg-bg-light/20 flex justify-center">
                <div className="max-w-3xl mx-auto px-4 text-center animate-story opacity-0">
                    <h3 className="text-primary font-bold tracking-widest uppercase mb-4">My Story</h3>
                    <h2 className="text-3xl font-bold text-text mb-8">Why I Build</h2>
                    <div className="space-y-6 text-lg text-text-muted leading-relaxed">
                        <p>
                            {aboutData?.summary || "I started coding because I was fascinated by how technology could solve real problems. That hasn't changed—except now I've learned that the best solutions come from really listening to what people need, not just building what's technically impressive."}
                        </p>
                        <p>
                            Here's what I've learned after years of building apps, websites, and systems: the tech stack doesn't matter nearly as much as understanding the problem you're trying to solve. That's why I spend time getting to know your business, your users, and your goals before writing a single line of code.
                        </p>
                    </div>
                </div>
            </section>



            {/* Final CTA */}
            <section className="py-24 relative z-10">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-bg-light to-bg-dark rounded-3xl p-12 lg:p-16 border border-border/50 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-text mb-6">Ready to Collaborate?</h2>
                            <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
                                Let's allow your ideas to take flight. Schedule a call and let's discuss how we can build something great together.
                            </p>
                            <Link href="/appointments">
                                <Button size="lg" className="text-lg px-10 py-6 shadow-2xl shadow-primary/10">
                                    Start Conversation <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
