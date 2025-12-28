import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
          <input
            type="text"
            {...form.register('company')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Company name"
          />
          {form.formState.errors.company && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.company.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
          <input
            type="text"
            {...form.register('position')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Job title"
          />
          {form.formState.errors.position && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.position.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Duration *</label>
          <input
            type="text"
            {...form.register('duration')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2022 - Present"
          />
          {form.formState.errors.duration && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.duration.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
          <input
            type="text"
            {...form.register('location')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="San Francisco, CA"
          />
          {form.formState.errors.location && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.location.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          {...form.register('description')}
          rows={4}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Brief description of your role and achievements"
        />
        {form.formState.errors.description && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
        <input
          type="url"
          {...form.register('logo')}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/logo.png"
        />
      </div>

      {/* Responsibilities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">Key Responsibilities *</label>
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
            <input
              {...form.register(`responsibilities.${index}`)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Key responsibility"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeResponsibility(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.responsibilities && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.responsibilities.message}</p>
        )}
      </div>

      {/* Technologies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">Technologies Used *</label>
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
            <input
              {...form.register(`technologies.${index}`)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Technology name"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeTechnology(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.technologies && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.technologies.message}</p>
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