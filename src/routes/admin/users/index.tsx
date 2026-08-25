import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { UserTable } from "~/components/users/user-table";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "~/hooks/useAxios";

function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Users
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your application users
            </p>
          </div>
          <Button>Add User</Button>
        </div>

        <UserTable />
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/admin/users/")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated, user } = useAuthenticationStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/signin',
        search: { redirect: location.pathname }
      });
    }

    if (!user.role || user.role !== 'super_admin' ) {
      throw redirect({
        to: '/forbidden'
      });
    }
  },
  component: UsersPage,
});