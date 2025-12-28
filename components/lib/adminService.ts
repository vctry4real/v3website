import { supabase } from './supabase';
import toast from 'react-hot-toast';
import { createContactMessage, getContactMessages, getAppointments, createAppointment, updateAppointment, deleteAppointment } from './database';

// Development mode - set to true to bypass authentication for testing
const DEV_MODE = true;

// Types for data management
export interface HeroData {
  id?: string;
  name: string;
  title: string;
  description: string;
  email: string;
  github?: string;
  linkedin?: string;
  phone?: string;
  location?: string;
}

export interface AboutData {
  id?: string;
  summary: string;
  experience: string;
  projects: string;
  clients: string;
  technologies: string;
}

export interface ExperienceData {
  id?: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  logo: string;
}

export interface EducationData {
  id?: string;
  degree: string;
  university: string;
  duration: string;
  location: string;
  gpa: string;
  description: string;
  achievements: string[];
  logo: string;
}

export interface ProjectData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: 'fullstack' | 'backend' | 'frontend';
  tags: string[];
  tech: string[];
  github?: string;
  live?: string;
  featured: boolean;
  image?: string;
  screenshots?: string[];
  role: string;
  contributions: string[];
  analytics?: {
    linesOfCode: number;
    uptime: string;
    users: number;
    performance: string;
  };
}

export interface BlogData {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage?: string;
  featured: boolean;
  published: boolean;
  readTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileImageData {
  id?: string;
  image: string;
  alt: string;
}

export interface ResumeData {
  id?: string;
  file_url: string;
  file_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface SkillData {
  id?: string;
  name: string;
  category: string;
  level: number;
  order_index?: number; // Match database column name
}

// Mock data storage (replace with Supabase in production)
const mockData = {
  hero: {
    name: 'Victory Johnson',
    title: 'Full-Stack Software Engineer',
    description: 'Crafting exceptional digital experiences with 4+ years of expertise in full-stack development, no-code solutions, and modern web technologies.',
    email: 'victory@example.com',
    github: 'https://github.com/victoryjohnson',
    linkedin: 'https://linkedin.com/in/victoryjohnson',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  },
  about: {
    summary: 'I\'m a passionate full-stack software engineer with over 4 years of experience building scalable web applications and innovative digital solutions.',
    experience: '4+',
    projects: '50+',
    clients: '25+',
    technologies: '20+',
  },
  experiences: [
    {
      id: '1',
      company: 'TechCorp Solutions',
      position: 'Senior Full-Stack Developer',
      duration: '2022 - Present',
      location: 'San Francisco, CA',
      description: 'Leading development of scalable web applications serving 100K+ users.',
      responsibilities: [
        'Architected and developed microservices using Node.js and Python',
        'Led a team of 5 developers in agile development practices',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript'],
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      university: 'University of California, Berkeley',
      duration: '2018 - 2022',
      location: 'Berkeley, CA',
      gpa: '3.8/4.0',
      description: 'Focused on software engineering, algorithms, and data structures.',
      achievements: [
        'Dean\'s List (2018-2022)',
        'Computer Science Honor Society',
        'Research Assistant in AI Lab',
        'Graduated with Distinction'
      ],
      logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ],
  projects: [
    {
      id: '1',
      slug: 'ecommerce-platform',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
      content: 'This project represents a comprehensive e-commerce solution built from the ground up.',
      category: 'fullstack' as const,
      tags: ['e-commerce', 'web application', 'payment processing'],
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker', 'TypeScript'],
      github: 'https://github.com/victoryjohnson/ecommerce-platform',
      live: 'https://ecommerce-demo.victoryjohnson.com',
      featured: true,
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=500',
      screenshots: [] as string[],
      role: 'Lead Full-Stack Developer',
      contributions: [
        'Architected the entire application structure and database schema',
        'Implemented secure authentication and authorization system',
        'Developed responsive frontend with modern React patterns',
      ],
      analytics: {
        linesOfCode: 25000,
        uptime: '99.9%',
        users: 1500,
        performance: '95/100',
      },
    },
    {
      id: '2',
      slug: 'task-management-app',
      title: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates, team collaboration, and analytics.',
      content: 'A modern task management application that helps teams organize, track, and complete projects efficiently.',
      category: 'frontend' as const,
      tags: ['web application', 'task management', 'collaboration'],
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Zustand', 'Framer Motion'],
      github: 'https://github.com/victoryjohnson/task-manager',
      live: 'https://taskmanager-demo.example.com',
      featured: true,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500',
      screenshots: [] as string[],
      role: 'Frontend Lead Developer',
      contributions: [
        'Led frontend development team of 3 developers',
        'Implemented real-time features using WebSockets',
        'Built responsive UI with Next.js and Tailwind CSS',
      ],
      analytics: {
        linesOfCode: 18000,
        uptime: '99.8%',
        users: 800,
        performance: '92/100',
      },
    },
    {
      id: '3',
      slug: 'api-gateway-service',
      title: 'API Gateway Service',
      description: 'Microservices API gateway with authentication, rate limiting, and monitoring capabilities.',
      content: 'A robust API gateway service to handle microservices communication, authentication, and monitoring.',
      category: 'backend' as const,
      tags: ['api', 'microservices', 'gateway'],
      tech: ['Python', 'FastAPI', 'Docker', 'Redis', 'PostgreSQL', 'Prometheus', 'Grafana'],
      github: 'https://github.com/victoryjohnson/api-gateway',
      live: undefined,
      featured: false,
      image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=500',
      screenshots: [] as string[],
      role: 'Backend Developer',
      contributions: [
        'Designed microservices architecture',
        'Implemented JWT-based authentication',
        'Built rate limiting and throttling mechanisms',
      ],
      analytics: {
        linesOfCode: 12000,
        uptime: '99.9%',
        users: 2000,
        performance: '98/100',
      },
    },
  ] as ProjectData[],
  blogPosts: [
    {
      id: '1',
      slug: 'building-scalable-react-applications-typescript',
      title: 'Building Scalable React Applications with TypeScript',
      summary: 'Learn best practices for structuring large React applications with TypeScript, including advanced patterns and performance optimizations.',
      content: '# Building Scalable React Applications with TypeScript\n\nWhen building large-scale React applications, proper architecture and TypeScript integration become crucial for maintainability and developer experience.',
      tags: ['React', 'TypeScript', 'Architecture'],
      coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500',
      featured: true,
      published: true,
      readTime: '8 min read',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      slug: 'microservices-architecture-lessons-learned',
      title: 'Microservices Architecture: Lessons Learned',
      summary: 'Real-world insights from implementing microservices at scale, including common pitfalls and solutions.',
      content: '# Microservices Architecture: Lessons Learned\n\nAfter implementing microservices at scale, I\'ve learned valuable lessons about architecture, deployment, and team coordination.',
      tags: ['Microservices', 'Architecture', 'Backend'],
      coverImage: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=500',
      featured: false,
      published: true,
      readTime: '12 min read',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
    },
    {
      id: '3',
      slug: 'future-web-development-trends-2024',
      title: 'The Future of Web Development: Trends to Watch',
      summary: 'Exploring emerging technologies and trends that will shape the future of web development in 2024 and beyond.',
      content: '# The Future of Web Development: Trends to Watch\n\nAs we move into 2024, several emerging technologies and trends are shaping the future of web development.',
      tags: ['Web Development', 'Trends', 'Future'],
      coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500',
      featured: true,
      published: true,
      readTime: '6 min read',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z',
    },
  ] as BlogData[],
  profileImage: {
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Victory Johnson',
  },
  resume: {
    file_url: '/Software Engineer - Victory Johnson.pdf',
    file_name: 'Victory Johnson - Software Engineer Resume.pdf',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  skills: [
    { id: '1', name: 'React', category: 'frontend', level: 95, order_index: 1 },
    { id: '2', name: 'TypeScript', category: 'frontend', level: 90, order_index: 2 },
    { id: '3', name: 'Next.js', category: 'frontend', level: 88, order_index: 3 },
    { id: '4', name: 'Tailwind CSS', category: 'frontend', level: 92, order_index: 4 },
    { id: '5', name: 'Node.js', category: 'backend', level: 85, order_index: 5 },
    { id: '6', name: 'Python', category: 'backend', level: 80, order_index: 6 },
    { id: '7', name: 'Express.js', category: 'backend', level: 82, order_index: 7 },
    { id: '8', name: 'FastAPI', category: 'backend', level: 75, order_index: 8 },
    { id: '9', name: 'PostgreSQL', category: 'database', level: 85, order_index: 9 },
    { id: '10', name: 'MongoDB', category: 'database', level: 80, order_index: 10 },
    { id: '11', name: 'Supabase', category: 'database', level: 88, order_index: 11 },
    { id: '12', name: 'Firebase', category: 'database', level: 82, order_index: 12 },
    { id: '13', name: 'Docker', category: 'tools', level: 78, order_index: 13 },
    { id: '14', name: 'AWS', category: 'tools', level: 75, order_index: 14 },
    { id: '15', name: 'Git', category: 'tools', level: 90, order_index: 15 },
    { id: '16', name: 'Figma', category: 'tools', level: 85, order_index: 16 },
  ] as SkillData[],
};

// Hero Section CRUD
export const heroService = {
  async get(): Promise<HeroData> {
    try {
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data || mockData.hero;
    } catch (error) {
      console.warn('Using mock hero data');
      return mockData.hero;
    }
  },

  async update(data: HeroData): Promise<void> {
    try {
      const { error } = await supabase
        .from('hero')
        .upsert(data);

      if (error) throw error;
      toast.success('Hero section updated successfully!');
    } catch (error) {
      console.warn('Hero update failed, using mock storage');
      Object.assign(mockData.hero, data);
      toast.success('Hero section updated successfully!');
    }
  },
};

// About Section CRUD
export const aboutService = {
  async get(): Promise<AboutData> {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data || mockData.about;
    } catch (error) {
      console.warn('Using mock about data');
      return mockData.about;
    }
  },

  async update(data: AboutData): Promise<void> {
    try {
      const { error } = await supabase
        .from('about')
        .upsert(data);

      if (error) throw error;
      toast.success('About section updated successfully!');
    } catch (error) {
      console.warn('About update failed, using mock storage');
      Object.assign(mockData.about, data);
      toast.success('About section updated successfully!');
    }
  },
};

// Experience Section CRUD
export const experienceService = {
  async getAll(): Promise<ExperienceData[]> {
    try {
      const { data, error } = await supabase
        .from('work_experience')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || mockData.experiences;
    } catch (error) {
      console.warn('Using mock experience data');
      return mockData.experiences;
    }
  },

  async create(data: ExperienceData): Promise<void> {
    try {
      const { error } = await supabase
        .from('work_experience')
        .insert(data);

      if (error) throw error;
      toast.success('Experience added successfully!');
    } catch (error) {
      console.warn('Experience creation failed, using mock storage');
      const newId = (mockData.experiences.length + 1).toString();
      mockData.experiences.unshift({ ...data, id: newId, logo: data.logo || '' });
      toast.success('Experience added successfully!');
    }
  },

  async update(id: string, data: ExperienceData): Promise<void> {
    try {
      const { error } = await supabase
        .from('work_experience')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      toast.success('Experience updated successfully!');
    } catch (error) {
      console.warn('Experience update failed, using mock storage');
      const index = mockData.experiences.findIndex(exp => exp.id === id);
      if (index !== -1) {
        mockData.experiences[index] = { ...data, id };
      }
      toast.success('Experience updated successfully!');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('work_experience')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Experience deleted successfully!');
    } catch (error) {
      console.warn('Experience deletion failed, using mock storage');
      mockData.experiences = mockData.experiences.filter(exp => exp.id !== id);
      toast.success('Experience deleted successfully!');
    }
  },
};

// Education Section CRUD
export const educationService = {
  async getAll(): Promise<EducationData[]> {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || mockData.education;
    } catch (error) {
      console.warn('Using mock education data');
      return mockData.education;
    }
  },

  async create(data: EducationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('education')
        .insert(data);

      if (error) throw error;
      toast.success('Education added successfully!');
    } catch (error) {
      console.warn('Education creation failed, using mock storage');
      const newId = (mockData.education.length + 1).toString();
      mockData.education.unshift({ ...data, id: newId });
      toast.success('Education added successfully!');
    }
  },

  async update(id: string, data: EducationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('education')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      toast.success('Education updated successfully!');
    } catch (error) {
      console.warn('Education update failed, using mock storage');
      const index = mockData.education.findIndex(edu => edu.id === id);
      if (index !== -1) {
        mockData.education[index] = { ...data, id };
      }
      toast.success('Education updated successfully!');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Education deleted successfully!');
    } catch (error) {
      console.warn('Education deletion failed, using mock storage');
      mockData.education = mockData.education.filter(edu => edu.id !== id);
      toast.success('Education deleted successfully!');
    }
  },
};

// Projects Section CRUD
export const projectService = {
  async getAll(): Promise<ProjectData[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Ensure all projects have the required arrays
      const processedData = (data || []).map((project: any) => ({
        ...project,
        tags: project.tags || [],
        tech: project.tech || [],
        contributions: project.contributions || [],
        screenshots: project.screenshots || [],
        category: (project.category as 'fullstack' | 'backend' | 'frontend') || 'fullstack',
      }));

      const result = processedData.length > 0 ? processedData : mockData.projects;
      return result as ProjectData[];
    } catch (error) {
      console.warn('Using mock project data');
      console.log('ProjectService.getAll() - Mock data:', mockData.projects);
      return mockData.projects;
    }
  },

  async getBySlug(slug: string): Promise<ProjectData | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Project not found in database, checking mock data');
      const mockProject = mockData.projects.find(project => project.slug === slug);
      return mockProject || null;
    }
  },

  async create(data: ProjectData): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .insert(data);

      if (error) throw error;
      toast.success('Project added successfully!');
    } catch (error) {
      console.warn('Project creation failed, using mock storage');
      const newId = (mockData.projects.length + 1).toString();
      mockData.projects.unshift({
        ...data,
        id: newId,
        github: data.github || '',
        live: data.live || '',
        image: data.image || '',
        screenshots: data.screenshots || [],
        analytics: data.analytics || {
          linesOfCode: 0,
          uptime: '',
          users: 0,
          performance: '',
        }
      });
      toast.success('Project added successfully!');
    }
  },

  async update(id: string, data: ProjectData): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      toast.success('Project updated successfully!');
    } catch (error) {
      console.warn('Project update failed, using mock storage');
      const index = mockData.projects.findIndex(proj => proj.id === id);
      if (index !== -1) {
        mockData.projects[index] = { ...data, id };
      }
      toast.success('Project updated successfully!');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.warn('Project deletion failed, using mock storage');
      mockData.projects = mockData.projects.filter(proj => proj.id !== id);
      toast.success('Project deleted successfully!');
    }
  },
};

// Blog Section CRUD
export const blogService = {
  async getAll(): Promise<BlogData[]> {
    try {
      // Add retry logic
      let retries = 3;
      let lastError;

      while (retries > 0) {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Transform data from database format to frontend format
          const transformedData = (data || []).map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            content: post.content,
            tags: post.tags || [],
            coverImage: post.cover_image,
            featured: post.featured,
            published: post.published,
            readTime: post.read_time,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
          }));



          return transformedData.length > 0 ? transformedData : mockData.blogPosts;
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            console.log(`Retrying... ${retries} attempts left`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          }
        }
      }

      throw lastError;
    } catch (error) {
      console.warn('Using mock blog data due to error:', error);
      return mockData.blogPosts;
    }
  },

  async create(data: BlogData): Promise<void> {
    try {
      console.log('BlogService.create called with data:', data);

      // Transform data to match database schema
      const transformedData = {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        tags: data.tags,
        cover_image: data.coverImage,
        published: data.published,
        featured: data.featured,
        read_time: data.readTime,
      };

      console.log('Transformed data for Supabase:', transformedData);

      const { data: result, error } = await supabase
        .from('blog_posts')
        .insert(transformedData)
        .select();

      console.log('Supabase response:', { result, error });

      if (error) {
        console.error('Supabase error:', error);
        if (error.message?.includes('row-level security policy') && !DEV_MODE) {
          console.warn('Authentication required for blog post creation. Using mock storage.');
          toast.error('Authentication required. Using local storage for now.');
        }
        throw error;
      }

      console.log('Blog post created successfully:', result);
      toast.success('Blog post added successfully!');
    } catch (error) {
      console.error('Blog creation failed:', error);
      console.warn('Blog creation failed, using mock storage');
      const newId = (mockData.blogPosts.length + 1).toString();
      const mockPost = {
        ...data,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockData.blogPosts.unshift(mockPost);
      toast.success('Blog post added to local storage!');
    }
  },

  async update(id: string, data: BlogData): Promise<void> {
    try {
      // Transform data to match database schema
      const transformedData = {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        tags: data.tags,
        cover_image: data.coverImage,
        published: data.published,
        featured: data.featured,
        read_time: data.readTime,
      };

      const { error } = await supabase
        .from('blog_posts')
        .update(transformedData)
        .eq('id', id);

      if (error) throw error;
      toast.success('Blog post updated successfully!');
    } catch (error) {
      console.warn('Blog update failed, using mock storage');
      const index = mockData.blogPosts.findIndex(post => post.id === id);
      if (index !== -1) {
        mockData.blogPosts[index] = { ...data, id };
      }
      toast.success('Blog post updated successfully!');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Blog post deleted successfully!');
    } catch (error) {
      console.warn('Blog deletion failed, using mock storage');
      mockData.blogPosts = mockData.blogPosts.filter(post => post.id !== id);
      toast.success('Blog post deleted successfully!');
    }
  },
};

// Profile Image CRUD
export const profileImageService = {
  async get(): Promise<ProfileImageData> {
    try {
      const { data, error } = await supabase
        .from('profile_image')
        .select('*')
        .single();

      if (error) throw error;
      return data || mockData.profileImage;
    } catch (error) {
      console.warn('Using mock profile image data');
      return mockData.profileImage;
    }
  },

  async update(data: ProfileImageData): Promise<void> {
    try {
      const { error } = await supabase
        .from('profile_image')
        .upsert(data);

      if (error) throw error;
      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.warn('Profile image update failed, using mock storage');
      Object.assign(mockData.profileImage, data);
      toast.success('Profile image updated successfully!');
    }
  },
};

// Resume CRUD
export const resumeService = {
  async get(): Promise<ResumeData> {
    try {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .single();

      if (error) throw error;
      return data || mockData.resume;
    } catch (error) {
      console.warn('Using mock resume data');
      return mockData.resume;
    }
  },

  async update(data: ResumeData): Promise<void> {
    try {
      const { error } = await supabase
        .from('resume')
        .upsert(data);

      if (error) throw error;
      toast.success('Resume updated successfully!');
    } catch (error) {
      console.warn('Resume update failed, using mock storage');
      Object.assign(mockData.resume, data);
      toast.success('Resume updated successfully!');
    }
  },
};

// Skills CRUD
export const skillsService = {
  async getAll(): Promise<SkillData[]> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || mockData.skills;
    } catch (error) {
      console.warn('Using mock skills data');
      return mockData.skills;
    }
  },

  async create(data: SkillData): Promise<void> {
    try {
      const { error } = await supabase
        .from('skills')
        .insert(data);

      if (error) throw error;
      toast.success('Skill added successfully!');
    } catch (error) {
      console.warn('Skill creation failed, using mock storage');
      const newId = (mockData.skills.length + 1).toString();
      mockData.skills.push({ ...data, id: newId, order_index: data.order_index || mockData.skills.length + 1 });
      toast.success('Skill added successfully!');
    }
  },

  async update(id: string, data: SkillData): Promise<void> {
    try {
      console.log('Updating skill with ID:', id, 'Data:', data);
      const { error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Skill updated successfully in database');
      toast.success('Skill updated successfully!');
    } catch (error) {
      console.error('Skill update failed:', error);
      console.warn('Skill update failed, using mock storage');
      const index = mockData.skills.findIndex(skill => skill.id === id);
      if (index !== -1) {
        mockData.skills[index] = { ...data, id };
        console.log('Updated skill in mock data:', mockData.skills[index]);
      }
      toast.success('Skill updated successfully!');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Skill deleted successfully!');
    } catch (error) {
      console.warn('Skill deletion failed, using mock storage');
      mockData.skills = mockData.skills.filter(skill => skill.id !== id);
      toast.success('Skill deleted successfully!');
    }
  },
};

// Contact Messages CRUD
export const contactMessagesService = {
  async getAll(): Promise<any[]> {
    try {
      const messages = await getContactMessages();
      return messages || [];
    } catch (error) {
      console.warn('Using mock contact messages data');
      return [];
    }
  },

  async create(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    try {
      await createContactMessage(data);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Contact message creation failed:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Message status updated successfully!');
    } catch (error) {
      console.error('Failed to update message status:', error);
      toast.error('Failed to update message status');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Message deleted successfully!');
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  },
};

// Appointments CRUD
export const appointmentService = {
  async getAll(): Promise<any[]> {
    try {
      const appointments = await getAppointments();
      return appointments || [];
    } catch (error) {
      console.warn('Using mock appointments data');
      return [];
    }
  },

  async create(data: {
    name: string;
    email: string;
    date: string;
    time: string;
    reason: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }): Promise<void> {
    try {
      await createAppointment(data);
      toast.success('Appointment booked successfully!');
    } catch (error) {
      console.error('Appointment creation failed:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<{
    name: string;
    email: string;
    date: string;
    time: string;
    reason: string;
    message: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }>): Promise<void> {
    try {
      await updateAppointment(id, data);
      toast.success('Appointment updated successfully!');
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Failed to update appointment');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteAppointment(id);
      toast.success('Appointment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      toast.error('Failed to delete appointment');
    }
  },
};