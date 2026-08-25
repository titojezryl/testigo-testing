import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "~/components/Page";
import { AppBreadcrumb } from "~/components/AppBreadcrumb";
import { CreateUserDialog } from "~/components/CreateUserDialog";
import { ConfirmDeleteDialog } from "~/components/ConfirmDeleteDialog";
import { ConfirmSuspendDialog } from "~/components/ConfirmSuspendDialog";
import { useAuth, useUsers, useDeleteUser, useSuspendUser, useActivateUser, useUpdateUserRole, useCreateUser } from "~/hooks/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "~/components/ui/panel";
import {
  Home,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserCog,
  Ban,
  CheckCircle,
  Pencil,
  Key,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { User } from "~/api-services";

export const Route = createFileRoute("/dashboard/admin/users")({
  component: AdminUsersPage,
});

// Helper to format role for display
function formatRole(role: string | null): string {
  if (!role) return "No Role";
  const roleMap: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    guest: "Guest",
  };
  return roleMap[role] || role;
}

// Helper to get badge variant based on status
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  return status === "active" ? "default" : "destructive";
}

// Helper to get badge variant based on role
function getRoleVariant(role: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (!role) return "outline";
  if (role === "super_admin") return "default";
  return "secondary";
}

interface UserActionsDropdownProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onSuspend: (userId: string) => void;
  onActivate: (userId: string) => void;
  onRoleChange: (userId: string, role: string) => void;
}

function UserActionsDropdown({
  user,
  onEdit,
  onDelete,
  onSuspend,
  onActivate,
  onRoleChange,
}: UserActionsDropdownProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const isSuspending = user.status === "active";

  const handleStatusToggle = () => {
    if (isSuspending) {
      onSuspend(user.id);
    } else {
      onActivate(user.id);
    }
    setConfirmDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(user.id)}>
            <Key className="h-4 w-4 mr-2 text-destructive" />
            Delete User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleStatusToggle}>
            {isSuspending ? (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Suspend User
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate User
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Change Role
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onRoleChange(user.id, "super_admin")}>
            Super Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRoleChange(user.id, "admin")}>
            Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRoleChange(user.id, "guest")}>
            Guest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmSuspendDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleStatusToggle}
        isPending={false}
        userName={user.name}
        isSuspending={isSuspending}
      />
    </>
  );
}

function UsersTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "super_admin" | "admin" | "guest">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useUsers(page, limit, search);
  
  const deleteUserMutation = useDeleteUser();
  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();
  const updateRoleMutation = useUpdateUserRole();

  const users = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  // Filter users based on role and status
  const filteredUsers = users.filter(user => {
    const statusMatch = statusFilter === "all" || user.status === statusFilter;
    const roleMatch = roleFilter === "all" || user.role === roleFilter;
    return statusMatch && roleMatch;
  });

  if (error) {
    return (
      <Panel>
        <PanelContent>
          <div className="text-center py-8 text-destructive">
            <p>Error loading users</p>
            <p className="text-sm text-muted-foreground mt-2">
              You may not have permission to view this page.
            </p>
          </div>
        </PanelContent>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PanelTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users ({filteredUsers.length})
        </PanelTitle>
        <CreateUserDialog />
      </PanelHeader>
      <PanelContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as "all" | "active" | "suspended");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value as "all" | "super_admin" | "admin" | "guest");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
            {(search || statusFilter !== "all" || roleFilter !== "all") && (
              <p className="text-sm mt-2">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{user.name}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getRoleVariant(user.role)}>
                          {formatRole(user.role)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusVariant(user.status)}>
                          {user.status === "active" ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <UserActionsDropdown
                          user={user}
                          onEdit={(user) => console.log("Edit user:", user)}
                          onDelete={(userId) => deleteUserMutation.mutate(userId)}
                          onSuspend={suspendUserMutation.mutate}
                          onActivate={activateUserMutation.mutate}
                          onRoleChange={(userId, role) => updateRoleMutation.mutate({ userId, role })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </PanelContent>
    </Panel>
  );
}

function AdminUsersPage() {
  return (
    <Page>
      <AppBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", icon: Home },
          { label: "Admin", href: "/dashboard" },
          { label: "Users", icon: Users },
        ]}
      />

      <div className="mt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        <UsersTable />
      </div>
    </Page>
  );
}