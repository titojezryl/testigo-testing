import { DataTableContainer } from '~/components/data-table-container';
import { useAnalyticsTable } from '~/hooks/api/use-analytics-table';
import type { ColumnDef } from '~/api-services/types';
import { Badge } from '../ui/badge';

const getCategoryBadgeVariant = (category: string) => {
  switch (category) {
    case 'User Action':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'System':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'Error':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    case 'Warning':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const eventColumns: ColumnDef<import('~/utils/analytics-data-generator').AnalyticsEvent>[] = [
  {
    key: 'eventName',
    header: 'Event Name',
  },
  {
    key: 'category',
    header: 'Category',
    render: (value, item) => (
      <Badge className={getCategoryBadgeVariant(item.category)}>{item.category}</Badge>
    ),
  },
  {
    key: 'userEmail',
    header: 'User Email',
  },
  {
    key: 'page',
    header: 'Page',
  },
  {
    key: 'browser',
    header: 'Browser',
    render: (value, item) => (
      <span className="inline-flex items-center gap-1.5">
        {item.browser === 'Chrome' && '🌐'}
        {item.browser === 'Firefox' && '🦊'}
        {item.browser === 'Safari' && '🧭'}
        {item.browser === 'Edge' && '📘'}
        {item.browser === 'Unknown' && '❓'}
        {item.browser}
      </span>
    ),
  },
  {
    key: 'device',
    header: 'Device',
    render: (value, item) => (
      <span className="inline-flex items-center gap-1.5">
        {item.device === 'Desktop' && '🖥️'}
        {item.device === 'Mobile' && '📱'}
        {item.device === 'Tablet' && '📟'}
        {item.device === 'Unknown' && '❓'}
        {item.device}
      </span>
    ),
  },
  {
    key: 'timestamp',
    header: 'Timestamp',
    render: (value, item) => {
      const date = new Date(item.timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
];

export function AnalyticsEventTable() {
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
  } = useAnalyticsTable();

  return (
    <DataTableContainer
      queryKey={['analytics']}
      fetchFn={async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })}
      columns={eventColumns}
      title="Recent Events"
      searchPlaceholder="Search..."
      tableState={tableState}
      data={data?.data}
      totalPages={data?.totalPages || 0}
      total={data?.total || 0}
      loading={loading}
      error={error}
      setPage={setPage}
      setLimit={setLimit}
      setSearch={setSearch}
      refresh={async () => {
        // Refresh can be added via a mutation or refetch
        window.location.reload();
      }}
      isRefreshing={false}
      onRowClick={(event) => {
        console.log('Event clicked:', event);
      }}
    />
  );
}
