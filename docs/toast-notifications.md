# Toast Notifications Documentation

## Overview
This project uses Sonner for toast notifications to provide user feedback for all user actions throughout the application.

## Implementation Details

### Core Components
- **Sonner Library**: Used for all toast notifications
- **Toaster Component**: Integrated in the root document (`src/routes/__root.tsx`)
- **Toast Function**: Imported from `sonner` in components/hooks that need notifications

### Notification Types

#### Success Notifications
```typescript
import { toast } from 'sonner';

// Basic success notification
toast.success('Operation completed successfully');

// Success notification with description
toast.success('Account created', {
  description: 'Welcome to our platform!'
});
```

#### Error Notifications
```typescript
import { toast } from 'sonner';

// Basic error notification
toast.error('Operation failed');

// Error notification with error details
toast.error(error.message || 'Operation failed');

// Error notification with description
toast.error('Sign in failed', {
  description: 'Please check your credentials and try again.'
});
```

#### Loading Notifications
```typescript
import { toast } from 'sonner';

// Loading notification
const loadingToast = toast.loading('Processing...');

// Dismiss and show success
toast.dismiss(loadingToast);
toast.success('Operation completed');
```

## Usage Patterns

### In React Hooks
```typescript
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreateUser() {
  return useMutation({
    mutationFn: (data) => userService.createUser(data),
    onSuccess: () => {
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
}
```

### In React Components
```typescript
import { useState } from 'react';
import { toast } from 'sonner';

export function MyComponent() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await someAsyncOperation();
      toast.success('Operation completed successfully');
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form content */}
    </form>
  );
}
```

### Form Validation
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email) {
    toast.error('Email is required');
    return;
  }
  
  if (!password) {
    toast.error('Password is required');
    return;
  }
  
  // Continue with submission
};
```

## Best Practices

### 1. Error Handling
- Always provide user-friendly error messages
- Extract meaningful messages from API responses
- Fallback to generic messages when specific errors aren't available

### 2. Success Messages
- Confirm completion of user actions
- Provide context about what happened
- Be concise but informative

### 3. Loading States
- Use loading toasts for long-running operations
- Dismiss loading toasts when operations complete
- Follow up with success or error notifications

### 4. Accessibility
- Toast notifications are automatically announced by screen readers
- Provide sufficient time for users to read notifications
- Don't interrupt keyboard navigation flow

## Existing Implementations

### Authentication Hooks (`src/hooks/api/use-auth.ts`)
- Sign in success/error notifications
- Sign up success/error notifications
- Sign out success/error notifications

### User Management Hooks (`src/hooks/api/use-users.ts`)
- User creation success/error notifications
- User update success/error notifications
- User deletion success/error notifications
- Profile update success/error notifications
- Avatar update success/error notifications

### File Storage Hooks (`src/hooks/api/use-storage.ts`)
- File upload success/error notifications
- File deletion success/error notifications

## Customization

### Toast Configuration
The Toaster component in `src/components/ui/sonner.tsx` provides default styling that matches the application theme. Customizations include:
- Theme-aware notifications (light/dark mode)
- Consistent styling with the application
- Proper positioning and animations

### Custom Toast Components
For complex notifications, custom components can be passed to toast functions:
```typescript
toast.success(<CustomSuccessComponent message="Custom notification" />);
```

## Testing

### Unit Testing
When testing components that use toast notifications:
```typescript
// Mock toast functions
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  }
}));

// Verify toast calls
expect(toast.success).toHaveBeenCalledWith('Expected message');
```

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check that the Toaster component is included in the root document
   - Verify that toast functions are imported correctly
   - Ensure no CSS is hiding the notifications

2. **Styling issues**
   - Check the Toaster component configuration
   - Verify theme consistency with the application
   - Ensure proper CSS classes are applied

3. **Accessibility problems**
   - Test with screen readers
   - Verify proper ARIA attributes
   - Check keyboard navigation

## Future Enhancements

### Possible Improvements
1. Custom toast components for rich notifications
2. Notification history/persistence
3. Toast action buttons (e.g., "Undo" actions)
4. Notification categories/preferences
5. Push notification integration

---
**Document Version**: 1.0  
**Last Updated**: 2026-02-19
