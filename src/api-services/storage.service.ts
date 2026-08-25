import { apiClient } from './client';
import { FileUpload, PresignedUploadUrl } from './types';

export class StorageService {
  // Get presigned URL for file upload
  async getPresignedUploadUrl(
    filename: string, 
    contentType: string, 
    folder = 'uploads'
  ): Promise<PresignedUploadUrl> {
    const response = await apiClient.post<PresignedUploadUrl>('/storage/presigned-url', {
      filename,
      contentType,
      folder,
    });
    return response.data;
  }

  // Upload file using presigned URL (direct upload to storage service)
  async uploadFile(
    file: File, 
    folder = 'uploads',
    onProgress?: (progress: number) => void
  ): Promise<FileUpload> {
    // Get presigned URL
    const { uploadUrl, fileUrl } = await this.getPresignedUploadUrl(
      file.name, 
      file.type, 
      folder
    );

    // Upload directly to storage service
    const formData = new FormData();
    formData.append('file', file);

    // For services like S3 that might require additional fields
    const response = await apiClient.upload<{ id: string; url: string }>(
      '/storage/upload',
      file,
      onProgress
    );

    return {
      id: response.data.id,
      name: file.name,
      type: file.type,
      size: file.size,
      url: response.data.url,
      uploadedAt: new Date().toISOString(),
    };
  }

  // Alternative: Upload using presigned URL directly
  async uploadFileDirectly(
    file: File,
    folder = 'uploads',
    onProgress?: (progress: number) => void
  ): Promise<FileUpload> {
    const { uploadUrl, fileUrl } = await this.getPresignedUploadUrl(
      file.name,
      file.type,
      folder
    );

    // Create a separate axios instance for direct upload to storage service
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return {
      id: fileUrl, // Use URL as ID for now
      name: file.name,
      type: file.type,
      size: file.size,
      url: fileUrl,
      uploadedAt: new Date().toISOString(),
    };
  }

  // Get file info
  async getFileInfo(fileId: string): Promise<FileUpload> {
    const response = await apiClient.get<FileUpload>(`/storage/files/${fileId}`);
    return response.data;
  }

  // List files
  async listFiles(folder = 'uploads', page = 1, limit = 20): Promise<{
    files: FileUpload[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      files: FileUpload[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/storage/files?folder=${folder}&page=${page}&limit=${limit}`);
    return response.data;
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`/storage/files/${fileId}`);
  }

  // Generate presigned download URL
  async getDownloadUrl(fileId: string, expiresIn = 3600): Promise<string> {
    const response = await apiClient.get<{ url: string }>(
      `/storage/files/${fileId}/download?expiresIn=${expiresIn}`
    );
    return response.data.url;
  }

  // Get file type validation rules
  async getFileValidationRules(): Promise<{
    allowedTypes: string[];
    maxFileSize: number;
    maxFilesPerUpload: number;
  }> {
    const response = await apiClient.get<{
      allowedTypes: string[];
      maxFileSize: number;
      maxFilesPerUpload: number;
    }>('/storage/validation-rules');
    return response.data;
  }

  // Validate file before upload
  validateFile(file: File, allowedTypes?: string[], maxSize?: number): {
    isValid: boolean;
    error?: string;
  } {
    const types = allowedTypes || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];
    
    const size = maxSize || 10 * 1024 * 1024; // 10MB default

    if (!types.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${types.join(', ')}`,
      };
    }

    if (file.size > size) {
      return {
        isValid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size of ${(size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    return { isValid: true };
  }
}

export const storageService = new StorageService();