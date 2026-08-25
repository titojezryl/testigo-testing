import { apiClient } from './client';
import type {
  User,
  PaginatedResponse,
  UpdateProfileRequest,
  GetUsersParams,
  CreateUserInput,
  UpdateUserInput,
} from './types';

export class UserService {
  async getUsers(params?: GetUsersParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  }

  async updateUser(userId: string, data: UpdateUserInput): Promise<User> {
    const response = await apiClient.put<User>(`/users/${userId}`, data);
    return response.data;
  }

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/profile`, data);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users/search', {
      params: { q: query },
    });
    return response.data;
  }

  async updateAvatar(userId: string, file: File): Promise<User> {
    const response = await apiClient.upload<User>(`/users/${userId}/avatar`, file);
    return response.data;
  }
}

export const userService = new UserService();
