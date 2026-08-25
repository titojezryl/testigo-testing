# Data Table Actions Column Implementation Plan

## Overview
This document outlines the strategy for adding an actions column with icon buttons (edit, delete, show) to the existing data table components in the TanStack fullstack boilerplate.

## Current Architecture Analysis

### Existing Components
- **[`DataTableWithSearch`](src/components/ui/data-table-with-search.tsx:21)**: Main container component with search functionality
- **[`DataTable`](src/components/ui/data-table.tsx:15)**: Core table rendering component
- **[`ColumnDef<T>`](src/api-services/types.ts:117)**: Type definition for column configurations

### Current Column Structure
The [`ColumnDef<T>`](src/api-services/types.ts:117) interface supports:
- `key`: Property key from data type T
- `header`: Column header text
- `sortable`: Optional sorting capability
- `filterable`: Optional filtering capability
- `render`: Optional custom render function returning React.ReactNode

## Implementation Strategy

### 1. TypeScript Type Modifications

#### Current Limitation
The [`ColumnDef`](src/api-services/types.ts:117) interface requires `key` to be `keyof T`, which prevents adding action columns since "actions" isn't a property on data models.

#### Solution Options

**Option A: Type Assertion (Quick Implementation)**
```typescript
{
  key: 'actions' as keyof T, // Type assertion
  header: 'Actions',
  render: (value, item) => <ActionsCell item={item} />
}
```

**Option B: Extend ColumnDef Type (Recommended)**
```typescript
export interface ActionColumnDef<T> extends Omit<ColumnDef<T>, 'key'> {
  key: keyof T | string; // Allow string keys for action columns
  isActionColumn?: boolean; // Optional flag to identify action columns
}
```

### 2. UI Component Structure

#### Create Reusable Action Components

**File: `src/components/ui/table-actions.tsx`**
```typescript
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

interface TableActionsProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  showLabels?: boolean;
  compact?: boolean; // Show dropdown menu instead of individual buttons
}

export function TableActions<T>({
  item,
  onEdit,
  onDelete,
  onView,
  showLabels = false,
  compact = false,
}: TableActionsProps<T>) {
  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
          {onDelete && (
            <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive">
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
```

### 3. Integration Points

#### Modify DataTable Component (Optional Enhancement)

**File: `src/components/ui/data-table.tsx`**
Add support for action column styling:

```typescript
// Add to the td className for action columns
`${col.isActionColumn ? 'w-[1%] whitespace-nowrap' : ''}`
```

#### Update Type Definitions

**File: `src/api-services/types.ts`**
```typescript
export interface ColumnDef<T> {
  key: keyof T | string; // Allow string keys
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  isActionColumn?: boolean; // New optional flag
  width?: string; // Optional width specification
}
```

### 4. Example Implementation for User Table

**File: `src/components/users/user-table.tsx`**

```typescript
import { TableActions } from '~/components/ui/table-actions';
import { useToast } from '~/hooks/useToast';

// Add action handlers
const handleEditUser = (user: User) => {
  console.log('Edit user:', user);
  // Implement edit logic (open modal, navigate to edit page, etc.)
};

const handleDeleteUser = (user: User) => {
  console.log('Delete user:', user);
  // Implement delete logic with confirmation dialog
};

const handleViewUser = (user: User) => {
  console.log('View user:', user);
  // Implement view logic (open detail modal, navigate to detail page, etc.)
};

// Add actions column to userColumns
const userColumns: ColumnDef<User>[] = [
  // ... existing columns ...
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
        compact={true} // Use dropdown for space efficiency
      />
    ),
  },
];
```

### 5. Styling Considerations

#### CSS Classes for Action Column
- Fixed width to prevent column from expanding: `w-[1%]` or `w-[120px]`
- Prevent text wrapping: `whitespace-nowrap`
- Center alignment: `text-center`
- Compact button styling: `h-8 w-8 p-0` for icon buttons

#### Responsive Behavior
- Desktop: Show individual icon buttons
- Mobile: Use compact dropdown menu
- Consider horizontal scrolling for tables with many columns

### 6. Accessibility Features

- ARIA labels for all action buttons
- Keyboard navigation support
- Screen reader friendly action descriptions
- Focus management for dropdown menus
- Color contrast compliance for action icons

### 7. Performance Considerations

#### Memoization
```typescript
const renderActions = useCallback((item: T) => (
  <TableActions
    item={item}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onView={handleView}
  />
), [handleEdit, handleDelete, handleView]);
```

#### Bundle Size
- Tree-shake lucide-react icons
- Lazy load action components if needed
- Consider icon sprite for multiple tables

### 8. Testing Strategy

#### Unit Tests
- Test TableActions component with different prop combinations
- Test action handlers are called with correct items
- Test dropdown menu open/close behavior
- Test keyboard navigation

#### Integration Tests
- Test actions column in existing tables
- Test action handlers in parent components
- Test loading states and error handling

### 9. Usage Patterns and Best Practices

#### Pattern 1: Basic Actions Column
```typescript
const columns: ColumnDef<User>[] = [
  // ... data columns
  {
    key: 'actions',
    header: 'Actions',
    isActionColumn: true,
    render: (value, item) => (
      <TableActions
        item={item}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
  },
];
```

#### Pattern 2: Conditional Actions
```typescript
render: (value, item) => (
  <TableActions
    item={item}
    onEdit={item.canEdit ? handleEdit : undefined}
    onDelete={item.canDelete ? handleDelete : undefined}
    onView={handleView}
  />
)
```

#### Pattern 3: Custom Action Handlers
```typescript
const handleUserSpecificAction = (user: User) => {
  // Custom logic based on user properties
  if (user.roles === 'super_admin') {
    // Special handling for super admins
  }
};
```

### 10. Migration Path

#### Phase 1: Add TableActions Component
- Create reusable TableActions component
- Add to UI component library
- Write tests

#### Phase 2: Update Type Definitions
- Modify ColumnDef to support string keys
- Add isActionColumn flag
- Update existing column definitions

#### Phase 3: Implement in Existing Tables
- Start with user table as example
- Add actions column to other tables
- Update documentation

#### Phase 4: Enhancements
- Add loading states for async actions
- Implement bulk actions
- Add action confirmation dialogs

## Success Criteria

1. ✅ Actions column renders correctly in all table variants
2. ✅ Icon buttons are accessible and keyboard navigable
3. ✅ Action handlers receive correct item data
4. ✅ Table layout remains responsive with actions column
5. ✅ No breaking changes to existing table implementations
6. ✅ TypeScript types are properly extended
7. ✅ Documentation and examples are provided

## Next Steps

1. Review and approve this implementation plan
2. Create TableActions component
3. Update type definitions
4. Implement in user table as proof of concept
5. Add to other tables as needed
6. Write tests and documentation

## Review Decisions

Based on the review feedback, the following decisions have been made:

1. ✅ **Option B** - Extend ColumnDef for better type safety
2. ✅ **Compact action buttons** - Use dropdown menu by default for space efficiency
3. ✅ **Additional action types** - Plan for extensibility beyond edit/delete/view
4. ✅ **Confirmation dialogs** - Implement for delete actions
5. ✅ **Bulk action capabilities** - Include in initial implementation

## Updated Implementation Priorities

### Phase 1: Core Components
- [ ] Update ColumnDef type definitions (Option B)
- [ ] Create TableActions component with compact dropdown
- [ ] Add confirmation dialog component for delete actions

### Phase 2: Enhanced Features
- [ ] Implement bulk action selection mechanism
- [ ] Add bulk action toolbar
- [ ] Create extensible action type system

### Phase 3: Integration & Testing
- [ ] Update user table with actions column
- [ ] Add comprehensive tests
- [ ] Update documentation with new patterns