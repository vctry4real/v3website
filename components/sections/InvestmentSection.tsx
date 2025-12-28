import React, { useState } from 'react';
import { Code, Palette, Brain, Star, ArrowRight, Clock } from 'lucide-react';
import { FaCheckDouble } from "react-icons/fa";
import { AppointmentBooking } from './AppointmentBooking';
import MarqueeTestimonials from './MarqueeTestimonials';


interface Service {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  includes: string[];
  typical: string;
  color: string;
}


const services: Service[] = [
  {
    id: 'website',
    icon: Palette,
    title: "Website Development",
    description: "Professional websites that convert visitors into customers",
    includes: [
      "Custom design & branding",
      "Mobile-responsive",
      "SEO optimization",
      "Analytics setup"
    ],
    typical: "4-6 weeks",
    color: "from-primary/20 to-secondary/20"
  },
  {
    id: 'webapp',
    icon: Code,
    title: "Web Application",
    description: "Custom applications built for your specific needs",
    includes: [
      "Full-stack development",
      "Database architecture",
      "API integrations",
      "Cloud deployment"
    ],
    typical: "8-16 weeks",
    color: "from-primary/20 to-secondary/20"
  },
  {
    id: 'ai',
    icon: Brain,
    title: "AI Solutions",
    description: "Intelligent systems that automate and optimize",
    includes: [
      "AI strategy & consulting",
      "Custom model development",
      "System integration",
      "Ongoing optimization"
    ],
    typical: "6-12 weeks",
    color: "from-primary/20 to-secondary/20"
  }
];




export default function InvestmentSection() {
  const [selectedService, setSelectedService] = useState<string>('webapp');
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const currentService = services.find(s => s.id === selectedService) || services[1];
  //   const IconComponent = currentService.icon;

  return (
    <section className="py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text mb-6">Investment in Your Success</h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-4">
            Every project is unique. Let's discuss your specific needs and create a custom solution that fits your goals and budget.
          </p>
          <p className="text-lg text-primary font-medium">
            Schedule a free consultation to get your custom quote
          </p>
        </div>

        {/* Interactive Service Explorer */}
        <div className="mb-20">
          {/* Service Tabs */}
          <div className="flex justify-center mb-8 gap-4">
            {services.map((service) => {
              const ServiceIcon = service.icon;
              const isSelected = selectedService === service.id;


              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                  className={`
                    flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300
                    ${isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/50 scale-105'
                      : 'bg-bg-dark text-text-muted hover:bg-bg-light border border-border'
                    }
                  `}
                >
                  <ServiceIcon className={`w-5 h-5 ${isSelected ? 'animate-pulse' : ''}`} />
                  <span className="hidden md:inline">{service.title}</span>
                </button>
              );
            })}
          </div>

          {/* Service Details Panel */}
          <div className={`bg-bg-light/50 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-primary/20 transition-all duration-500 shadow-2xl`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Icon & Description */}
              <div>

                <h3 className="text-3xl font-bold text-text mb-4">{currentService.title}</h3>
                <p className="text-xl text-text-muted mb-8 text-left">{currentService.description}</p>

                {/* Timeline Badge */}
                <div className="inline-flex items-center gap-2 bg-bg-dark/50 px-4 py-2 rounded-full border border-border/50">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-text-muted text-sm font-medium">
                    Typical timeline: {currentService.typical}
                  </span>
                </div>
              </div>

              {/* Right Side - What's Included */}
              <div className="bg-bg-dark rounded-xl p-6 border border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <h4 className="text-lg font-bold text-text">What's Included</h4>
                </div>
                <div className="space-y-4">
                  {currentService.includes.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 transform transition-all duration-300 hover:translate-x-2"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >

                      <FaCheckDouble className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-muted">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group shadow-lg"
                >
                  Get Custom Quote for {currentService.title}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Custom Quotes - Interactive Cards */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-text mb-12 text-center">
            Why We Provide Custom Quotes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Your Project is Unique",
                description: "Every business has different needs, goals, and constraints. We tailor solutions specifically for you."
              },
              {
                number: "02",
                title: "Transparent Process",
                description: "We'll walk you through exactly what you're getting, why it costs what it does, and the value it delivers."
              },
              {
                number: "03",
                title: "No Surprises",
                description: "Fixed-price quotes with clear deliverables and timelines. You'll know exactly what to expect."
              }
            ].map((reason, index) => (
              <div
                key={index}
                className="group bg-bg-dark rounded-xl p-6 border border-border hover:border-primary transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="text-5xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform">
                  {reason.number}
                </div>
                <h4 className="text-xl font-semibold text-text mb-3">{reason.title}</h4>
                <p className="text-text-muted">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Appointment Booking Modal */}
      {showBookingModal && (
        <AppointmentBooking
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </section>
  );
}