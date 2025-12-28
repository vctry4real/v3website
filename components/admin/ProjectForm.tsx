import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { ImageUpload } from '../ui/ImageUpload';
import { projectSchema, type ProjectFormData } from '../types/admin';
import { projectService, type ProjectData } from '../lib/adminService';
import { imageUploadService, type UploadResult } from '../lib/imageUploadService';
import { generateSlug } from '../lib/utils';
import toast from 'react-hot-toast';

interface ProjectFormProps {
  initialData?: ProjectFormData;
  editingItem?: ProjectData;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  editingItem,
  onSave,
  onCancel
}) => {
  const [isEditing, setIsEditing] = useState(!!editingItem);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      content: '',
      category: 'fullstack' as const,
      tags: [],
      tech: [''],
      github: '',
      live: '',
      featured: false,
      image: '',
      screenshots: [],
      role: '',
      contributions: [''],
      analytics: {
        linesOfCode: 0,
        uptime: '',
        users: 0,
        performance: '',
      },
    },
  });

  const tech = form.watch('tech') || [''];
  const contributions = form.watch('contributions') || [''];
  const tags = form.watch('tags') || [];
  const screenshots = form.watch('screenshots') || [];

  const addTech = () => {
    form.setValue('tech', [...tech, '']);
  };

  const removeTech = (index: number) => {
    form.setValue('tech', tech.filter((_, i) => i !== index));
  };

  const addContribution = () => {
    form.setValue('contributions', [...contributions, '']);
  };

  const removeContribution = (index: number) => {
    form.setValue('contributions', contributions.filter((_, i) => i !== index));
  };

  const addTag = () => {
    form.setValue('tags', [...tags, '']);
  };

  const removeTag = (index: number) => {
    form.setValue('tags', tags.filter((_, i) => i !== index));
  };

  const appendScreenshot = (url: string) => {
    form.setValue('screenshots', [...screenshots, url]);
  };

  const removeScreenshot = (index: number) => {
    form.setValue('screenshots', screenshots.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (editingItem) {
      form.reset({
        title: editingItem.title,
        description: editingItem.description,
        content: editingItem.content,
        category: editingItem.category,
        tags: editingItem.tags || [],
        tech: editingItem.tech.length > 0 ? editingItem.tech : [''],
        github: editingItem.github || '',
        live: editingItem.live || '',
        featured: editingItem.featured,
        image: editingItem.image || '',
        screenshots: editingItem.screenshots || [],
        role: editingItem.role,
        contributions: editingItem.contributions.length > 0 ? editingItem.contributions : [''],
        analytics: editingItem.analytics || {
          linesOfCode: 0,
          uptime: '',
          users: 0,
          performance: '',
        },
      });
      setUploadedImages(editingItem.screenshots || []);
    } else if (initialData) {
      form.reset(initialData);
    }
  }, [editingItem, initialData, form]);

  const handleMainImageUpload = (result: UploadResult) => {
    form.setValue('image', result.url);
  };

  const handleMainImageRemove = () => {
    form.setValue('image', '');
  };

  const handleScreenshotUpload = (result: UploadResult) => {
    appendScreenshot(result.url);
  };

  const handleScreenshotRemove = (index: number) => {
    removeScreenshot(index);
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Generate slug from title if not provided
      const filteredTech = data.tech.filter(t => t.trim() !== '');
      const filteredContributions = data.contributions.filter(c => c.trim() !== '');
      const filteredTags = (data.tags || []).filter(t => t.trim() !== '');

      const projectData = {
        ...data,
        tech: filteredTech.length > 0 ? filteredTech : [''],
        contributions: filteredContributions.length > 0 ? filteredContributions : [''],
        tags: filteredTags,
        slug: data.slug || generateSlug(data.title),
      };

      if (isEditing && editingItem?.id) {
        await projectService.update(editingItem.id, projectData);
        toast.success('Project updated successfully!');
      } else {
        await projectService.create(projectData);
        toast.success('Project added successfully!');
      }
      form.reset();
      setIsEditing(false);
      setUploadedImages([]);
      onSave?.();
    } catch (error) {
      console.error('Project save error:', error);
      toast.error('Failed to save project');
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    setUploadedImages([]);
    onCancel?.();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
          <input
            type="text"
            {...form.register('title')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="E-Commerce Platform"
          />
          {form.formState.errors.title && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
          <select
            {...form.register('category')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            <option value="fullstack">Fullstack</option>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
          </select>
          {form.formState.errors.category && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">Project Tags</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTag}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </Button>
        </div>
        {tags.map((_, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              {...form.register(`tags.${index}`)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="web application, api, dashboard, etc."
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeTag(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <p className="text-sm text-gray-400 mt-2">
          Add flexible tags like "web application", "api", "dashboard", "mobile app", etc.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Short Description *</label>
        <input
          type="text"
          {...form.register('description')}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of the project"
        />
        {form.formState.errors.description && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Content *</label>
        <textarea
          {...form.register('content')}
          rows={6}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Detailed description of the project, features, and implementation details..."
        />
        {form.formState.errors.content && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
          <input
            type="url"
            {...form.register('github')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/username/project"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Live Demo URL</label>
          <input
            type="url"
            {...form.register('live')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://project-demo.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Role *</label>
        <input
          type="text"
          {...form.register('role')}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Full-Stack Developer, Lead Developer, etc."
        />
        {form.formState.errors.role && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.role.message}</p>
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
            onClick={addTech}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Technology
          </Button>
        </div>
        {tech.map((_, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              {...form.register(`tech.${index}`)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, TypeScript, Node.js"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeTech(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.tech && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.tech.message}</p>
        )}
      </div>

      {/* Contributions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-300">Key Contributions *</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addContribution}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contribution
          </Button>
        </div>
        {contributions.map((_, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              {...form.register(`contributions.${index}`)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Key contribution or achievement"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeContribution(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {form.formState.errors.contributions && (
          <p className="text-red-400 text-sm mt-1">{form.formState.errors.contributions.message}</p>
        )}
      </div>

      {/* Analytics */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Project Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lines of Code</label>
            <input
              type="number"
              {...form.register('analytics.linesOfCode', { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Uptime</label>
            <input
              type="text"
              {...form.register('analytics.uptime')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="99.9%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Active Users</label>
            <input
              type="number"
              {...form.register('analytics.users', { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Performance Score</label>
            <input
              type="text"
              {...form.register('analytics.performance')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="95/100"
            />
          </div>
        </div>
      </div>

      {/* Main Project Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Main Project Image</label>
        <ImageUpload
          onUpload={handleMainImageUpload}
          onRemove={handleMainImageRemove}
          currentImage={form.watch('image')}
          placeholder="Drag & drop your main project image here or click to browse"
          maxSize={2}
        />
      </div>

      {/* Project Screenshots */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Screenshots</label>
        <ImageUpload
          onUpload={handleScreenshotUpload}
          multiple={true}
          maxFiles={5}
          placeholder="Drag & drop project screenshots here or click to browse"
          maxSize={2}
        />

        {/* Display current screenshots */}
        {screenshots.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Current Screenshots:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {screenshots.map((screenshot: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleScreenshotRemove(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...form.register('featured')}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm font-medium text-gray-300">Featured Project</span>
        </label>
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Update Project' : 'Add Project'}
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