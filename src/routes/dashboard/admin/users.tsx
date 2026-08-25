import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "~/components/Page";
import { AppBreadcrumb } from "~/components/AppBreadcrumb";
import { CreateUserDialog } from "~/components/CreateUserDialog";
import { EditUserDialog } from "~/components/EditUserDialog";
import { ConfirmSuspendDialog } from "~/components/ConfirmSuspendDialog";
import { ResetPasswordDialog } from "~/components/ResetPasswordDialog";
import { assertAuthenticatedFn } from "~/fn/guards";
import {
  useAdminListUsers,
  useUpdateUserStatus,
  useUpdateUserRole,
} from "~/hooks/useUsers";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { UserRole, UserStatus } from "~/db/schema";

export const Route = createFileRoute("/dashboard/admin/users")({
  component: AdminUsersPage,
  beforeLoad: async () => {
    await assertAuthenticatedFn();
  },
});

// Helper to format role for display
function formatRole(role: UserRole | null): string {
  if (!role) return "No Role";
  const roleMap: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    guest: "Guest",
  };
  return roleMap[role] || role;
}

// Helper to get badge variant based on status
function getStatusVariant(
  status: UserStatus
): "default" | "secondary" | "destructive" | "outline" {
  return status === "active" ? "default" : "destructive";
}

// Helper to get badge variant based on role
function getRoleVariant(
  role: UserRole | null
): "default" | "secondary" | "destructive" | "outline" {
  if (!role) return "outline";
  if (role === "super_admin") return "default";
  return "secondary";
}

interface UserActionsDropdownProps {
  userId: string;
  userName: string;
  userEmail: string;
  userStatus: UserStatus;
  userRole: UserRole | null;
}

function UserActionsDropdown({
  userId,
  userName,
  userEmail,
  userStatus,
  userRole,
}: UserActionsDropdownProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const updateStatusMutation = useUpdateUserStatus();
  const updateRoleMutation = useUpdateUserRole();

  const isSuspending = userStatus === "active";

  const handleStatusToggle = () => {
    const newStatus = isSuspending ? "suspended" : "active";
    updateStatusMutation.mutate(
      { data: { userId, status: newStatus } },
      {
        onSuccess: () => {
          setConfirmDialogOpen(false);
        },
      }
    );
  };

  const handleRoleChange = (role: UserRole | null) => {
    updateRoleMutation.mutate({ data: { userId, role } });
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
          <EditUserDialog
            user={{
              id: userId,
              name: userName,
              email: userEmail,
              role: userRole,
            }}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit User
              </DropdownMenuItem>
            }
          />
          <ResetPasswordDialog
            user={{
              id: userId,
              name: userName,
              email: userEmail,
            }}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Key className="h-4 w-4 mr-2" />
                Reset Password
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem
            onClick={() => setConfirmDialogOpen(true)}
            disabled={updateStatusMutation.isPending}
          >
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
          <DropdownMenuItem
            onClick={() => handleRoleChange("super_admin")}
            disabled={
              userRole === "super_admin" || updateRoleMutation.isPending
            }
          >
            Super Admin
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRoleChange("admin")}
            disabled={userRole === "admin" || updateRoleMutation.isPending}
          >
            Admin
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRoleChange("guest")}
            disabled={userRole === "guest" || updateRoleMutation.isPending}
          >
            Guest
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRoleChange(null)}
            disabled={userRole === null || updateRoleMutation.isPending}
          >
            Remove Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmSuspendDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleStatusToggle}
        isPending={updateStatusMutation.isPending}
        userName={userName}
        isSuspending={isSuspending}
      />
    </>
  );
}

function UsersTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useAdminListUsers({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  if (error) {
    return (
      <Panel>
        <PanelContent>
          <div className="text-center py-8 text-destructive">
            <p>Error loading users: {error.message}</p>
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
          Users ({total})
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
              setStatusFilter(value as UserStatus | "all");
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
              setRoleFilter(value as UserRole | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="business_analyst">Business Analyst</SelectItem>
              <SelectItem value="quality_assurance">
                Quality Assurance
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : users.length === 0 ? (
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
                  {users.map((user) => (
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
                          userId={user.id}
                          userName={user.name}
                          userEmail={user.email}
                          userStatus={user.status}
                          userRole={user.role}
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
