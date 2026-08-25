import { Button } from './button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const pageSizes = [10, 25, 50, 100];

export function TablePagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: TablePaginationProps) {
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 1 && pages[0] !== 1) {
        pages.unshift(1);
        if (pages[1] !== 2) {
          pages.splice(1, 0, -1); // -1 represents ellipsis
        }
      }

      if (endPage < totalPages && pages[pages.length - 1] !== totalPages) {
        if (pages[pages.length - 2] !== totalPages - 1) {
          pages.push(-1); // -1 represents ellipsis
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          Showing {startIndex + 1} to {endIndex} of {total} {total === 1 ? 'entry' : 'entries'}
        </span>
        <span className="sm:hidden">
          {startIndex + 1}-{endIndex} of {total}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page:
          </label>
          <select
            id="rows-per-page"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((pageNum, idx) => (
            <Button
              key={idx}
              variant={pageNum === page ? 'secondary' : 'ghost'}
              size="sm"
              className={pageNum === -1 ? 'pointer-events-none' : ''}
              onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
              disabled={typeof pageNum !== 'number'}
            >
              {pageNum === -1 ? '...' : pageNum}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
