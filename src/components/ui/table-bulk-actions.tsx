import { useState, useCallback } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Trash2, Edit, Download, Mail } from 'lucide-react';
import { ConfirmDialog } from './alert-dialog-confirm';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline';
  onClick: (selectedItems: any[]) => void;
  requiresConfirmation?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

export interface TableBulkActionsProps<T> {
  data: T[];
  selectedItems: T[];
  onSelectionChange: (selectedItems: T[]) => void;
  bulkActions: BulkAction[];
  itemIdKey?: keyof T;
  disabled?: boolean;
}

export function TableBulkActions<T>({
  data,
  selectedItems,
  onSelectionChange,
  bulkActions,
  itemIdKey = 'id' as keyof T,
  disabled = false,
}: TableBulkActionsProps<T>) {
  const [confirmAction, setConfirmAction] = useState<{
    action: BulkAction;
    items: T[];
  } | null>(null);

  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected = selectedItems.length > 0 && !allSelected;

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectionChange(data);
    } else {
      onSelectionChange([]);
    }
  }, [data, onSelectionChange]);

  const handleSelectItem = useCallback((item: T, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, item]);
    } else {
      onSelectionChange(selectedItems.filter(i => i[itemIdKey] !== item[itemIdKey]));
    }
  }, [selectedItems, onSelectionChange, itemIdKey]);

  const handleBulkAction = useCallback((action: BulkAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction({ action, items: selectedItems });
    } else {
      action.onClick(selectedItems);
    }
  }, [selectedItems]);

  const handleConfirmAction = useCallback(() => {
    if (confirmAction) {
      confirmAction.action.onClick(confirmAction.items);
      setConfirmAction(null);
    }
  }, [confirmAction]);

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-muted/50 border rounded-lg mb-4">
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
            </span>

          {selectedItems.length > 0 && selectedItems.length < data.length && (
            <Button
              variant="link"
              size="sm"
              onClick={() => onSelectionChange(data)}
              className="text-sm"
            >
              Select all {data.length} items
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {bulkActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => handleBulkAction(action)}
              disabled={disabled}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange([])}
          >
            Clear selection
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.action.confirmTitle || 'Confirm Action'}
        description={confirmAction?.action.confirmDescription || 
          `Are you sure you want to ${confirmAction?.action.label.toLowerCase()} ${confirmAction?.items.length} item${confirmAction?.items.length !== 1 ? 's' : ''}?`}
        confirmLabel={confirmAction?.action.label || 'Confirm'}
        cancelLabel="Cancel"
        onConfirm={handleConfirmAction}
        variant={confirmAction?.action.variant === 'destructive' ? 'destructive' : 'default'}
      />
    </>
  );
}

// Hook for managing table selection
export function useTableSelection<T>(initialData: T[] = [], itemIdKey: keyof T = 'id' as keyof T) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const isSelected = useCallback((item: T) => {
    return selectedItems.some(i => i[itemIdKey] === item[itemIdKey]);
  }, [selectedItems, itemIdKey]);

  const toggleSelection = useCallback((item: T) => {
    setSelectedItems(prev => {
      const isCurrentlySelected = prev.some(i => i[itemIdKey] === item[itemIdKey]);
      if (isCurrentlySelected) {
        return prev.filter(i => i[itemIdKey] !== item[itemIdKey]);
      } else {
        return [...prev, item];
      }
    });
  }, [itemIdKey]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedItems(items);
  }, []);

  return {
    selectedItems,
    setSelectedItems,
    isSelected,
    toggleSelection,
    clearSelection,
    selectAll,
  };
}
