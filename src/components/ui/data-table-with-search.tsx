import { Input } from './input';
import { DataTable } from './data-table';
import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { ColumnDef } from '~/api-services/types';

interface DataTableWithSearchProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string | undefined;
  searchValue: string;
  title?: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  debounceMs?: number;
}

export function DataTableWithSearch<T>({
  searchValue,
  title,
  onSearchChange,
  searchPlaceholder = 'Search...',
  debounceMs = 300,
  ...tableProps
}: DataTableWithSearchProps<T>) {
  const [inputValue, setInputValue] = useState(searchValue);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onSearchChange(inputValue);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, debounceMs, onSearchChange]);

  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="relative max-w-xs ml-auto">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={inputValue}
          onChange={handleInputChange}
          className="pl-9 pr-10"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      </div>

      <DataTable {...tableProps} />
    </div>
  );
}
