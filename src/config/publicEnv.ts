export const publicEnv = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  AUTH_PROVIDER_URL: import.meta.env.VITE_AUTH_PROVIDER_URL || 'https://your-auth-provider.com',
  AUTH_CLIENT_ID: import.meta.env.VITE_AUTH_CLIENT_ID,
  AUTH_CALLBACK_URL: import.meta.env.VITE_AUTH_CALLBACK_URL || 'http://localhost:3000/auth/callback',
  STORAGE_BASE_URL: import.meta.env.VITE_STORAGE_BASE_URL || 'https://your-storage-service.com',
  STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
};
