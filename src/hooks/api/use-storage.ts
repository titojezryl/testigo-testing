import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storageService } from '~/api-services';

// Query keys
export const storageKeys = {
  all: ['storage'] as const,
  files: () => [...storageKeys.all, 'files'] as const,
  fileList: (filters: { folder?: string; page?: number; limit?: number }) => 
    [...storageKeys.files(), 'list', filters] as const,
  fileInfo: (id: string) => [...storageKeys.files(), 'detail', id] as const,
  validationRules: () => [...storageKeys.all, 'validationRules'] as const,
  downloadUrl: (id: string, expiresIn?: number) => 
    [...storageKeys.files(), id, 'download', expiresIn || 3600] as const,
};

// Hooks
export function useFiles(folder = 'uploads', page = 1, limit = 20) {
  return useQuery({
    queryKey: storageKeys.fileList({ folder, page, limit }),
    queryFn: () => storageService.listFiles(folder, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

export function useFileInfo(fileId: string) {
  return useQuery({
    queryKey: storageKeys.fileInfo(fileId),
    queryFn: () => storageService.getFileInfo(fileId),
    enabled: !!fileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFileValidationRules() {
  return useQuery({
    queryKey: storageKeys.validationRules(),
    queryFn: () => storageService.getFileValidationRules(),
    staleTime: 60 * 60 * 1000, // 1 hour (validation rules don't change often)
  });
}

export function useDownloadUrl(fileId: string, expiresIn = 3600) {
  return useQuery({
    queryKey: storageKeys.downloadUrl(fileId, expiresIn),
    queryFn: () => storageService.getDownloadUrl(fileId, expiresIn),
    enabled: !!fileId,
    staleTime: expiresIn * 0.8 * 1000, // Cache for 80% of the URL expiration time
  });
}

// Mutations
export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      file, 
      folder, 
      onProgress 
    }: { 
      file: File; 
      folder?: string; 
      onProgress?: (progress: number) => void;
    }) => storageService.uploadFile(file, folder, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.files() });
    },
    onError: (error) => {
      console.error('File upload failed:', error);
    },
  });
}

export function useUploadFileDirectly() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      file, 
      folder, 
      onProgress 
    }: { 
      file: File; 
      folder?: string; 
      onProgress?: (progress: number) => void;
    }) => storageService.uploadFileDirectly(file, folder, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.files() });
    },
    onError: (error) => {
      console.error('Direct file upload failed:', error);
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => storageService.deleteFile(fileId),
    onSuccess: (_, fileId) => {
      queryClient.removeQueries({ queryKey: storageKeys.fileInfo(fileId) });
      queryClient.invalidateQueries({ queryKey: storageKeys.files() });
    },
    onError: (error) => {
      console.error('File deletion failed:', error);
    },
  });
}

export function useGetPresignedUploadUrl() {
  return useMutation({
    mutationFn: ({ 
      filename, 
      contentType, 
      folder 
    }: { 
      filename: string; 
      contentType: string; 
      folder?: string;
    }) => storageService.getPresignedUploadUrl(filename, contentType, folder),
    onError: (error) => {
      console.error('Get presigned URL failed:', error);
    },
  });
}

// Utility hook for file validation
export function useFileValidation(allowedTypes?: string[], maxSize?: number) {
  const { data: validationRules } = useFileValidationRules();

  const validateFile = (file: File) => {
    const types = allowedTypes || validationRules?.allowedTypes || [];
    const size = maxSize || validationRules?.maxFileSize || 10 * 1024 * 1024; // 10MB default

    return storageService.validateFile(file, types, size);
  };

  return { validateFile };
}

// Combined hook for common file operations
export function useFileOperations(folder = 'uploads') {
  const queryClient = useQueryClient();

  const filesQuery = useFiles(folder);
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();
  const { validateFile } = useFileValidation();

  const refreshFiles = () => {
    queryClient.invalidateQueries({ queryKey: storageKeys.files() });
  };

  return {
    files: filesQuery.data,
    isLoading: filesQuery.isLoading,
    error: filesQuery.error,
    refreshFiles,
    uploadFile: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    deleteFile: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    validateFile,
  };
}