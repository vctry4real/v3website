import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Degree *</label>
          <input
            type="text"
            {...form.register('degree')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Bachelor of Science in Computer Science"
          />
          {form.formState.errors.degree && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.degree.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">University *</label>
          <input
            type="text"
            {...form.register('university')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="University name"
          />
          {form.formState.errors.university && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.university.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Duration *</label>
          <input
            type="text"
            {...form.register('duration')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2018 - 2022"
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
            placeholder="Berkeley, CA"
          />
          {form.formState.errors.location && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.location.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">GPA</label>
          <input
            type="text"
            {...form.register('gpa')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="3.8/4.0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          {...form.register('description')}
          rows={4}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Description of your studies and focus areas"
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
          placeholder="https://example.com/university-logo.png"
        />
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">Key Achievements *</label>
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
            <input
              {...form.register(`achievements.${index}`)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Achievement or honor"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeAchievement(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.achievements && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.achievements.message}</p>
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