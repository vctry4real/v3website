import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, Award, TrendingUp } from 'lucide-react';

interface CaseStudy {
  serviceType: string;
  title: string;
  industry: string;
  imgUrl: string;
  challenge: string;
  solution: string;
  keyFeatures: string[];
  impact: string[];
  tech: string[];
}

const caseStudies: CaseStudy[] = [
  {
    serviceType: "Web Application",
    title: "All-in-One Retail Management Platform",
    industry: "Retail",
    imgUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2670&auto=format&fit=crop",
    challenge: "Business needed to manage inventory, process sales, and run their online store, but existing solutions were either too expensive, too complex, or required bulky hardware.",
    solution: "Created a unified retail management system accessible from any device—whether mobile, tablet, or desktop—eliminating the need for expensive POS hardware while keeping everything in sync.",
    keyFeatures: [
      "Access inventory from anywhere, on any device",
      "Turn any tablet or phone into a point-of-sale system",
      "Unified platform for in-store and online operations",
      "Real-time sync across all sales channels"
    ],
    impact: [
      "No more expensive POS hardware needed",
      "Manage business from anywhere",
      "One system for everything—inventory, sales, and storefront"
    ],
    tech: ["React", "Node.js", "Cloud Infrastructure"],
  },
  {
    serviceType: "Website Development",
    title: "Brand-Aligned Website for Artisan Pastry Business",
    industry: "Food & Hospitality",
    imgUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2626&auto=format&fit=crop",
    challenge: "The brand's artisan quality and unique positioning weren't being captured online. Needed a website that not only looked beautiful but kept visitors engaged and reflected their premium brand image.",
    solution: "Designed and built a stunning, responsive website with carefully crafted user experience. Every page and section was designed to be exciting and engaging, perfectly capturing the brand's artisan identity.",
    keyFeatures: [
      "Beautiful, responsive design that works flawlessly on all devices",
      "Engaging animations and interactions that delight visitors",
      "Thoughtfully crafted user journey to increase time on site",
      "Design that authentically represents the brand's premium positioning"
    ],
    impact: [
      "Website truly reflects the brand's artisan quality",
      "Increased visitor engagement and time on site",
      "Mobile experience as stunning as desktop"
    ],
    tech: ["Modern Web Technologies", "Animation Libraries"],
  },
  {
    serviceType: "AI Architecture",
    title: "Intelligent Customer Support Agent Platform",
    industry: "Customer Service / Multi-Industry",
    imgUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop",
    challenge: "Businesses needed better customer support without hiring more staff. Generic chatbots gave robotic answers that frustrated customers rather than helping them.",
    solution: "Built an AI agent platform that can be integrated into any business. Unlike generic chatbots, it truly understands customer pain points and complaints, using deep knowledge of the company to guide customers to real solutions.",
    keyFeatures: [
      "Integrates seamlessly into any business",
      "Understands customer pain points, not just keywords",
      "Uses complete company knowledge to provide relevant guidance",
      "Resolves issues rather than just answering questions"
    ],
    impact: [
      "Customers get helpful, contextual support 24/7",
      "Reduces support ticket volume significantly",
      "Provides intelligent solutions, not generic responses"
    ],
    tech: ["AI/Machine Learning", "Natural Language Processing"],
  }
];

const IMG_PADDING = 12;

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: React.ReactNode;
}

interface StickyImageProps {
  imgUrl: string;
}

interface OverlayCopyProps {
  subheading: string;
  heading: string;
}

interface CaseStudyContentProps {
  study: CaseStudy;
}

const CaseStudiesSection: React.FC = () => {
  return (
    <section className="bg-bg-dark">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-text mb-6">Success Stories</h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Real projects, real results. See how we've helped businesses achieve their goals
          </p>
        </div>
      </div>

      {/* Parallax Case Studies */}
      {caseStudies.map((study, index) => (
        <TextParallaxContent
          key={index}
          imgUrl={study.imgUrl}
          subheading={study.serviceType}
          heading={study.title}
        >
          <CaseStudyContent study={study} />
        </TextParallaxContent>
      ))}
    </section>
  );
};

const TextParallaxContent: React.FC<TextParallaxContentProps> = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[120vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage: React.FC<StickyImageProps> = ({ imgUrl }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy: React.FC<OverlayCopyProps> = ({ subheading, heading }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl px-4">{heading}</p>
    </motion.div>
  );
};

const CaseStudyContent: React.FC<CaseStudyContentProps> = ({ study }) => (
  <div className="mx-auto max-w-6xl px-4 pb-24 pt-12">
    <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
      {/* Left Column - Challenge & Solution */}
      <div className="col-span-1 md:col-span-5 space-y-8">
        {/* Service Badge */}
        {/* <div>
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary text-sm font-semibold rounded-full border border-primary/30">
            {study.industry}
          </span>
        </div> */}

        {/* Challenge */}
        <div>
          <div className="flex items-center mb-3">
            <h3 className="text-xl font-bold text-text uppercase tracking-wide">The Challenge</h3>
          </div>
          <p className="text-lg text-text-muted leading-relaxed">{study.challenge}</p>
        </div>

        {/* Solution */}
        <div>
          <div className="flex items-center mb-3">
            <h3 className="text-xl font-bold text-text uppercase tracking-wide">Our Solution</h3>
          </div>
          <p className="text-lg text-text-muted leading-relaxed">{study.solution}</p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {study.tech.map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-bg text-text-muted text-sm rounded-full border border-border">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Right Column - Features & Impact */}
      <div className="col-span-1 md:col-span-7 space-y-8">
        {/* Key Features */}
        <div className="bg-bg/50 rounded-2xl p-6 border border-border">
          <h3 className="text-xl font-bold text-text mb-4">Key Features</h3>
          <div className="space-y-3">
            {study.keyFeatures.map((feature, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-1" />
                <span className="text-text-muted">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact */}
        <div className="bg- rounded-2xl p-6 border border-primary/30">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-xl font-bold text-text">Impact & Results</h3>
          </div>
          <div className="space-y-3">
            {study.impact.map((result, i) => (
              <div key={i} className="flex items-start">
                <TrendingUp className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-1" />
                <span className="text-text font-medium">{result}</span>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  </div>
);

export default CaseStudiesSection;