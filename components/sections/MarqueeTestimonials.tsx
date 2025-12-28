import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
    rating: number;
    text: string;
    name: string;
    company: string;
    project?: string;
}

// Duplicate testimonials for seamless loop
const testimonials: Testimonial[] = [
    {
        rating: 5,
        text: "The attention to detail and understanding of our business needs was exceptional. Our new system has transformed how we operate.",
        name: "Sarah Mitchell",
        company: "TechStart Solutions",
        project: "Web Application"
    },
    {
        rating: 5,
        text: "From concept to launch, the process was smooth and professional. The final product exceeded our expectations.",
        name: "James Chen",
        company: "CloudSync Inc",
        project: "AI Integration"
    },
    {
        rating: 5,
        text: "Outstanding work on our e-commerce platform. Sales increased by 40% in the first month after launch.",
        name: "Maria Rodriguez",
        company: "Fashion Forward",
        project: "Website Development"
    },
    {
        rating: 5,
        text: "The AI solution automated hours of manual work. ROI was achieved within 3 months. Highly recommend!",
        name: "David Park",
        company: "DataFlow Systems",
        project: "AI Architecture"
    },
    {
        rating: 5,
        text: "Professional, responsive, and delivered ahead of schedule. The quality of work speaks for itself.",
        name: "Emma Thompson",
        company: "GrowthLabs",
        project: "Web Application"
    },
    {
        rating: 5,
        text: "Our customers love the new interface. User engagement is up 65% and support tickets are down significantly.",
        name: "Michael Okonkwo",
        company: "NaijaTech Hub",
        project: "Website Development"
    }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    return (
        <div className="bg-bg-light/30 border border-border/50 rounded-xl min-w-[420px] max-w-[420px] h-[220px] mx-4 flex-shrink-0 overflow-hidden relative group hover:border-primary/50 transition-colors duration-300">
            <div className="flex h-full p-6 gap-6">
                {/* Left Side - Profile/Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-bg-dark border border-primary/30 flex items-center justify-center text-primary font-bold text-2xl relative overflow-hidden">
                        {/* Simple initial avatar or generic user icon */}
                        <div className="absolute inset-0 bg-primary/10"></div>
                        {testimonial.name.charAt(0)}
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                                <p className="text-text-muted text-xs uppercase tracking-wider">{testimonial.company}</p>
                            </div>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-primary fill-current" />
                                ))}
                            </div>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed italic line-clamp-4">
                            "{testimonial.text}"
                        </p>
                    </div>

                    {testimonial.project && (
                        <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-bg-dark border border-border rounded text-[10px] text-text-muted uppercase tracking-wider">
                                {testimonial.project}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MarqueeTestimonials: React.FC = () => {
    // Create duplicated arrays for seamless infinite scroll
    const topRowTestimonials = [...testimonials, ...testimonials];
    const bottomRowTestimonials = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()];

    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <h3 className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
                    Testimonials
                </h3>
                <h3 className="text-3xl font-bold text-text">What Clients Say</h3>
            </div>

            <div className="relative">
                {/* Fade Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-dark to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-dark to-transparent z-10 pointer-events-none" />

                {/* Top Row - Moving Left (Slower) */}
                <div className="mb-8 overflow-hidden">
                    <div className="flex animate-marquee-left">
                        {topRowTestimonials.map((testimonial, index) => (
                            <TestimonialCard key={`top-${index}`} testimonial={testimonial} />
                        ))}
                    </div>
                </div>

                {/* Bottom Row - Moving Right (Faster) */}
                <div className="overflow-hidden">
                    <div className="flex animate-marquee-right">
                        {bottomRowTestimonials.map((testimonial, index) => (
                            <TestimonialCard key={`bottom-${index}`} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }

        /* Pause on hover */
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

export default MarqueeTestimonials;