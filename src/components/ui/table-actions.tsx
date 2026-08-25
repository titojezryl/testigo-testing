import { Button } from './button';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface ActionButtonProps {
  onClick: () => void;
  variant?: 'default' | 'destructive';
  icon: React.ReactNode;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, variant = 'default', icon, label }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className="h-8 w-8 p-0"
    aria-label={label}
  >
    {icon}
  </Button>
);

export interface TableActionsProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onCustomAction?: (item: T, action: string) => void;
  customActions?: Array<{
    label: string;
    icon: React.ReactNode;
    action: string;
    variant?: 'default' | 'destructive';
  }>;
  showLabels?: boolean;
  compact?: boolean;
  disabled?: boolean;
}

export function TableActions<T>({
  item,
  onEdit,
  onDelete,
  onView,
  onCustomAction,
  customActions,
  showLabels = false,
  compact = true,
  disabled = false,
}: TableActionsProps<T>) {
  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            disabled={disabled}
            aria-label="Actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onView && (
            <DropdownMenuItem onClick={() => onView(item)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {customActions?.map((customAction, index) => (
            <DropdownMenuItem 
              key={index} 
              onClick={() => onCustomAction?.(item, customAction.action)}
              className={customAction.variant === 'destructive' ? 'text-destructive' : ''}
            >
              {customAction.icon}
              <span className="ml-2">{customAction.label}</span>
            </DropdownMenuItem>
          ))}
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => onDelete(item)} 
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {onView && (
        <ActionButton
          onClick={() => onView(item)}
          icon={<Eye className="h-4 w-4" />}
          label="View"
        />
      )}
      {onEdit && (
        <ActionButton
          onClick={() => onEdit(item)}
          icon={<Edit className="h-4 w-4" />}
          label="Edit"
        />
      )}
      {customActions?.map((customAction, index) => (
        <ActionButton
          key={index}
          onClick={() => onCustomAction?.(item, customAction.action)}
          variant={customAction.variant}
          icon={customAction.icon}
          label={customAction.label}
        />
      ))}
      {onDelete && (
        <ActionButton
          onClick={() => onDelete(item)}
          variant="destructive"
          icon={<Trash2 className="h-4 w-4" />}
          label="Delete"
        />
      )}
    </div>
  );
}
