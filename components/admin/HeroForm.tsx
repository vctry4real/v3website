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
          <FormInput
            label="Name"
            {...form.register('name')}
            error={form.formState.errors.name}
            required
            placeholder="Your name"
          />
          <FormInput
            label="Title"
            {...form.register('title')}
            error={form.formState.errors.title}
            required
            placeholder="Your professional title"
          />
        </div>

        <div>
          <FormTextarea
            label="Description"
            {...form.register('description')}
            error={form.formState.errors.description}
            required
            placeholder="Your professional description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Email"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email}
            required
            placeholder="your@email.com"
          />
          <FormInput
            label="Phone"
            type="tel"
            {...form.register('phone')}
            error={form.formState.errors.phone}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="GitHub URL"
            type="url"
            {...form.register('github')}
            error={form.formState.errors.github}
            placeholder="https://github.com/username"
          />
          <FormInput
            label="LinkedIn URL"
            type="url"
            {...form.register('linkedin')}
            error={form.formState.errors.linkedin}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <FormInput
            label="Location"
            {...form.register('location')}
            error={form.formState.errors.location}
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