import { eq, and, or, ilike, desc, asc, count, SQL } from "drizzle-orm";
import { database } from "~/db";
import {
  user,
  account,
  type User,
  type UserRole,
  type UserStatus,
  type CreateUserData,
  type UpdateUserData,
} from "~/db/schema";

export async function findUserById(id: string): Promise<User | null> {
  const [result] = await database
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return result || null;
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const userData = await findUserById(userId);
  if (!userData) return null;

  return userData.role;
}

export async function hasUserRole(
  userId: string,
  roles: UserRole | UserRole[]
): Promise<boolean> {
  const userRole = await getUserRole(userId);
  if (!userRole) return false;

  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(userRole);
}

export async function getUserStatus(
  userId: string
): Promise<UserStatus | null> {
  const userData = await findUserById(userId);
  if (!userData) return null;

  return userData.status;
}

export async function isUserSuspended(userId: string): Promise<boolean> {
  const status = await getUserStatus(userId);
  return status === "suspended";
}

export async function isUserActive(userId: string): Promise<boolean> {
  const status = await getUserStatus(userId);
  return status === "active";
}

/**
 * Find a user by email address
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const [result] = await database
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return result || null;
}

/**
 * Get all users (for admin panel)
 */
export async function getAllUsers(): Promise<User[]> {
  return database.select().from(user);
}

/**
 * Options for listing users with filtering and pagination
 */
export type ListUsersOptions = {
  /** Page number (1-based) */
  page?: number;
  /** Number of users per page */
  limit?: number;
  /** Filter by status */
  status?: UserStatus;
  /** Filter by role */
  role?: UserRole;
  /** Filter by admin status */
  isAdmin?: boolean;
  /** Search by name or email */
  search?: string;
  /** Sort field */
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  /** Sort direction */
  sortOrder?: "asc" | "desc";
};

/**
 * Result of paginated user list
 */
export type ListUsersResult = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * List users with filtering and pagination support
 * @param options - Filtering, sorting, and pagination options
 * @returns Paginated list of users with metadata
 */
export async function listUsers(
  options: ListUsersOptions = {}
): Promise<ListUsersResult> {
  const {
    page = 1,
    limit = 10,
    status,
    role,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  // Build where conditions
  const conditions: SQL[] = [];

  if (status) {
    conditions.push(eq(user.status, status));
  }

  if (role) {
    conditions.push(eq(user.role, role));
  }

  if (search) {
    conditions.push(
      or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const [countResult] = await database
    .select({ count: count() })
    .from(user)
    .where(whereClause);

  const total = countResult?.count ?? 0;

  // Build sort order
  const sortColumn = {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }[sortBy];

  const orderFn = sortOrder === "asc" ? asc : desc;

  // Get paginated users
  const offset = (page - 1) * limit;
  const users = await database
    .select()
    .from(user)
    .where(whereClause)
    .orderBy(orderFn(sortColumn))
    .limit(limit)
    .offset(offset);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Count total users matching optional filters
 */
export async function countUsers(
  options: Pick<ListUsersOptions, "status" | "role"> = {}
): Promise<number> {
  const { status, role } = options;

  const conditions: SQL[] = [];

  if (status) {
    conditions.push(eq(user.status, status));
  }

  if (role) {
    conditions.push(eq(user.role, role));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [result] = await database
    .select({ count: count() })
    .from(user)
    .where(whereClause);

  return result?.count ?? 0;
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  return database.select().from(user).where(eq(user.role, role));
}

/**
 * Get users by status
 */
export async function getUsersByStatus(status: UserStatus): Promise<User[]> {
  return database.select().from(user).where(eq(user.status, status));
}

/**
 * Admin user creation data type
 */
export type AdminCreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  isAdmin?: boolean;
};

/**
 * Create a new user (admin only)
 * This bypasses the disabled public signup by directly inserting into the database
 */
export async function createUserByAdmin(
  data: AdminCreateUserData
): Promise<User> {
  // Check if user with this email already exists
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  // Hash the password using better-auth's password hashing utility
  const { hashPassword } = await import("better-auth/crypto");
  const hashedPassword = await hashPassword(data.password);

  const userId = crypto.randomUUID();
  const now = new Date();

  // Create the user
  const [newUser] = await database
    .insert(user)
    .values({
      id: userId,
      name: data.name,
      email: data.email,
      emailVerified: true, // Admin-created users are considered verified
      role: data.role ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  // Create the credential account for password login (required by better-auth)
  await database.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId: userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  return newUser;
}

/**
 * Update user status (for admin suspension/activation)
 */
export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<User | null> {
  const [updatedUser] = await database
    .update(user)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning();

  return updatedUser || null;
}

/**
 * Update user role (for admin role management)
 */
export async function updateUserRole(
  userId: string,
  role: UserRole | null
): Promise<User | null> {
  const [updatedUser] = await database
    .update(user)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning();

  return updatedUser || null;
}

/**
 * Data type for general user updates
 */
export type UpdateUserInput = {
  name?: string;
  email?: string;
  image?: string | null;
  role?: UserRole | null;
  isAdmin?: boolean;
  status?: UserStatus;
  plan?: string;
};

/**
 * Update user with general purpose data
 * This function allows updating multiple user fields at once
 * @param userId - The ID of the user to update
 * @param data - The fields to update
 * @returns The updated user or null if not found
 */
export async function updateUser(
  userId: string,
  data: UpdateUserInput
): Promise<User | null> {
  // Check if user exists
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    return null;
  }

  // If email is being changed, check for duplicates
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await findUserByEmail(data.email);
    if (emailExists) {
      throw new Error("A user with this email already exists");
    }
  }

  // Build the update object, only including defined values
  const updateData: UpdateUserData = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.status !== undefined) updateData.status = data.status;

  const [updatedUser] = await database
    .update(user)
    .set(updateData)
    .where(eq(user.id, userId))
    .returning();

  return updatedUser || null;
}

/**
 * Suspend a user account
 * Convenience wrapper for updateUserStatus with 'suspended' status
 * @param userId - The ID of the user to suspend
 * @returns The updated user or null if not found
 */
export async function suspendUser(userId: string): Promise<User | null> {
  return updateUserStatus(userId, "suspended");
}

/**
 * Unsuspend (reactivate) a user account
 * Convenience wrapper for updateUserStatus with 'active' status
 * @param userId - The ID of the user to unsuspend
 * @returns The updated user or null if not found
 */
export async function unsuspendUser(userId: string): Promise<User | null> {
  return updateUserStatus(userId, "active");
}

/**
 * Create a new user - alias for createUserByAdmin for cleaner API
 * @param data - User creation data including name, email, password, and optional role/admin status
 * @returns The created user
 */
export async function createUser(data: AdminCreateUserData): Promise<User> {
  return createUserByAdmin(data);
}

/**
 * Update user password (admin only)
 * Updates the password hash in the credential account for a user
 * @param userId - The ID of the user whose password to update
 * @param newPassword - The new password (will be hashed)
 * @returns True if password was updated, false if user or credential account not found
 */
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  // First verify the user exists
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    return false;
  }

  // Hash the new password using better-auth's password hashing utility
  const { hashPassword } = await import("better-auth/crypto");
  const hashedPassword = await hashPassword(newPassword);

  // Update the credential account's password
  const result = await database
    .update(account)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(
      and(eq(account.userId, userId), eq(account.providerId, "credential"))
    )
    .returning();

  // Return true if we updated at least one account record
  return result.length > 0;
}

/**
 * Result type for resetUserPassword operation
 */
export type ResetUserPasswordResult = {
  success: boolean;
  resetAt?: Date;
  error?: string;
};

/**
 * Reset user password with a pre-hashed password
 * Updates the password hash in the credential account for a user and records the timestamp
 * @param userId - The ID of the user whose password to reset
 * @param hashedPassword - The new password hash (already hashed)
 * @returns Object containing success status, reset timestamp, and optional error message
 */
export async function resetUserPassword(
  userId: string,
  hashedPassword: string
): Promise<ResetUserPasswordResult> {
  // First verify the user exists
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const resetAt = new Date();

  // Update the credential account's password with the pre-hashed password
  const result = await database
    .update(account)
    .set({
      password: hashedPassword,
      updatedAt: resetAt,
    })
    .where(
      and(eq(account.userId, userId), eq(account.providerId, "credential"))
    )
    .returning();

  // Check if we updated at least one account record
  if (result.length === 0) {
    return {
      success: false,
      error: "Credential account not found for user",
    };
  }

  return {
    success: true,
    resetAt,
  };
}
