import { redirect } from "@tanstack/react-router";
import { auth } from "~/utils/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { isUserSuspended } from "~/data-access/users";

/**
 * Route guard that checks if the user is authenticated and not suspended.
 * Redirects to /unauthenticated if not authenticated.
 * Redirects to /suspended if the user account is suspended.
 */
export const assertAuthenticatedFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({
      headers: headers as unknown as Headers,
    });
    if (!session) {
      throw redirect({ to: "/unauthenticated" });
    }

    // Check if user is suspended - block access for suspended users
    const suspended = await isUserSuspended(session.user.id);
    if (suspended) {
      throw redirect({ to: "/suspended" });
    }
  }
);
