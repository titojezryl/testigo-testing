import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  authenticatedMiddleware,
  assertSuperAdminMiddleware,
} from "./middleware";
import {
  findUserById,
  createUser,
  listUsers,
  updateUser,
  suspendUser,
} from "~/data-access/users";

/**
 * Get the current authenticated user's information including their role
 * This is useful for checking permissions in the frontend
 */
export const getCurrentUserFn = createServerFn({
  method: "GET",
})
  .middleware([authenticatedMiddleware])
  .handler(async ({ context }) => {
    const user = await findUserById(context.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };
  });

export const getUserByIdFn = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ userId: z.string() }))
  .middleware([authenticatedMiddleware])
  .handler(async ({ data }) => {
    const user = await findUserById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }
    // Exclude email from public profile response
    const { email, ...publicUser } = user;
    return publicUser;
  });

/**
 * Create a new user (super_admin only)
 * Creates a new user account with the specified details
 */
export const createUserFn = createServerFn({
  method: "POST",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      role: z.enum(["super_admin", "admin", "guest"]).optional(),
    })
  )
  .handler(async ({ data }) => {
    const newUser = await createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    // Return user without sensitive fields
    return newUser;
  });

/**
 * List users with filtering and pagination (super_admin only)
 * Returns a paginated list of users with optional filters
 */
export const listUsersFn = createServerFn({
  method: "GET",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z
      .object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
        status: z.enum(["active", "suspended"]).optional(),
        role: z.enum(["super_admin", "admin", "guest"]).optional(),
        search: z.string().optional(),
        sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
      .optional()
  )
  .handler(async ({ data }) => {
    const result = await listUsers(data ?? {});
    return result;
  });

/**
 * Update user with general data (super_admin only)
 * Allows updating multiple user fields at once
 */
export const updateUserFn = createServerFn({
  method: "POST",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z.object({
      userId: z.string(),
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      image: z.string().nullable().optional(),
      role: z.enum(["super_admin", "admin", "guest"]).nullable().optional(),
      status: z.enum(["active", "suspended"]).optional(),
    })
  )
  .handler(async ({ data, context }) => {
    const { userId, ...updateData } = data;

    // Prevent super_admin from removing their own super_admin status or suspending themselves
    if (userId === context.userId) {
      if (updateData.role === "super_admin") {
        throw new Error("You cannot remove your own super admin status");
      }
      if (updateData.status === "suspended") {
        throw new Error("You cannot suspend your own account");
      }
    }

    const updatedUser = await updateUser(userId, updateData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  });

/**
 * Suspend a user account (super_admin only)
 * Suspends the specified user account, preventing them from accessing the system
 */
export const suspendUserFn = createServerFn({
  method: "POST",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z.object({
      userId: z.string(),
    })
  )
  .handler(async ({ data, context }) => {
    // Prevent super_admin from suspending themselves
    if (data.userId === context.userId) {
      throw new Error("You cannot suspend your own account");
    }

    const updatedUser = await suspendUser(data.userId);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  });
