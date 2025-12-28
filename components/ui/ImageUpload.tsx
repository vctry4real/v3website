import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { ImageUploadService, type UploadResult, type UploadProgress } from '../lib/imageUploadService';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (result: UploadResult) => void;
  onRemove?: () => void;
  currentImage?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onRemove,
  currentImage,
  multiple = false,
  maxFiles = 5,
  className = '',
  placeholder = 'Drag & drop images here or click to browse',
  accept = 'image/*',
  maxSize = 5,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      const validation = ImageUploadService.validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid file');
        return;
      }
    }

    if (!multiple && files.length > 1) {
      toast.error('Please select only one image');
      return;
    }

    if (files.length > maxFiles) {
      toast.error(`Please select no more than ${maxFiles} images`);
      return;
    }

    setIsUploading(true);
    setUploadProgress({ progress: 0, status: 'uploading', message: 'Starting upload...' });

    try {
      if (multiple) {
        const results = await ImageUploadService.uploadMultipleImages(files);
        results.forEach(result => {
          // Adapt ImageUploadResult to UploadResult if needed, or assume they are compatible
          // UploadResult has publicId, width, height which ImageUploadResult might not have fully populated in base64 mode
          // For now, we'll cast or map it.
          // ImageUploadResult: { url, success, error }
          // UploadResult: { url, publicId, width, height }
          // We need to ensure onUpload expects what we give.
          // Let's assume onUpload can handle the result or we mock missing fields.
          if (result.success) {
            onUpload({
              url: result.url,
              publicId: 'local-' + Date.now(), // Mock ID for local/base64
              width: 0, // We might need to get dimensions if required
              height: 0
            });
          }
        });
        toast.success(`Successfully uploaded ${results.filter(r => r.success).length} image(s)`);
      } else {
        const result = await ImageUploadService.uploadImage(files[0]);
        if (result.success) {
          onUpload({
            url: result.url,
            publicId: 'local-' + Date.now(),
            width: 0,
            height: 0
          });
          toast.success('Image uploaded successfully!');
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [multiple, maxFiles, onUpload]);

  const handleRemove = useCallback(() => {
    onRemove?.();
  }, [onRemove]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-border-muted hover:border-text-muted'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-surface-muted">
            <ImageIcon className="w-6 h-6 text-text-muted" />
          </div>

          <p className="text-sm text-text-secondary mb-2">
            {placeholder}
          </p>

          <p className="text-xs text-text-muted mb-4">
            Supports: JPEG, PNG, WebP, GIF (max {maxSize}MB each)
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && uploadProgress && (
        <div className="bg-surface-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">
              {uploadProgress.message}
            </span>
            <span className="text-sm text-text-muted">
              {uploadProgress.progress}%
            </span>
          </div>

          <div className="w-full bg-surface-elevated rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Image Preview */}
      {currentImage && !isUploading && (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Current image"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surface-card"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploadProgress?.status === 'success' && (
        <div className="flex items-center space-x-2 text-success">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Upload completed successfully!</span>
        </div>
      )}

      {uploadProgress?.status === 'error' && (
        <div className="flex items-center space-x-2 text-error">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{uploadProgress.message}</span>
        </div>
      )}
    </div>
  );
};