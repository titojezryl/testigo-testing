import { DataTableContainer } from '~/components/data-table-container';
import { useUsersTable } from '~/hooks/api/use-users-table';
import type { ColumnDef, User } from '~/api-services/types';
import { Badge } from '../ui/badge';
import { TableActions } from '~/components/ui/table-actions';
import { useToast } from '~/hooks/useToast';
import { useState, useCallback } from 'react';
import { ConfirmDialog } from '~/components/ui/alert-dialog-confirm';

const getRoleBadgeVariant = (roles: string | undefined) => {
  if (!roles) {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
  switch (roles) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    case 'admin':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getStatusBadgeVariant = (status: boolean | undefined) => {
  if (!status) {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
  return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
};

export function UserTable() {
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const {
    data,
    tableState,
    totalPages,
    total,
    loading,
    error,
    setPage,
    setLimit,
    setSearch,
  } = useUsersTable();

  const handleEditUser = useCallback((user: User) => {
    toast({
      title: 'Edit User',
      description: `Editing user: ${user.firstName} ${user.lastName}`,
      variant: 'success',
    });
    // Implement edit logic (open modal, navigate to edit page, etc.)
    console.log('Edit user:', user);
  }, [toast]);

  const handleViewUser = useCallback((user: User) => {
    toast({
      title: 'View User',
      description: `Viewing user: ${user.firstName} ${user.lastName}`,
      variant: 'success',
    });
    // Implement view logic (open detail modal, navigate to detail page, etc.)
    console.log('View user:', user);
  }, [toast]);

  const handleDeleteUser = useCallback((user: User) => {
    setDeleteDialog({ open: true, user });
  }, []);

  const confirmDeleteUser = useCallback(() => {
    if (deleteDialog.user) {
      toast({
        title: 'User Deleted',
        description: `User ${deleteDialog.user.firstName} ${deleteDialog.user.lastName} has been deleted.`,
        variant: 'destructive',
      });
      console.log('Delete user:', deleteDialog.user);
      setDeleteDialog({ open: false, user: null });
    }
  }, [deleteDialog.user, toast]);

  const userColumns: ColumnDef<User>[] = [
    {
      key: 'firstName',
      header: 'First Name',
    },
    {
      key: 'lastName',
      header: 'Last Name',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'roles',
      header: 'Role',
      render: (value, item) => (
        <Badge className={getRoleBadgeVariant(item.roles)}>
          {item.roles
            ? item.roles
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            : '—'}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value, item) => (
        <Badge className={getStatusBadgeVariant(item.isActive)}>
          {item.isActive ? 'Active' : 'Suspended'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value, item) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      isActionColumn: true,
      render: (value, item) => (
        <TableActions
          item={item}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
          compact={true}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableContainer
        queryKey={['users']}
        fetchFn={async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })}
        columns={userColumns}
        title="Users"
        searchPlaceholder="Search users by name or email..."
        tableState={tableState}
        data={data}
        totalPages={totalPages}
        total={total}
        loading={loading}
        error={error}
        setPage={setPage}
        setLimit={setLimit}
        setSearch={setSearch}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteDialog.user?.firstName} ${deleteDialog.user?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteUser}
        variant="destructive"
      />
    </>
  );
}
