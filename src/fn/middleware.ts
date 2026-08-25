import { auth } from "~/utils/auth";
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { isUserSuspended, hasUserRole } from "~/data-access/users";

async function getAuthenticatedUserId(): Promise<string> {
  const request = getRequest();

  if (!request?.headers) {
    throw new Error("No headers");
  }
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    throw new Error("No session");
  }

  return session.user.id;
}

/**
 * Middleware that checks if the user is authenticated and not suspended.
 * Throws an error if the user is suspended, blocking all API access.
 */
export const authenticatedMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const userId = await getAuthenticatedUserId();

  // Check if user is suspended - block all API access for suspended users
  const suspended = await isUserSuspended(userId);
  if (suspended) {
    throw new Error(
      "Account suspended: Your account has been suspended and you cannot access this resource"
    );
  }

  return next({
    context: { userId },
  });
});

/**
 * Middleware that checks if the user has the super_admin role.
 * Throws an error if the user is suspended or does not have the super_admin role.
 */
export const assertSuperAdminMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const userId = await getAuthenticatedUserId();

  // Check if user is suspended first
  const suspended = await isUserSuspended(userId);
  if (suspended) {
    throw new Error(
      "Account suspended: Your account has been suspended and you cannot access this resource"
    );
  }

  const isSuperAdmin = await hasUserRole(userId, "super_admin");
  if (!isSuperAdmin) {
    throw new Error("Unauthorized: Only super admins can perform this action");
  }

  return next({
    context: { userId },
  });
});
