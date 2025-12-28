import { z } from 'zod';

// Hero Section Schema
export const heroSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  email: z.string().email('Valid email is required'),
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
});

// About Section Schema
export const aboutSchema = z.object({
  summary: z.string().min(50, 'Summary must be at least 50 characters'),
  experience: z.string().min(1, 'Experience is required'),
  projects: z.string().min(1, 'Projects count is required'),
  clients: z.string().min(1, 'Clients count is required'),
  technologies: z.string().min(1, 'Technologies count is required'),
});

// Experience Schema
export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  duration: z.string().min(1, 'Duration is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  logo: z.string().optional(),
});

// Education Schema
export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, 'Degree is required'),
  university: z.string().min(1, 'University is required'),
  duration: z.string().min(1, 'Duration is required'),
  location: z.string().min(1, 'Location is required'),
  gpa: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  achievements: z.array(z.string()).min(1, 'At least one achievement is required'),
  logo: z.string().optional(),
});

// Project Schema
export const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(), // Will be auto-generated from title
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.enum(['fullstack', 'backend', 'frontend']),
  tags: z.array(z.string()).optional(),
  tech: z.array(z.string()).min(1, 'At least one technology is required'),
  github: z.string().url().optional().or(z.literal('')),
  live: z.string().url().optional().or(z.literal('')),
  featured: z.boolean(),
  image: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  role: z.string().min(1, 'Role is required'),
  contributions: z.array(z.string()).min(1, 'At least one contribution is required'),
  analytics: z.object({
    linesOfCode: z.number().min(0),
    uptime: z.string(),
    users: z.number().min(0),
    performance: z.string(),
  }).optional(),
});

// Blog Schema
export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').refine(tags => tags.some(tag => tag.trim() !== ''), 'At least one non-empty tag is required'),
  coverImage: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  readTime: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Profile Image Schema
export const profileImageSchema = z.object({
  image: z.string().min(1, 'Image URL is required'),
  alt: z.string().min(1, 'Alt text is required'),
});

// Resume Schema
export const resumeSchema = z.object({
  file_url: z.string().min(1, 'Resume file is required'),
  file_name: z.string().min(1, 'Filename is required'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Skills Schema
export const skillsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.number().min(0).max(100, 'Level must be between 0 and 100'),
  order_index: z.number().min(0, 'Order index must be 0 or greater'),
});

// Type exports
export type HeroFormData = z.infer<typeof heroSchema>;
export type AboutFormData = z.infer<typeof aboutSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
export type ProfileImageFormData = z.infer<typeof profileImageSchema>;
export type ResumeFormData = z.infer<typeof resumeSchema>;
export type SkillsFormData = z.infer<typeof skillsSchema>;

// Admin Tab Types
export type AdminTab = 
  | 'hero' 
  | 'about' 
  | 'experience' 
  | 'education' 
  | 'projects' 
  | 'skills'
  | 'blog' 
  | 'appointments'
  | 'contact-messages'
  | 'email-notifications'
  | 'profile-image' 
  | 'resume'
  | 'analytics'
  | 'export-import'; 