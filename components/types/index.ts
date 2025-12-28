export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  features: string[];
  role: string;
  contributions: string[];
  tech_stack: string[];
  duration: string;
  cover_image: string;
  gallery_images: string[];
  project_url?: string;
  github_url?: string;
  analytics?: {
    lines_of_code?: number;
    uptime?: string;
    users?: number;
  };
  testimonial?: {
    text: string;
    author: string;
    position: string;
  };
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  cover_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  logo?: string;
  company_url?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  year: string;
  gpa?: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string; // ISO date string
  time: string;
  reason: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}