import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Upload, X, FileText, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormField';
import { resumeSchema, type ResumeFormData } from '../types/admin';
import { resumeService } from '../lib/adminService';
import toast from 'react-hot-toast';

interface ResumeFormProps {
  initialData?: ResumeFormData;
  onSave?: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({
  initialData,
  onSave
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || {
      file_url: '',
      file_name: 'Victory Johnson - Software Engineer Resume.pdf',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setUploadedFile(file);
      form.setValue('file_url', URL.createObjectURL(file));
      form.setValue('file_name', file.name);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    form.setValue('file_url', '');
    form.setValue('file_name', '');
  };

  const onSubmit = async (data: ResumeFormData) => {
    try {
      await resumeService.update(data);
      toast.success('Resume updated successfully!');
      onSave?.();
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  const previewData = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Resume Management</h3>
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
          <h4 className="text-lg font-semibold text-text mb-4">Resume Preview</h4>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h5 className="text-text font-medium">{previewData.file_name || 'Resume.pdf'}</h5>
              <p className="text-text-muted text-sm">
                Last updated: {previewData.updated_at ? new Date(previewData.updated_at).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
            {previewData.file_url && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(previewData.file_url, '_blank')}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Resume File</label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <FormInput
                label=""
                type="url"
                {...form.register('file_url')}
                placeholder="https://example.com/resume.pdf"
                className="mt-0"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('resume-upload')?.click()}
              className="flex items-center h-[50px] mt-0"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {uploadedFile && (
          <div className="flex items-center space-x-4 p-4 bg-bg-light/5 border border-border/50 rounded-xl">
            <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-text font-medium">{uploadedFile.name}</p>
              <p className="text-text-muted text-sm">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeFile}
              className="text-error hover:text-error/80 border-error/30 hover:bg-error/10 hover:border-error"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div>
          <FormInput
            label="Filename"
            {...form.register('file_name')}
            error={form.formState.errors.file_name}
            required
            placeholder="Victory Johnson - Software Engineer Resume.pdf"
          />
        </div>

        <div>
          <FormInput
            label="Last Updated"
            type="date"
            {...form.register('updated_at')}
          />
        </div>

        <div className="bg-bg-light/5 backdrop-blur-sm p-4 rounded-xl border border-border/50">
          <h4 className="text-sm font-medium text-text mb-2">Resume Guidelines</h4>
          <ul className="text-sm text-text-muted space-y-1">
            <li>• Format: PDF only</li>
            <li>• File size: Maximum 5MB</li>
            <li>• Include: Contact info, experience, education, skills</li>
            <li>• Keep it professional and up-to-date</li>
            <li>• Use clear, readable fonts</li>
            <li>• Include relevant keywords for ATS systems</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Resume
          </Button>
        </div>
      </form>
    </div>
  );
}; 