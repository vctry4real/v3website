import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { aboutSchema, type AboutFormData } from '../types/admin';
import { aboutService } from '../lib/adminService';
import toast from 'react-hot-toast';

interface AboutFormProps {
  initialData?: AboutFormData;
  onSave?: () => void;
}

export const AboutForm: React.FC<AboutFormProps> = ({ initialData, onSave }) => {
  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: initialData || {
      summary: 'I\'m a passionate full-stack software engineer with over 4 years of experience building scalable web applications and innovative digital solutions.',
      experience: '4+',
      projects: '50+',
      clients: '25+',
      technologies: '20+',
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (data: AboutFormData) => {
    try {
      await aboutService.update(data);
      onSave?.();
    } catch (error) {
      toast.error('Failed to save about section');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary *</label>
        <textarea
          {...form.register('summary')}
          rows={6}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Tell your professional story..."
        />
        {form.formState.errors.summary && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.summary.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Years Experience *</label>
          <input
            type="text"
            {...form.register('experience')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="4+"
          />
          {form.formState.errors.experience && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.experience.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Projects Completed *</label>
          <input
            type="text"
            {...form.register('projects')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50+"
          />
          {form.formState.errors.projects && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.projects.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Happy Clients *</label>
          <input
            type="text"
            {...form.register('clients')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="25+"
          />
          {form.formState.errors.clients && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.clients.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Technologies *</label>
          <input
            type="text"
            {...form.register('technologies')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="20+"
          />
          {form.formState.errors.technologies && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.technologies.message}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save About Section
        </Button>
      </div>
    </form>
  );
}; 