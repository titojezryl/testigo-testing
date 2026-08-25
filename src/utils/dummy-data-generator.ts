import type { User, PaginatedResponse } from '~/api-services/types';

export const generateDummyUsers = (page: number, limit: number, search?: string): PaginatedResponse<User> => {
  const allUsers: User[] = Array.from({ length: 125 }, (_, i) => {
    const id = i;
    return {
      id: `user-${id}`,
      firstName: `First${id}`,
      lastName: `Last${id}`,
      email: `user${id}@example.com`,
      emailVerified: Math.random() > 0.3,
      role: ['super_admin', 'admin', 'guest'][Math.floor(Math.random() * 3)] as User['role'],
      status: ['active', 'suspended'][Math.floor(Math.random() * 2)] as User['status'],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Filter by search if provided (client-side for dummy data)
  let filteredUsers = allUsers;
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filteredUsers = allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const data = filteredUsers.slice(startIndex, startIndex + (limit || 10));

  return {
    data,
    total,
    page,
    limit: limit || 10,
    totalPages,
  };
};
