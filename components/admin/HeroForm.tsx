import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput, FormTextarea } from '../ui/FormField';
import { FormStatus as FormStatusComponent } from '../ui/FormStatus';
import { heroSchema, type HeroFormData } from '../types/admin';
import { heroService } from '../lib/adminService';
import toast from 'react-hot-toast';

interface HeroFormProps {
  initialData?: HeroFormData;
  onSave?: () => void;
}

export const HeroForm: React.FC<HeroFormProps> = ({ initialData, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const form = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: initialData || {
      name: 'Victory Johnson',
      title: 'Full-Stack Software Engineer',
      description: 'Crafting exceptional digital experiences with 4+ years of expertise in full-stack development, no-code solutions, and modern web technologies.',
      email: 'victory@example.com',
      github: 'https://github.com/victoryjohnson',
      linkedin: 'https://linkedin.com/in/victoryjohnson',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (data: HeroFormData) => {
    setIsSubmitting(true);
    try {
      await heroService.update(data);
      setLastSaved(new Date());
      toast.success('Hero section updated successfully!');
      onSave?.();
    } catch (error) {
      toast.error('Failed to save hero section');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Status */}
      <FormStatusComponent
        form={form}
        isSubmitting={isSubmitting}
        lastSaved={lastSaved || undefined}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
            <input
              type="text"
              {...form.register('name')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
            {form.formState.errors.name && (
              <p className="text-red-400 text-sm mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              {...form.register('title')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your professional title"
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>
        </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          {...form.register('description')}
          rows={4}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Your professional description"
        />
        {form.formState.errors.description && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
          <input
            type="email"
            {...form.register('email')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
          {form.formState.errors.email && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            {...form.register('phone')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
          <input
            type="url"
            {...form.register('github')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
          <input
            type="url"
            {...form.register('linkedin')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
        <input
          type="text"
          {...form.register('location')}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Hero Section
        </Button>
      </div>
    </form>
    </div>
  );
}; 