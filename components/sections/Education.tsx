
import React, { useEffect, useState } from 'react';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import { educationService, type EducationData } from '../lib/adminService';

export const Education: React.FC = () => {
  const { scrollReveal, scrollRevealMobile } = useGSAP();
  const [education, setEducation] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await educationService.getAll();
        setEducation(data);
      } catch (error) {
        console.error('Failed to fetch education:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Use mobile-friendly scroll triggers
      const isMobile = window.innerWidth <= 768;
      const scrollFunction = isMobile ? scrollRevealMobile : scrollReveal;

      scrollFunction('.education-header');
      scrollFunction('.education-grid');
    }
  }, [loading]);

  const defaultEducation = [
    {
      id: 1,
      degree: 'Bachelor of Science in Computer Science',
      university: 'University of California, Berkeley',
      duration: '2018 - 2022',
      location: 'Berkeley, CA',
      gpa: '3.8/4.0',
      description: 'Focused on software engineering, algorithms, and data structures. Completed capstone project on machine learning applications.',
      achievements: [
        'Dean\'s List (2018-2022)',
        'Computer Science Honor Society',
        'Research Assistant in AI Lab',
        'Graduated with Distinction'
      ],
      logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 2,
      degree: 'Full-Stack Web Development',
      university: 'Coding Bootcamp',
      duration: '2020',
      location: 'San Francisco, CA',
      gpa: 'N/A',
      description: 'Intensive 12-week program covering modern web development technologies and best practices.',
      achievements: [
        'Top 10% of cohort',
        'Built 5 full-stack projects',
        'Mentored junior developers',
        'Received Excellence Award'
      ],
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  if (loading) {
    return (
      <section id="education" className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading education section...</p>
          </div>
        </div>
      </section>
    );
  }

  // Use database data if available, otherwise fall back to defaults
  const displayEducation = education.length > 0 ? education : defaultEducation;

  return (
    <section id="education" className="py-12 sm:py-16 lg:py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="education-header text-center mb-12 sm:mb-16 opacity-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            Education
          </h2>
          <p className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto px-4 sm:px-0">
            My academic journey and continuous learning path that shaped my technical foundation
          </p>
        </div>

        {/* Education Grid */}
        <div className="education-grid opacity-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {displayEducation.map((edu) => (
              <div
                key={edu.id}
                className="bg-bg-dark rounded-xl p-4 sm:p-6 hover:bg-bg-light transition-colors duration-200"
              >
                {/* Institution Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <img
                      src={edu.logo}
                      alt={edu.university}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-text truncate">{edu.degree}</h3>
                      <p className="text-primary font-medium text-sm sm:text-base truncate">{edu.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0 ml-2">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{edu.gpa}</span>
                  </div>
                </div>

                {/* Duration and Location */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mb-4 text-xs sm:text-sm text-text-muted">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {edu.duration}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {edu.location}
                  </div>
                </div>

                {/* Description */}
                <p className="text-text-muted mb-4 leading-relaxed text-sm sm:text-base">
                  {edu.description}
                </p>

                {/* Achievements */}
                <div>
                  <h4 className="text-text font-medium mb-2 flex items-center text-sm sm:text-base">
                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Key Achievements:
                  </h4>
                  <ul className="space-y-1">
                    {edu.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-text-muted text-xs sm:text-sm flex items-start">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};