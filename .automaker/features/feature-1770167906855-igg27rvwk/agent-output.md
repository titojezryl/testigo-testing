I'll help you refactor this TanStack Start application from full-stack to frontend-only architecture. Let me start by exploring the codebase structure.

Let me explore the current structure more thoroughly:

Now I have a clear picture. The refactoring is mostly complete, but I need to remove remaining backend artifacts. Let me create a task list and proceed:

<summary>
## Summary: Refactor TanStack Start Full-Stack to Frontend-Only Architecture

### Changes Implemented
- **Removed backend infrastructure**: Deleted `drizzle/` directory, `drizzle.config.ts`, `pg_hba.conf`, and `docker-compose.yml`
- **Removed server-side storage code**: Deleted `src/utils/storage/` directory containing R2 storage implementation
- **Removed server-side utilities**: Deleted `src/utils/auth.ts`, `src/utils/attachments.ts`, and `src/utils/webhook-tokens.ts`
- **Updated API service layer**: Added typed `getCurrentUser` method to `auth.service.ts`
- **Updated types**: Removed duplicate ApiError and ApiResponse exports from `client.ts`
- **Updated frontend components**: Refactored `Header.tsx` to use new `useAuth` hook instead of `authClient`
- **Fixed UserAvatar components**: Updated from `imageKey` prop to `imageUrl` prop
- **Fixed route authentication**: Updated dashboard routes to use client-side navigation with auth checks
- **Fixed sign-in flow**: Updated to use `signInMutation.isPending` instead of undefined `isLoading`
- **Fixed file upload**: Updated `FileUploadExample` to use correct hook API with object parameters
- **Fixed settings page**: Updated to use `useCurrentUser` hook for avatar upload functionality
- **Fixed type errors**: Resolved role type casting in user management
- **Fixed import paths**: Removed .tsx extension from main.tsx
- **Updated documentation**: Rewrote `docs/architecture.md` to reflect new frontend-only architecture

### Files Modified
- `src/api-services/auth.service.ts` - Added getCurrentUser method
- `src/api-services/client.ts` - Removed duplicate type exports
- `src/components/Header.tsx` - Refactored to use useAuth hook
- `src/components/UserAvatarLink.tsx` - Fixed prop names
- `src/routes/dashboard.tsx` - Fixed auth redirect logic
- `src/routes/sign-in.tsx` - Fixed loading state references
- `src/routes/dashboard/admin/users.tsx` - Fixed role type casting
- `src/routes/dashboard/settings.tsx` - Updated hook imports
- `src/components/FileUploadExample.tsx` - Fixed file upload API calls
- `src/main.tsx` - Removed .tsx extension
- `docs/architecture.md` - Complete rewrite for frontend-only architecture
- Multiple files deleted (backend infrastructure)

### Notes for Developer
- Build completes successfully with no TypeScript errors
- Application is now purely frontend-only with external API integration
- All authentication flows through the centralized API service layer
- File uploads use presigned URLs via external storage service
- The build includes a warning about chunk sizes (>500KB), which can be addressed with code splitting
- All components now use TanStack Query hooks for data fetching and mutations
- Environment configuration is already set up for external API endpoints
</summary>