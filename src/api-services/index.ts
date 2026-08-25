// Export all services and types for easy imports
export * from './client';
export * from './types';
export * from './auth.service';
export * from './user.service';
export * from './storage.service';

// Re-export main API client
export { apiClient } from './client';