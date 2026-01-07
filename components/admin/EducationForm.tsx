import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput, FormTextarea } from '../ui/FormField';
import { educationSchema, type EducationFormData } from '../types/admin';
import { educationService, type EducationData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface EducationFormProps {
  initialData?: EducationFormData;
  editingItem?: EducationData;
  onSave?: () => void;
  onCancel?: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  editingItem,
  onSave,
  onCancel
}) => {
  const [isEditing, setIsEditing] = useState(!!editingItem);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || {
      degree: '',
      university: '',
      duration: '',
      location: '',
      gpa: '',
      description: '',
      achievements: [''],
      logo: '',
    },
  });

  const achievements = form.watch('achievements') || [''];

  const addAchievement = () => {
    form.setValue('achievements', [...achievements, '']);
  };

  const removeAchievement = (index: number) => {
    form.setValue('achievements', achievements.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (editingItem) {
      form.reset({
        degree: editingItem.degree,
        university: editingItem.university,
        duration: editingItem.duration,
        location: editingItem.location,
        gpa: editingItem.gpa || '',
        description: editingItem.description,
        achievements: editingItem.achievements.length > 0 ? editingItem.achievements : [''],
        logo: editingItem.logo || '',
      });
    } else if (initialData) {
      form.reset(initialData);
    }
  }, [editingItem, initialData, form]);

  const onSubmit = async (data: EducationFormData) => {
    try {
      // Filter out empty achievements
      const filteredAchievements = data.achievements.filter(a => a.trim() !== '');
      const cleanData = {
        ...data,
        achievements: filteredAchievements.length > 0 ? filteredAchievements : [''],
        gpa: data.gpa || '',
        logo: data.logo || ''
      };

      if (isEditing && editingItem?.id) {
        await educationService.update(editingItem.id, cleanData);
        toast.success('Education updated successfully!');
      } else {
        await educationService.create(cleanData);
        toast.success('Education added successfully!');
      }
      form.reset();
      setIsEditing(false);
      onSave?.();
    } catch (error) {
      toast.error('Failed to save education');
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
          label="Degree"
          {...form.register('degree')}
          error={form.formState.errors.degree}
          required
          placeholder="Bachelor of Science in Computer Science"
        />
        <FormInput
          label="University"
          {...form.register('university')}
          error={form.formState.errors.university}
          required
          placeholder="University name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          label="Duration"
          {...form.register('duration')}
          error={form.formState.errors.duration}
          required
          placeholder="2018 - 2022"
        />
        <FormInput
          label="Location"
          {...form.register('location')}
          error={form.formState.errors.location}
          required
          placeholder="Berkeley, CA"
        />
        <FormInput
          label="GPA"
          {...form.register('gpa')}
          error={form.formState.errors.gpa}
          placeholder="3.8/4.0"
        />
      </div>

      <div>
        <FormTextarea
          label="Description"
          {...form.register('description')}
          error={form.formState.errors.description}
          required
          rows={4}
          placeholder="Description of your studies and focus areas"
        />
      </div>

      <div>
        <FormInput
          label="Logo URL"
          type="url"
          {...form.register('logo')}
          placeholder="https://example.com/university-logo.png"
        />
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-text-muted">Key Achievements *</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAchievement}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </div>
        {achievements.map((_, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <FormInput
              label=""
              {...form.register(`achievements.${index}`)}
              placeholder="Achievement or honor"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeAchievement(index)}
              className="text-error hover:text-error/80 border-error/30 hover:bg-error/10 hover:border-error mt-0.5"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.achievements && (
          <p className="text-error text-sm mt-1">{form.formState.errors.achievements.message}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Update Education' : 'Add Education'}
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