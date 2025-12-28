import { supabase } from './supabase';
import type { Project, BlogPost, WorkExperience, Education, Appointment } from '../types';

// Projects
export const getProjects = async (featured?: boolean) => {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Project[];
};

export const getProjectBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Project;
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Blog Posts
export const getBlogPosts = async (published?: boolean, featured?: boolean) => {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (published !== undefined) {
    query = query.eq('published', published);
  }

  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as BlogPost[];
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as BlogPost;
};

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
};

export const deleteBlogPost = async (id: string) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Work Experience
export const getWorkExperience = async () => {
  const { data, error } = await supabase
    .from('work_experience')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as WorkExperience[];
};

export const createWorkExperience = async (experience: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('work_experience')
    .insert(experience)
    .select()
    .single();

  if (error) throw error;
  return data as WorkExperience;
};

export const updateWorkExperience = async (id: string, updates: Partial<WorkExperience>) => {
  const { data, error } = await supabase
    .from('work_experience')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as WorkExperience;
};

export const deleteWorkExperience = async (id: string) => {
  const { error } = await supabase
    .from('work_experience')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Education
export const getEducation = async () => {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as Education[];
};

export const createEducation = async (education: Omit<Education, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('education')
    .insert(education)
    .select()
    .single();

  if (error) throw error;
  return data as Education;
};

export const updateEducation = async (id: string, updates: Partial<Education>) => {
  const { data, error } = await supabase
    .from('education')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Education;
};

export const deleteEducation = async (id: string) => {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Appointments
export const getAppointments = async () => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return data as Appointment[];
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
};

export const deleteAppointment = async (id: string) => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Contact Messages
export const createContactMessage = async (message: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getContactMessages = async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};