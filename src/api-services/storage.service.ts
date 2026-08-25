import { apiClient } from './client';

export interface FileMetadata {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  expiresAt?: string;
}

export interface PresignedUploadUrl {
  uploadUrl: string;
  key: string;
}

export interface GetFilesParams {
  prefix?: string;
  limit?: number;
  marker?: string;
}

export class StorageService {
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn?: number
  ): Promise<PresignedUploadUrl> {
    const response = await apiClient.post<PresignedUploadUrl>('/storage/presigned-url', {
      key,
      contentType,
      expiresIn,
    });
    return response.data;
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<FileMetadata> {
    const key = `uploads/${Date.now()}_${file.name}`;
    const { uploadUrl } = await this.getPresignedUploadUrl(key, file.type);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const metadata = await this.getFileMetadata(key);
    return metadata;
  }

  async getFileMetadata(key: string): Promise<FileMetadata> {
    const response = await apiClient.get<FileMetadata>(`/storage/files/${encodeURIComponent(key)}`);
    return response.data;
  }

  async getFiles(params?: GetFilesParams): Promise<FileMetadata[]> {
    const response = await apiClient.get<FileMetadata[]>('/storage/files', { params });
    return response.data;
  }

  async getDownloadUrl(key: string, expiresIn?: number): Promise<string> {
    const response = await apiClient.get<{ url: string }>('/storage/download-url', {
      params: {
        key,
        expiresIn,
      },
    });
    return response.data.url;
  }

  async deleteFile(key: string): Promise<void> {
    await apiClient.delete(`/storage/files/${encodeURIComponent(key)}`);
  }

  async validateFile(file: File, allowedTypes?: string[], maxSizeInMB?: number): Promise<boolean> {
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    if (maxSizeInMB && file.size > maxSizeInMB * 1024 * 1024) {
      throw new Error(`File size exceeds ${maxSizeInMB}MB limit`);
    }

    return true;
  }
}

export const storageService = new StorageService();
