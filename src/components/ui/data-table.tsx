import { Fragment } from 'react';
import type { ColumnDef } from '~/api-services/types';
import { EmptyState } from '~/components/EmptyState';
import { Skeleton } from './skeleton';
import { TableBulkActions, useTableSelection } from './table-bulk-actions';
import { Checkbox } from './checkbox';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string | undefined;
  enableBulkActions?: boolean;
  bulkActions?: any[];
  itemIdKey?: keyof T;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="h-10 px-4 text-left font-medium text-muted-foreground"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/50">
                {columns.map((col, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3">
                    <Skeleton className="h-5 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <EmptyState
          title={emptyMessage}
          description="There are no items to display at this time."
          icon={
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 transition-colors">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="h-10 px-4 text-left font-medium text-muted-foreground transition-colors"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={idx}
              className={`border-b transition-colors hover:bg-muted/50 ${
                onRowClick ? 'cursor-pointer' : ''
              } ${rowClassName?.(item) || ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col, cellIdx) => {
                const value = col.key in item ? (item as any)[col.key] : undefined;
                return (
                  <td
                    key={cellIdx}
                    className={`px-4 py-3 align-middle ${
                      col.isActionColumn ? 'w-[1%] whitespace-nowrap' : ''
                    }`}
                  >
                    {col.render ? col.render(value, item) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
