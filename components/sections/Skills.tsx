import React, { useEffect, useState } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import { skillsService, type SkillData } from '../lib/adminService';

export const Skills: React.FC = () => {
  const { scrollReveal, scrollRevealMobile } = useGSAP();
  const [activeCategory, setActiveCategory] = useState('all');
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mobile-friendly scroll triggers
    const isMobile = window.innerWidth <= 768;
    const scrollFunction = isMobile ? scrollRevealMobile : scrollReveal;

    // Target the inner content for scroll animations
    scrollFunction('.skills-header');
    scrollFunction('.skills-filters');
    scrollFunction('.skills-grid');
  }, []);

  // Add stagger animation for skill items when category changes
  useEffect(() => {
    if (!loading && skills.length > 0) {
      const skillItems = document.querySelectorAll('.skill-card');
      skillItems.forEach((item, index) => {
        (item as HTMLElement).style.opacity = '0';
        (item as HTMLElement).style.transform = 'translateY(20px)';

        setTimeout(() => {
          (item as HTMLElement).style.transition = 'all 0.6s ease-out';
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  }, [activeCategory, loading, skills.length]);

  const loadSkills = async () => {
    try {
      const data = await skillsService.getAll();
      console.log('Loaded skills:', data);
      setSkills(data);
    } catch (error) {
      console.error('Skills component: Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // Refresh skills when the component becomes visible (e.g., when navigating back to the page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadSkills();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Default skills to show if none are loaded from database
  const defaultSkills = [
    { id: 1, name: 'React', level: 90, category: 'frontend' },
    { id: 2, name: 'TypeScript', level: 85, category: 'frontend' },
    { id: 3, name: 'Node.js', level: 88, category: 'backend' },
    { id: 4, name: 'PostgreSQL', level: 82, category: 'database' },
    { id: 5, name: 'Docker', level: 75, category: 'tools' },
    { id: 6, name: 'AWS', level: 80, category: 'tools' },
  ];

  const skillCategories = {
    all: 'All Skills',
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    tools: 'Tools & DevOps',
    design: 'Design',
    other: 'Other',
  };

  // Use database data if available, otherwise fall back to defaults
  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  const filteredSkills = activeCategory === 'all'
    ? displaySkills
    : displaySkills.filter(skill => skill.category === activeCategory);

  return (
    <section className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <div className="skills-header text-center mb-12 sm:mb-16 opacity-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Skills & Technologies
            </h2>
            <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto px-4 sm:px-0">
              A comprehensive toolkit built through years of hands-on experience and continuous learning
            </p>
          </div>

          {/* Filters */}
          <div className="skills-filters flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 opacity-0 px-4 sm:px-0">
            {Object.entries(skillCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${activeCategory === key
                  ? 'bg-primary text-white'
                  : 'bg-bg text-text-muted hover:bg-bg-light hover:text-text'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="skills-grid opacity-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="text-center py-12 text-text-muted">
                <p>No skills available for this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredSkills.map((skill, index) => (
                  <div
                    key={skill.id || skill.name}
                    className="skill-card bg-bg rounded-lg p-4 sm:p-6 hover:bg-bg-light transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-text font-medium text-sm sm:text-base">{skill.name}</h3>
                      <span className="text-primary text-xs sm:text-sm font-medium">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-bg-light rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};