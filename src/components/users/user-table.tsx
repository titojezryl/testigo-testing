import { DataTableContainer } from '~/components/data-table-container';
import { useUsersTable } from '~/hooks/api/use-users-table';
import type { ColumnDef } from '~/api-services/types';
import { Badge } from '../ui/badge';

const getRoleBadgeVariant = (role: string | undefined) => {
  if (!role) {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    case 'admin':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getStatusBadgeVariant = (status: string | undefined) => {
  if (!status) {
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'suspended':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const userColumns: ColumnDef<import('~/api-services/types').User>[] = [
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
    key: 'role',
    header: 'Role',
    render: (value, item) => (
      <Badge className={getRoleBadgeVariant(item.role)}>
        {item.role
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (value, item) => (
      <Badge className={getStatusBadgeVariant(item.status)}>
        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
];

export function UserTable() {
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

  return (
    <DataTableContainer
      queryKey={['users']}
      fetchFn={async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })}
      columns={userColumns}
      title="Users"
      searchPlaceholder="Search users by name or email..."
      tableState={tableState}
      data={data?.data}
      totalPages={data?.totalPages || 0}
      total={data?.total || 0}
      loading={loading}
      error={error}
      setPage={setPage}
      setLimit={setLimit}
      setSearch={setSearch}
    />
  );
}
