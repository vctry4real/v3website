export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

export interface ImageUploadResult {
  url: string;
  success: boolean;
  error?: string;
}

export class ImageUploadService {
  /**
   * Upload image to server and get URL
   * @param file - The image file to upload
   * @returns Promise with upload result
   */
  static async uploadToServer(file: File): Promise<ImageUploadResult> {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Missing Cloudinary configuration (Cloud Name or Upload Preset)');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        url: result.secure_url,
        success: true,
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      return {
        url: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Convert image to base64 for local storage
   * @param file - The image file to convert
   * @returns Promise with base64 result
   */
  static async convertToBase64(file: File): Promise<ImageUploadResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          resolve({
            url: result,
            success: true,
          });
        } else {
          resolve({
            url: '',
            success: false,
            error: 'Failed to convert image to base64',
          });
        }
      };

      reader.onerror = () => {
        resolve({
          url: '',
          success: false,
          error: 'Failed to read image file',
        });
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload image with fallback to base64
   * @param file - The image file to upload
   * @param useServerUpload - Whether to try server upload first
   * @returns Promise with upload result
   */
  static async uploadImage(file: File, useServerUpload: boolean = false): Promise<ImageUploadResult> {
    // Validate file
    if (!file) {
      return {
        url: '',
        success: false,
        error: 'No file provided',
      };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        url: '',
        success: false,
        error: 'Image size must be less than 5MB',
      };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        url: '',
        success: false,
        error: 'Please select a valid image file',
      };
    }

    // Try server upload first if enabled
    if (useServerUpload) {
      const serverResult = await this.uploadToServer(file);
      if (serverResult.success) {
        return serverResult;
      }
      // Fall back to base64 if server upload fails
    }

    // Convert to base64
    return await this.convertToBase64(file);
  }

  /**
   * Get image dimensions from file
   * @param file - The image file
   * @returns Promise with image dimensions
   */
  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Compress image if needed
   * @param file - The image file to compress
   * @param maxWidth - Maximum width
   * @param maxHeight - Maximum height
   * @param quality - JPEG quality (0-1)
   * @returns Promise with compressed file
   */
  static async compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = URL.createObjectURL(file);
    });
  }
  /**
   * Validate image file
   * @param file - The file to validate
   * @returns Validation result
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Please select a valid image file' };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, error: 'Image size must be less than 5MB' };
    }

    return { isValid: true };
  }

  /**
   * Upload multiple images
   * @param files - Array of files to upload
   * @param onProgress - Callback for upload progress
   * @returns Promise with array of upload results
   */
  static async uploadMultipleImages(
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ImageUploadResult[]> {
    const totalFiles = files.length;
    const results: ImageUploadResult[] = [];
    let completedFiles = 0;

    if (onProgress) {
      onProgress({
        progress: 0,
        status: 'uploading',
        message: `Starting upload of ${totalFiles} images...`,
      });
    }

    for (const file of files) {
      try {
        const result = await this.uploadImage(file);
        results.push(result);
        completedFiles++;

        if (onProgress) {
          const progress = Math.round((completedFiles / totalFiles) * 100);
          onProgress({
            progress,
            status: 'uploading',
            message: `Uploaded ${completedFiles} of ${totalFiles} images...`,
          });
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        results.push({
          url: '',
          success: false,
          error: `Failed to upload ${file.name}`,
        });
      }
    }

    if (onProgress) {
      onProgress({
        progress: 100,
        status: 'success',
        message: 'All uploads completed',
      });
    }

    return results;
  }
}

export const imageUploadService = new ImageUploadService();