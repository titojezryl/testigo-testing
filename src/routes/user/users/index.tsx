import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { UserTable } from "~/components/users/user-table";

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

export const Route = createFileRoute("/user/users/")({
  component: UsersPage,
});