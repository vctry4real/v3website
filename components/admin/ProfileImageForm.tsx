import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormField';
import { ImageUpload } from '../ui/ImageUpload';
import { profileImageSchema, type ProfileImageFormData } from '../types/admin';
import { profileImageService } from '../lib/adminService';
import { imageUploadService, type UploadResult } from '../lib/imageUploadService';
import toast from 'react-hot-toast';

interface ProfileImageFormProps {
  initialData?: ProfileImageFormData;
  onSave?: () => void;
}

export const ProfileImageForm: React.FC<ProfileImageFormProps> = ({
  initialData,
  onSave
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<ProfileImageFormData>({
    resolver: zodResolver(profileImageSchema),
    defaultValues: initialData || {
      image: '',
      alt: 'Victory Johnson - Software Engineer',
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleImageUpload = (result: UploadResult) => {
    form.setValue('image', result.url);
  };

  const handleImageRemove = () => {
    form.setValue('image', '');
  };

  const onSubmit = async (data: ProfileImageFormData) => {
    try {
      await profileImageService.update(data);
      toast.success('Profile image updated successfully!');
      onSave?.();
    } catch (error) {
      toast.error('Failed to save profile image');
    }
  };

  const previewData = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Profile Image Management</h3>
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
        <div className="bg-bg-light/5 backdrop-blur-sm p-6 rounded-xl border border-border/50">
          <h4 className="text-lg font-semibold text-text mb-4">Preview</h4>
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-muted flex items-center justify-center border border-border/50">
              {previewData.image ? (
                <img
                  src={previewData.image}
                  alt={previewData.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-text-muted text-center">
                  <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-sm">No image</p>
                </div>
              )}
            </div>
            <div>
              <h5 className="text-text font-medium">{previewData.alt}</h5>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Profile Image</label>
          <ImageUpload
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
            currentImage={form.watch('image')}
            placeholder="Drag & drop your profile image here or click to browse"
            maxSize={2}
          />
          {form.formState.errors.image && (
            <p className="text-error text-sm mt-1">{form.formState.errors.image.message}</p>
          )}
        </div>

        <div>
          <FormInput
            label="Alt Text"
            {...form.register('alt')}
            error={form.formState.errors.alt}
            required
            placeholder="Victory Johnson - Software Engineer"
          />
        </div>

        <div className="bg-bg-light/5 backdrop-blur-sm p-4 rounded-xl border border-border/50">
          <h4 className="text-sm font-medium text-text mb-2">Image Guidelines</h4>
          <ul className="text-sm text-text-muted space-y-1">
            <li>• Recommended size: 400x400 pixels or larger</li>
            <li>• Format: JPG, PNG, or WebP</li>
            <li>• File size: Under 2MB</li>
            <li>• Professional headshot or portrait style</li>
            <li>• Good lighting and clear background</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Profile Image
          </Button>
        </div>
      </form>
    </div>
  );
}; 