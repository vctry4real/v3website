import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput, FormTextarea } from '../ui/FormField';
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
        <FormTextarea
          label="Professional Summary"
          {...form.register('summary')}
          error={form.formState.errors.summary}
          required
          rows={6}
          placeholder="Tell your professional story..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <FormInput
          label="Years Experience"
          {...form.register('experience')}
          error={form.formState.errors.experience}
          required
          placeholder="4+"
        />
        <FormInput
          label="Projects Completed"
          {...form.register('projects')}
          error={form.formState.errors.projects}
          required
          placeholder="50+"
        />
        <FormInput
          label="Happy Clients"
          {...form.register('clients')}
          error={form.formState.errors.clients}
          required
          placeholder="25+"
        />
        <FormInput
          label="Technologies"
          {...form.register('technologies')}
          error={form.formState.errors.technologies}
          required
          placeholder="20+"
        />
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