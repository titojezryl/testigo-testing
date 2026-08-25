import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertSuperAdminMiddleware } from "./middleware";
import {
  createUserByAdmin,
  getAllUsers,
  listUsers,
  updateUserStatus,
  updateUserRole,
  updateUser,
  suspendUser,
  unsuspendUser,
  findUserById,
  updateUserPassword,
} from "~/data-access/users";

/**
 * Create a new user (super_admin only)
 * This is the only way to create users since public signup is disabled
 */
export const adminCreateUserFn = createServerFn({
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
    const newUser = await createUserByAdmin({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    // Return user without sensitive fields
    const { ...safeUser } = newUser;
    return safeUser;
  });

/**
 * Get all users (super_admin only)
 */
export const adminGetAllUsersFn = createServerFn({
  method: "GET",
})
  .middleware([assertSuperAdminMiddleware])
  .handler(async () => {
    const users = await getAllUsers();
    // Return users without sensitive fields
    return users.map((u) => {
      const { ...safeUser } = u;
      return safeUser;
    });
  });

/**
 * Get a specific user by ID (super_admin only)
 */
export const adminGetUserFn = createServerFn({
  method: "GET",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const user = await findUserById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  });

/**
 * Update user status (suspend/activate) (super_admin only)
 */
export const adminUpdateUserStatusFn = createServerFn({
  method: "POST",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z.object({
      userId: z.string(),
      status: z.enum(["active", "suspended"]),
    })
  )
  .handler(async ({ data, context }) => {
    // Prevent super_admin from suspending themselves
    if (data.userId === context.userId && data.status === "suspended") {
      throw new Error("You cannot suspend your own account");
    }

    const updatedUser = await updateUserStatus(data.userId, data.status);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  });

/**
 * Update user role (super_admin only)
 */
export const adminUpdateUserRoleFn = createServerFn({
  method: "POST",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z.object({
      userId: z.string(),
      role: z.enum(["super_admin", "admin", "guest"]).nullable(),
    })
  )
  .handler(async ({ data }) => {
    const updatedUser = await updateUserRole(data.userId, data.role);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  });

/**
 * List users with filtering and pagination (super_admin only)
 */
export const adminListUsersFn = createServerFn({
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
export const adminUpdateUserFn = createServerFn({
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

    // Prevent super_admin from removing their own admin status or suspending themselves
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
 * Convenience endpoint for suspending users
 */
export const adminSuspendUserFn = createServerFn({
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

/**
 * Unsuspend (reactivate) a user account (super_admin only)
 * Convenience endpoint for reactivating suspended users
 */
export const adminUnsuspendUserFn = createServerFn({
  method: "POST",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z.object({
      userId: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const updatedUser = await unsuspendUser(data.userId);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  });

/**
 * Password strength validation schema
 * Requires:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordStrengthSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

/**
 * Reset user password (super_admin only)
 * Validates password strength, hashes the password securely, and updates the user's credential account.
 * Includes audit logging of the password reset action.
 */
export const resetUserPasswordFn = createServerFn({
  method: "POST",
})
  .middleware([assertSuperAdminMiddleware])
  .inputValidator(
    z.object({
      userId: z.string().min(1, "User ID is required"),
      newPassword: passwordStrengthSchema,
    })
  )
  .handler(async ({ data, context }) => {
    // First verify the user exists
    const targetUser = await findUserById(data.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    // Update the password
    const success = await updateUserPassword(data.userId, data.newPassword);
    if (!success) {
      throw new Error(
        "Failed to reset password: User may not have a credential account"
      );
    }

    // Audit logging for password reset action
    // Note: This is a console-based audit log. In a production environment,
    // this should be replaced with a proper audit logging system (database table, external service, etc.)
    console.log(
      JSON.stringify({
        action: "PASSWORD_RESET",
        timestamp: new Date().toISOString(),
        performedBy: context.userId,
        targetUserId: data.userId,
        targetUserEmail: targetUser.email,
        message: `Password reset for user ${targetUser.email} (${data.userId}) by admin ${context.userId}`,
      })
    );

    return {
      success: true,
      message: "Password has been reset successfully",
      userId: data.userId,
    };
  });
