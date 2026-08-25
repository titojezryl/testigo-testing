import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  // Redirect all sign-up attempts to sign-in page
  // Public signup is disabled - users can only be created by super_admin
  beforeLoad: () => {
    throw redirect({
      to: "/sign-in",
      search: { redirect: undefined },
    });
  },
  component: () => null,
});
