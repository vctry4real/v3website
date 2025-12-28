import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { experienceService, type ExperienceData } from '../lib/adminService';

export const Experience: React.FC = () => {
  const { scrollReveal, scrollRevealMobile } = useGSAP();
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await experienceService.getAll();
        setExperiences(data);
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Use mobile-friendly scroll triggers
      const isMobile = window.innerWidth <= 768;
      const scrollFunction = isMobile ? scrollRevealMobile : scrollReveal;

      // Target the inner content for scroll animations
      scrollFunction('.experience-header');
      scrollFunction('.experience-timeline');
    }
  }, [loading]);

  const defaultExperiences = [
    {
      id: 1,
      company: 'TechCorp Solutions',
      position: 'Senior Full-Stack Developer',
      duration: '2022 - Present',
      location: 'San Francisco, CA',
      description: 'Leading development of scalable web applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers.',
      responsibilities: [
        'Architected and developed microservices using Node.js and Python',
        'Led a team of 5 developers in agile development practices',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Optimized database queries improving application performance by 40%',
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript'],
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 2,
      company: 'StartupXYZ',
      position: 'Full-Stack Developer',
      duration: '2021 - 2022',
      location: 'Remote',
      description: 'Built the core platform from scratch, handling both frontend and backend development. Worked directly with founders to define product requirements.',
      responsibilities: [
        'Developed MVP from concept to launch in 6 months',
        'Built responsive web application using React and Next.js',
        'Designed and implemented RESTful APIs with Express.js',
        'Integrated third-party services including Stripe and SendGrid',
      ],
      technologies: ['Next.js', 'Express.js', 'MongoDB', 'Stripe', 'Vercel'],
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 3,
      company: 'Digital Agency Pro',
      position: 'Frontend Developer',
      duration: '2020 - 2021',
      location: 'New York, NY',
      description: 'Specialized in creating high-performance, responsive websites for enterprise clients. Collaborated with design teams to implement pixel-perfect interfaces.',
      responsibilities: [
        'Developed 20+ responsive websites using modern frameworks',
        'Collaborated with UX/UI designers to implement design systems',
        'Optimized websites for performance achieving 95+ Lighthouse scores',
        'Maintained and updated legacy codebases',
      ],
      technologies: ['React', 'Vue.js', 'Sass', 'Webpack', 'Figma'],
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading experience section...</p>
          </div>
        </div>
      </section>
    );
  }

  // Use database data if available, otherwise fall back to defaults
  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <section id="experience" className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="experience-header text-center mb-12 sm:mb-16 opacity-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Work Experience
            </h2>
            <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto px-4 sm:px-0">
              My professional journey building impactful solutions across different industries and company sizes
            </p>
          </div>

          {/* Timeline */}
          <div className="experience-timeline opacity-0">
            <div className="relative">
              {/* Timeline Line - Hidden on mobile, visible on desktop */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary"></div>

              {displayExperiences.map((exp, index) => (
                <div key={exp.id} className="relative mb-12 sm:mb-16 last:mb-0">
                  {/* Timeline Dot - Hidden on mobile, visible on desktop */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-bg-dark z-10"></div>

                  {/* Content - Full width on mobile, half width on desktop */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 lg:pr-12' : 'md:ml-auto md:pl-8 lg:pl-12'}`}>
                    <div className="bg-bg rounded-xl p-4 sm:p-6 hover:bg-bg-light transition-colors duration-200">
                      {/* Company Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-text truncate">{exp.position}</h3>
                            <p className="text-primary font-medium text-sm sm:text-base truncate">{exp.company}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted hover:text-text cursor-pointer transition-colors duration-200 flex-shrink-0 ml-2" />
                      </div>

                      {/* Duration and Location */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mb-4 text-xs sm:text-sm text-text-muted">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {exp.duration}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {exp.location}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-text-muted mb-4 leading-relaxed text-sm sm:text-base">
                        {exp.description}
                      </p>

                      {/* Responsibilities */}
                      <div className="mb-4">
                        <h4 className="text-text font-medium mb-2 text-sm sm:text-base">Key Responsibilities:</h4>
                        <ul className="space-y-1">
                          {exp.responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="text-text-muted text-xs sm:text-sm flex items-start">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-text font-medium mb-2 text-sm sm:text-base">Technologies Used:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 sm:px-3 py-1 bg-bg-light text-text-muted rounded-full text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};