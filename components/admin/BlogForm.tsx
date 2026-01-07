import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X, Eye, EyeOff, ArrowLeft, Type, FileText, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput, FormTextarea, FormSelect } from '../ui/FormField';
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
          <h3 className="text-lg font-semibold text-text">Blog Post Form</h3>
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
        <div className="bg-bg-light/5 backdrop-blur-sm p-6 rounded-xl border border-border/50 max-w-full overflow-hidden">
          <h4 className="text-lg font-semibold text-text mb-4">Preview</h4>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-text wrap-break-word">{previewData.title || 'Blog Post Title'}</h2>
              <div className="flex flex-wrap items-center gap-2 text-text-muted text-sm mt-2">
                <span>By Victory Johnson</span>
                <span>•</span>
                <span>{previewData.readTime || '5 min read'}</span>
                {previewData.published && <span>• Published</span>}
              </div>
            </div>
            <p className="text-text-secondary wrap-break-word">{previewData.summary || 'Blog post summary...'}</p>
            {previewData.tags && previewData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewData.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-primary text-white text-sm rounded-full wrap-break-word">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-invert max-w-none overflow-hidden">
              <div className="text-text-secondary whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere">{previewData.content || 'Blog content will appear here...'}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-text">Blog Post Form</h3>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="min-w-0">
            <FormInput
              label="Post Title"
              {...form.register('title')}
              onChange={handleTitleChange}
              error={form.formState.errors.title}
              required
              placeholder="Building Scalable React Applications"
            />
          </div>
          <div className="min-w-0">
            <FormInput
              label="Slug"
              {...form.register('slug')}
              error={form.formState.errors.slug}
              required
              placeholder="building-scalable-react-applications"
            />
          </div>
        </div>

        <div className="min-w-0">
          <FormTextarea
            label="Summary"
            {...form.register('summary')}
            error={form.formState.errors.summary}
            required
            rows={3}
            placeholder="Brief summary of the blog post..."
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
            <label className="block text-sm font-medium text-text-secondary">Content *</label>
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
            <p className="text-red-400 text-sm mt-1 wrap-break-word">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="min-w-0">
            <FormInput
              label="Cover Image URL"
              type="url"
              {...form.register('coverImage')}
              placeholder="https://example.com/cover-image.jpg"
              className="break-all"
            />
          </div>
          <div className="min-w-0">
            <FormInput
              label="Read Time"
              {...form.register('readTime')}
              placeholder="5 min read"
            />
          </div>
          <div className="min-w-0">
            <FormSelect
              label="Published Status"
              {...form.register('published', {
                setValueAs: (value) => value === 'true'
              })}
              options={[
                { value: 'false', label: 'Draft' },
                { value: 'true', label: 'Published' }
              ]}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <label className="block text-sm font-medium text-text-secondary">Tags *</label>
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
              <FormInput
                label=""
                {...form.register(`tags.${index}` as const)}
                className="flex-1 min-w-0"
                placeholder="React, TypeScript, Web Development"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTag(index)}
                className="text-error hover:text-error/80 border-error/30 hover:bg-error/10 hover:border-error shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {form.formState.errors.tags && (
            <p className="text-error text-sm mt-1 wrap-break-word">
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
                className="w-4 h-4 text-primary bg-surface-muted border-border-muted rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm font-medium text-text-secondary">Featured Post</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            className="flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Blog Post' : 'Add Blog Post'}
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