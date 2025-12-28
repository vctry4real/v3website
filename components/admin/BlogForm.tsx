import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus, X, Eye, EyeOff, ArrowLeft, Type, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../ui/RichTextEditor';
import { MarkdownEditor } from '../ui/MarkdownEditor';
import { blogSchema, type BlogFormData } from '../types/admin';
import { blogService, type BlogData } from '../lib/adminService';
import toast from 'react-hot-toast';

interface BlogFormProps {
  initialData?: BlogFormData;
  editingItem?: BlogData;
  onSave?: () => void;
  onCancel?: () => void;
  onBackToList?: () => void;
}

export const BlogForm: React.FC<BlogFormProps> = ({ 
  initialData, 
  editingItem, 
  onSave, 
  onCancel,
  onBackToList
}) => {
  const [isEditing, setIsEditing] = useState(!!editingItem);
  const [showPreview, setShowPreview] = useState(false);
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      summary: '',
      content: '',
      tags: [''],
      coverImage: '',
      featured: false,
      published: false,
      readTime: '5 min read',
    },
    mode: 'onChange', // Enable real-time validation
  });

  // Tags management helpers
  const tags = form.watch("tags") || [];
  
  const addTag = () => form.setValue("tags", [...tags, ""]);
  const removeTag = (index: number) =>
    form.setValue(
      "tags",
      tags.filter((_, i) => i !== index)
    );

  useEffect(() => {
    if (editingItem) {
      form.reset({
        title: editingItem.title,
        slug: editingItem.slug,
        summary: editingItem.summary,
        content: editingItem.content,
        tags: editingItem.tags.length > 0 ? editingItem.tags : [''],
        coverImage: editingItem.coverImage || '',
        featured: editingItem.featured,
        published: editingItem.published,
        readTime: editingItem.readTime || '5 min read',
      });
    } else if (initialData) {
      form.reset(initialData);
    }
  }, [editingItem, initialData, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    if (!isEditing) {
      form.setValue('slug', generateSlug(title));
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    console.log('onSubmit function called!');
    try {
      // Filter out empty tags and ensure at least one tag exists
      const filteredTags = data.tags.filter(tag => tag.trim() !== '');
      if (filteredTags.length === 0) {
        toast.error('At least one tag is required');
        return;
      }
      
      const cleanedData = {
        ...data,
        tags: filteredTags,
        published: Boolean(data.published), // Ensure boolean type
        featured: Boolean(data.featured)    // Ensure boolean type
      };
      
      console.log('Submitting blog data:', cleanedData);
      console.log('Form errors:', form.formState.errors);
      
      if (isEditing && editingItem?.id) {
        await blogService.update(editingItem.id, cleanedData);
        toast.success('Blog post updated successfully!');
      } else {
        await blogService.create(cleanedData);
        toast.success('Blog post added successfully!');
      }
      form.reset();
      setIsEditing(false);
      onSave?.();
    } catch (error) {
      console.error('Blog submission error:', error);
      toast.error('Failed to save blog post');
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    onCancel?.();
  };

  const previewData = form.watch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {onBackToList && (
            <Button
              type="button"
              variant="outline"
              onClick={onBackToList}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          )}
          <h3 className="text-lg font-semibold text-white">Blog Post Form</h3>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center"
        >
          {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      {showPreview && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-full overflow-hidden">
          <h4 className="text-lg font-semibold text-white mb-4">Preview</h4>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white break-words">{previewData.title || 'Blog Post Title'}</h2>
              <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm mt-2">
                <span>By Victory Johnson</span>
                <span>•</span>
                <span>{previewData.readTime || '5 min read'}</span>
                {previewData.published && <span>• Published</span>}
              </div>
            </div>
            <p className="text-gray-300 break-words">{previewData.summary || 'Blog post summary...'}</p>
            {previewData.tags && previewData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewData.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full break-words">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-invert max-w-none overflow-hidden">
              <div className="text-gray-300 whitespace-pre-wrap break-words overflow-wrap-anywhere">{previewData.content || 'Blog content will appear here...'}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Blog Post Form</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log('Form state:', form.formState);
              console.log('Form values:', form.getValues());
              console.log('Form errors:', form.formState.errors);
            }}
            className="flex items-center"
          >
            Debug Form
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-300 mb-2">Post Title *</label>
            <input
              type="text"
              {...form.register('title')}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent break-words"
              placeholder="Building Scalable React Applications"
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-sm mt-1 break-words">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
            <input
              type="text"
              {...form.register('slug')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent break-all"
              placeholder="building-scalable-react-applications"
            />
            {form.formState.errors.slug && (
              <p className="text-red-400 text-sm mt-1 break-words">{form.formState.errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <label className="block text-sm font-medium text-gray-300 mb-2">Summary *</label>
          <textarea
            {...form.register('summary')}
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none break-words"
            placeholder="Brief summary of the blog post..."
          />
          {form.formState.errors.summary && (
            <p className="text-red-400 text-sm mt-1 break-words">{form.formState.errors.summary.message}</p>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
            <label className="block text-sm font-medium text-gray-300">Content *</label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={editorMode === 'rich' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setEditorMode('rich')}
                className="flex items-center"
              >
                <Type className="w-4 h-4 mr-1" />
                Rich Text
              </Button>
              <Button
                type="button"
                variant={editorMode === 'markdown' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setEditorMode('markdown')}
                className="flex items-center"
              >
                <FileText className="w-4 h-4 mr-1" />
                Markdown
              </Button>
            </div>
          </div>
          
          <div className="max-w-full overflow-hidden">
            {editorMode === 'rich' ? (
              <RichTextEditor
                value={form.watch('content')}
                onChange={(value) => form.setValue('content', value)}
                placeholder="Write your blog post content here..."
              />
            ) : (
              <MarkdownEditor
                value={form.watch('content')}
                onChange={(value) => form.setValue('content', value)}
                placeholder="Write your markdown content here..."
              />
            )}
          </div>
          
          {form.formState.errors.content && (
            <p className="text-red-400 text-sm mt-1 break-words">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
            <input
              type="url"
              {...form.register('coverImage')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent break-all"
              placeholder="https://example.com/cover-image.jpg"
            />
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-300 mb-2">Read Time</label>
            <input
              type="text"
              {...form.register('readTime')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5 min read"
            />
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-300 mb-2">Published</label>
            <select
              {...form.register('published', { 
                setValueAs: (value) => value === 'true' 
              })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="false">Draft</option>
              <option value="true">Published</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <label className="block text-sm font-medium text-gray-300">Tags *</label>
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

          {tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                {...form.register(`tags.${index}` as const)}
                className="flex-1 min-w-0 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, TypeScript, Web Development"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTag(index)}
                className="text-red-400 hover:text-red-300 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {form.formState.errors.tags && (
            <p className="text-red-400 text-sm mt-1 break-words">
              {form.formState.errors.tags.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...form.register('featured')}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-300">Featured Post</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="submit" 
            className="flex items-center justify-center"
            onClick={() => console.log('Submit button clicked!')}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Blog Post' : 'Add Blog Post'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="flex items-center justify-center"
            onClick={() => {
              console.log('Test button clicked!');
              const values = form.getValues();
              console.log('Form values:', values);
              console.log('Form is valid:', form.formState.isValid);
              console.log('Form errors:', form.formState.errors);
              console.log('Form dirty fields:', form.formState.dirtyFields);
              console.log('Form touched fields:', form.formState.touchedFields);
              
              // Manual validation check
              console.log('Manual validation:');
              console.log('- title length:', values.title?.length);
              console.log('- slug length:', values.slug?.length);
              console.log('- summary length:', values.summary?.length);
              console.log('- content length:', values.content?.length);
              console.log('- tags:', values.tags);
              console.log('- tags filtered:', values.tags?.filter(tag => tag.trim() !== ''));
              console.log('- published type:', typeof values.published);
              console.log('- published value:', values.published);
            }}
          >
            Test Button
          </Button>
          {isEditing && (
            <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center justify-center">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};