import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
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
        <h3 className="text-lg font-semibold text-white">Profile Image Management</h3>
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
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Preview</h4>
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
              {previewData.image ? (
                <img
                  src={previewData.image}
                  alt={previewData.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-sm">No image</p>
                </div>
              )}
            </div>
            <div>
              <h5 className="text-white font-medium">{previewData.alt}</h5>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
          <ImageUpload
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
            currentImage={form.watch('image')}
            placeholder="Drag & drop your profile image here or click to browse"
            maxSize={2}
          />
          {form.formState.errors.image && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.image.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Alt Text *</label>
          <input
            type="text"
            {...form.register('alt')}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Victory Johnson - Software Engineer"
          />
          {form.formState.errors.alt && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.alt.message}</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Image Guidelines</h4>
          <ul className="text-sm text-gray-400 space-y-1">
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