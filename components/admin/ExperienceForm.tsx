import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X, Edit, Trash2, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput, FormTextarea } from '../ui/FormField';
import { experienceSchema, type ExperienceFormData } from '../types/admin';
import { experienceService, type ExperienceData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface ExperienceFormProps {
  initialData?: ExperienceFormData;
  editingItem?: ExperienceData;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initialData,
  editingItem,
  onSave,
  onCancel
}) => {
  const [isEditing, setIsEditing] = useState(!!editingItem);

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      company: '',
      position: '',
      duration: '',
      location: '',
      description: '',
      responsibilities: [''],
      technologies: [''],
      logo: '',
    },
  });

  const responsibilities = form.watch('responsibilities') || [''];
  const technologies = form.watch('technologies') || [''];

  const addResponsibility = () => {
    form.setValue('responsibilities', [...responsibilities, '']);
  };

  const removeResponsibility = (index: number) => {
    form.setValue('responsibilities', responsibilities.filter((_, i) => i !== index));
  };

  const addTechnology = () => {
    form.setValue('technologies', [...technologies, '']);
  };

  const removeTechnology = (index: number) => {
    form.setValue('technologies', technologies.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (editingItem) {
      form.reset({
        company: editingItem.company,
        position: editingItem.position,
        duration: editingItem.duration,
        location: editingItem.location,
        description: editingItem.description,
        responsibilities: editingItem.responsibilities,
        technologies: editingItem.technologies,
        logo: editingItem.logo || '',
      });
    } else if (initialData) {
      form.reset(initialData);
    }
  }, [editingItem, initialData, form]);

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      // Filter out empty entries
      const filteredResponsibilities = data.responsibilities.filter(r => r.trim() !== '');
      const filteredTechnologies = data.technologies.filter(t => t.trim() !== '');

      const cleanData = {
        ...data,
        responsibilities: filteredResponsibilities.length > 0 ? filteredResponsibilities : [''],
        technologies: filteredTechnologies.length > 0 ? filteredTechnologies : [''],
        logo: data.logo || ''
      };

      if (isEditing && editingItem?.id) {
        await experienceService.update(editingItem.id, cleanData);
        toast.success('Experience updated successfully!');
      } else {
        await experienceService.create(cleanData);
        toast.success('Experience added successfully!');
      }
      form.reset();
      setIsEditing(false);
      onSave?.();
    } catch (error) {
      toast.error('Failed to save experience');
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Company"
          {...form.register('company')}
          error={form.formState.errors.company}
          required
          placeholder="Company name"
        />
        <FormInput
          label="Position"
          {...form.register('position')}
          error={form.formState.errors.position}
          required
          placeholder="Job title"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Duration"
          {...form.register('duration')}
          error={form.formState.errors.duration}
          required
          placeholder="2022 - Present"
        />
        <FormInput
          label="Location"
          {...form.register('location')}
          error={form.formState.errors.location}
          required
          placeholder="San Francisco, CA"
        />
      </div>

      <div>
        <FormTextarea
          label="Description"
          {...form.register('description')}
          error={form.formState.errors.description}
          required
          rows={4}
          placeholder="Brief description of your role and achievements"
        />
      </div>

      <div>
        <FormInput
          label="Logo URL"
          type="url"
          {...form.register('logo')}
          placeholder="https://example.com/logo.png"
        />
      </div>

      {/* Responsibilities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-text-muted">Key Responsibilities *</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addResponsibility}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Responsibility
          </Button>
        </div>
        {responsibilities.map((_, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <FormInput
              label=""
              {...form.register(`responsibilities.${index}`)}
              placeholder="Key responsibility"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeResponsibility(index)}
              className="text-error hover:text-error/80 border-error/30 hover:bg-error/10 hover:border-error mt-0.5"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.responsibilities && (
          <p className="text-error text-sm mt-1">{form.formState.errors.responsibilities.message}</p>
        )}
      </div>

      {/* Technologies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-text-muted">Technologies Used *</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTechnology}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Technology
          </Button>
        </div>
        {technologies.map((_, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <FormInput
              label=""
              {...form.register(`technologies.${index}`)}
              placeholder="Technology name"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeTechnology(index)}
              className="text-error hover:text-error/80 border-error/30 hover:bg-error/10 hover:border-error mt-0.5"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.technologies && (
          <p className="text-error text-sm mt-1">{form.formState.errors.technologies.message}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Update Experience' : 'Add Experience'}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};