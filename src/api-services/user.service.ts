import { apiClient } from './client';
import { 
  User, 
  UserProfile, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UpdateProfileRequest,
  PaginatedResponse 
} from './types';

export class UserService {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  }

  async getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  }

  async suspendUser(userId: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/suspend`);
    return response.data;
  }

  async activateUser(userId: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/activate`);
    return response.data;
  }

  async updateUserRole(userId: string, role: 'super_admin' | 'admin' | 'guest'): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/role`, { role });
    return response.data;
  }

  async searchUsers(query: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(
      `/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Profile related methods
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(`/users/${userId}/profile`);
    return response.data;
  }

  async getCurrentUserProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/users/me/profile');
    return response.data;
  }

  async updateUserProfile(userId: string, profileData: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>(`/users/${userId}/profile`, profileData);
    return response.data;
  }

  async updateMyProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>('/users/me/profile', profileData);
    return response.data;
  }

  // Avatar/Profile picture methods
  async uploadAvatar(file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> {
    const response = await apiClient.upload<{ url: string }>('/users/me/avatar', file, onProgress);
    return response.data;
  }

  async removeAvatar(): Promise<void> {
    await apiClient.delete('/users/me/avatar');
  }
}

export const userService = new UserService();