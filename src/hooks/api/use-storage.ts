import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storageService, type GetFilesParams } from '~/api-services';
import { toast } from 'sonner';

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
      storageService.uploadFile(file, onProgress),
    onSuccess: (metadata) => {
      toast.success('File uploaded successfully');
      return metadata;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload file');
      throw error;
    },
  });
}

export function useFiles(params?: GetFilesParams) {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => storageService.getFiles(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useFileMetadata(key: string) {
  return useQuery({
    queryKey: ['file', key],
    queryFn: () => storageService.getFileMetadata(key),
    enabled: !!key,
  });
}

export function useDownloadUrl() {
  return useMutation({
    mutationFn: ({ key, expiresIn }: { key: string; expiresIn?: number }) =>
      storageService.getDownloadUrl(key, expiresIn),
  });
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: (key: string) => storageService.deleteFile(key),
    onSuccess: () => {
      toast.success('File deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete file');
    },
  });
}

export function useValidateFile() {
  return useMutation({
    mutationFn: ({
      file,
      allowedTypes,
      maxSizeInMB,
    }: {
      file: File;
      allowedTypes?: string[];
      maxSizeInMB?: number;
    }) => storageService.validateFile(file, allowedTypes, maxSizeInMB),
  });
}

export function useGetPresignedUploadUrl() {
  return useMutation({
    mutationFn: (data: { key: string; contentType: string; expiresIn?: number }) =>
      storageService.getPresignedUploadUrl(data.key, data.contentType, data.expiresIn),
  });
}

export function useUploadWithProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      const key = `uploads/${Date.now()}_${file.name}`;
      const { uploadUrl } = await storageService.getPresignedUploadUrl(key, file.type);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status === 200) {
            try {
              const metadata = await storageService.getFileMetadata(key);
              queryClient.invalidateQueries({ queryKey: ['files'] });
              resolve(metadata);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    },
    onSuccess: () => {
      toast.success('File uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload file');
    },
  });
}
