"use client";

import React, { useEffect } from 'react';
import { ArrowRight, Globe, Smartphone, Database, Code } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';

export const Services: React.FC = () => {
  const { scrollReveal } = useGSAP();

  useEffect(() => {
    // Simple scroll reveal for the header
    scrollReveal('.services-header');
    scrollReveal('.service-card', 0.1 as any);
  }, [scrollReveal]);

  const services = [
    {
      icon: Globe,
      title: 'Website Design & Development',
      description: 'Crafting visually stunning and high-performance websites that leave a lasting impression. I focus on user experience and brand identity to help you stand out.',
      link: '/services'
    },
    {
      icon: Smartphone,
      title: 'Web App Development',
      description: 'Building web applications that provide seamless user experiences. From concept to launch, I handle the full development lifecycle.',
      link: '/services'
    },
    {
      icon: Database,
      title: 'Custom AI Architecture Development',
      description: 'Tailored AI architectures that solve your business challenges with precision and efficiency',
      link: '/services'
    },
    {
      icon: Code,
      title: 'Technical Consultation',
      description: 'Providing expert advice on technology stacks, code quality, and best practices. I help you make informed decisions to optimize your development process.',
      link: '/services'
    }
  ];

  return (
    <section id="services" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="services-header text-center mb-16">
          <h3 className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
            Services
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Expertise & Solutions
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Comprehensive designs and development solutions tailored to your unique business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group bg-bg-light/30 border border-border/50 p-8 hover:border-primary/50 transition-all duration-300 flex flex-col items-start justify-between min-h-[300px]"
            >
              <div>
                <div className="mb-6 p-3 bg-bg-dark rounded-lg inline-block group-hover:bg-primary/10 transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <a
                href={service.link}
                className="inline-flex items-center text-primary font-medium text-sm hover:translate-x-1 transition-transform duration-300"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};