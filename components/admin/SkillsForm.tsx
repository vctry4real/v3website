import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { skillsSchema, type SkillsFormData } from '../types/admin';
import { skillsService, type SkillData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface SkillsFormProps {
  initialData?: SkillsFormData;
  editingItem?: SkillData;
  onSave?: () => void;
  onCancel?: () => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ 
  initialData, 
  editingItem, 
  onSave, 
  onCancel 
}) => {
  const [isEditing, setIsEditing] = useState(!!editingItem);

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: initialData || {
      name: '',
      category: '',
      level: 50,
      order_index: 0,
    },
  });

  useEffect(() => {
    if (editingItem) {
      form.reset({
        name: editingItem.name,
        category: editingItem.category,
        level: editingItem.level,
        order_index: editingItem.order_index || 0,
      });
    } else if (initialData) {
      form.reset(initialData);
    }
  }, [editingItem, initialData, form]);

  const onSubmit = async (data: SkillsFormData) => {
    try {
      if (isEditing && editingItem?.id) {
        await skillsService.update(editingItem.id, data);
        toast.success('Skill updated successfully!');
      } else {
        await skillsService.create(data);
        toast.success('Skill added successfully!');
      }
      form.reset();
      setIsEditing(false);
      onSave?.();
    } catch (error) {
      toast.error('Failed to save skill');
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name *</label>
          <input
            type="text"
            {...form.register('name')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., React, Node.js, Python"
          />
          {form.formState.errors.name && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
          <select
            {...form.register('category')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="tools">Tools & DevOps</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
          {form.formState.errors.category && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Skill Level *</label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              {...form.register('level', { valueAsNumber: true })}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>Beginner</span>
              <span className="font-medium text-blue-400">{form.watch('level')}%</span>
              <span>Expert</span>
            </div>
          </div>
          {form.formState.errors.level && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.level.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Display Order *</label>
          <input
            type="number"
            min="0"
            {...form.register('order_index', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          {form.formState.errors.order_index && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.order_index.message}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Update Skill' : 'Add Skill'}
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