# Implementation Plan: Sign Up Page

**Branch**: `1-sign-up` | **Date**: 2026-02-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/1-sign-up/spec.md`

## Summary

Implement a sign-up page at route `/sign-up` that allows new users to register accounts with email, password, first name, and last name. The page will use react-hook-form with zod validation for real-time form validation, displaying red rings and error messages for invalid inputs. The form will match the minimal design aesthetic of the existing sign-in page and include loading states on the submit button. The implementation will leverage existing authentication services and hooks (AuthService.signUp, useAuth.signUp) and extend the SignUpRequest type to support separate firstName and lastName fields.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode enabled  
**Primary Dependencies**: TanStack Router (routing), TanStack Query (state), Tailwind CSS 4.x (styling), shadcn UI (components), React 19.x, React Hook Form 7.x, Zod 4.x, Axios, Vite 7.x  
**Storage**: N/A (frontend-only, external API services)  
**Testing**: Manual testing at multiple viewport sizes; automated tests optional  
**Target Platform**: Web browsers (mobile, tablet, desktop) with responsive design  
**Project Type**: Web - Frontend-only application consuming external APIs  
**Performance Goals**: Fast page loads, smooth 60fps animations, efficient TanStack Query caching  
**Constraints**: Mobile-first responsive design, accessible (WCAG AA where possible), TypeScript strict mode  
**Scale/Scope**: Single page component with form validation - typical auth flow complexity

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**I. Clean Code Architecture**

- [x] Routes layer uses TanStack Router for routing only (no direct API calls) - Route at /sign-up uses useAuth hook for registration
- [x] Components receive data via props/hooks, no direct API communication - Sign-up route component uses useAuth hook
- [x] Hooks use TanStack Query with API services layer - useAuth hook uses authService.signUp
- [x] API services layer handles all external HTTP communication - AuthService.signUp already exists
- [x] Type definitions centralized in `src/api-services/types.ts` - SignUpRequest type exists

**II. Simple UI/UX Principles**

- [x] Uses shadcn UI components (Radix UI primitives) where applicable - Form, Input, Button components available
- [x] Tailwind CSS utility classes used for styling (avoid custom CSS) - Will follow sign-in page patterns
- [x] Form validation with `react-hook-form` + `zod` - Specified in FR-009
- [x] Loading states shown without disabling buttons - Specified in FR-008
- [x] Toast notifications for user feedback (sonner) - Will use sonner for success/error messages
- [x] Empty states provided where applicable - N/A for sign-up form

**III. Responsive Design Standards**

- [x] Mobile-first approach confirmed - Will follow sign-in page responsive patterns
- [x] Tested at mobile (320px), tablet (768px), desktop (1024px+) breakpoints - In verification phase
- [x] Touch targets minimum 44x44 pixels - Will ensure interactive elements meet requirement
- [x] Navigation adapts to mobile devices - Link to sign-in page included
- [x] Forms usable with appropriate mobile input types - Email field will use type="email"

**IV. Technology Stack Constraints**

- [x] TanStack Router used for routing - Route at /sign-up
- [x] TanStack Query used for server state - useAuth hook uses TanStack Query mutations
- [x] Tailwind CSS 4.x used for styling - Project already configured
- [x] shadcn UI (Radix UI) components used as base - Form, Input, Button components available
- [x] AXIOS used for API communication - AuthService uses apiClient (Axios)
- [x] TypeScript strict mode enabled - Project configured with strict mode
- [x] Vite used as build tool - Project configured

**V. Code Quality Standards**

- [x] No `any` types in type definitions - Will use TypeScript strongly-typed interfaces
- [x] Explicit imports (no wildcard imports) - Will follow project conventions
- [x] Event handlers memoized with `useCallback` when needed - useAuth hook already implements this
- [x] Error handling: user-friendly messages, no stack traces - FR-015 specified
- [x] Client-side validation for all user inputs using zod schemas - FR-009 specified

**Status**: ALL PASSED ✅

All constitution checks have been validated. No violations found.

## Project Structure

### Documentation (this feature)

```text
specs/1-sign-up/
├── spec.md              # Feature specification
├── plan.md              # This file
├── data-model.md        # Phase 1 output (data model changes)
├── quickstart.md        # Phase 1 output (implementation guide)
├── contracts/           # Phase 1 output (no contracts needed)
└── tasks.md             # Phase 2 output (work breakdown)
```

### Source Code (repository root)

```text
src/
├── routes/              # TanStack Router file-based routing
│   └── sign-up.tsx      # Sign-up page route (replace existing redirect)
├── api-services/        # External API communication layer
│   ├── client.ts        # Axios instance with interceptors (no changes)
│   ├── auth.service.ts  # Authentication API service (no changes)
│   └── types.ts         # TypeScript API contract types (update SignUpRequest)
├── hooks/              # Custom React hooks
│   └── api/
│       └── use-auth.ts # TanStack Query hooks (no changes)
├── components/          # Reusable React components
│   └── ui/             # shadcn UI components (no changes)
```

**Structure Decision**: Frontend-only TanStack Router application with layered architecture. The sign-up page will follow the existing patterns from sign-in.tsx, using the same authentication service and hooks. Only minimal changes to SignUpRequest type in types.ts are needed to support firstName and lastName fields instead of a single name field.

## Complexity Tracking

> No complexity tracking required - all constitution checks passed without violations.

## Design Decisions

### Type System Changes

**Decision**: Update `SignUpRequest` interface to use `firstName` and `lastName` instead of `name`

**Rationale**:

- The feature specification requires separate firstName and lastName fields
- This provides better data structure for user profiles
- Allows for more flexible name display in the future
- Aligns with common user registration patterns

**Impact**:

- Requires updating `src/api-services/types.ts` SignUpRequest interface
- Backend API must accept `{ firstName, lastName, email, password }` payload
- Existing `AuthService.signUp()` method requires no changes (uses interface)
- No breaking changes to other parts of the system

**Alternatives Considered**:

1. Keep `name` field and parse firstName/lastName on the client - Rejected because spec requires separate validation and fields
2. Add all three fields (name, firstName, lastName) - Rejected as redundant

### Design Consistency

**Decision**: Mirror the existing sign-in page design and patterns

**Rationale**:

- Provides consistent user experience across auth pages
- Reuses proven, tested UI patterns
- Reduces implementation time and potential bugs
- Maintainable pattern for future auth-related pages

**Key Patterns from sign-in.tsx**:

- Centered form layout with max-w-md container
- Icon header (sign-in uses LogIn, sign-up will use UserPlus)
- FormField components with FormLabel, FormControl, Input, FormMessage
- Password field with show/hide toggle using Eye/EyeOff icons
- Loading state on submit button with text change
- Error display with destructively-styled alert box
- Link to alternate auth page at bottom
- Responsive container with appropriate spacing

## Phase 0: Research

Since all constitution checks have passed and the technical context is clear, Phase 0 research is not required. The following items are already resolved:

### Technical Decisions

1. **Form Validation**: Will use react-hook-form with zodResolver (FR-009, FR-003, FR-004, FR-005)
   - Already used in sign-in.tsx
   - Provides real-time validation with red ring and error messages
   - Meets FR-006 (red ring) and FR-007 (error messages)

2. **API Integration**: Will use existing AuthService.signUp() method
   - Already exists in src/api-services/auth.service.ts
   - Already wrapped in useAuth hook's signUp function
   - Requires only type update in SignUpRequest

3. **Routing**: Will use TanStack Router file-based routing
   - Route at /sign-up already exists (currently redirects to sign-in)
   - Will replace redirect with actual component

4. **Styling**: Will follow Tailwind CSS minimal design
   - Matches existing sign-in page aesthetic (FR-010)
   - Uses shadcn UI components (Button, Input, Form)
   - Responsive design with mobile-first approach

5. **Loading States**: Will use isSigningUp from useAuth hook
   - Already provided by useAuth hook
   - Button text changes to "Signing up..." during submission (FR-008)
   - Input fields disabled during submission (FR-013)

## Phase 1: Design & Contracts

### Data Model Changes

See `data-model.md` for detailed type system changes.

**Summary**:

- Update SignUpRequest interface to include firstName and lastName fields
- Remove name field from SignUpRequest
- Create SignUpForm type extending z.infer for form validation

### API Integration

**No new contracts needed** - using existing AuthService.signUp() method.

**Assumption**: Backend API will accept `{ firstName, lastName, email, password }` instead of `{ name, email, password }`.

### Quickstart Guide

See `quickstart.md` for implementation instructions.

## Implementation Summary

The implementation will involve:

1. **Type System Update** (data-model.md):
   - Modify `src/api-services/types.ts` SignUpRequest interface
   - Add firstName and lastName fields
   - Remove name field

2. **Route Implementation** (quickstart.md):
   - Replace redirect in `src/routes/sign-up.tsx` with full component
   - Create zod schema for form validation
   - Implement form with react-hook-form
   - Add password show/hide toggle
   - Integrate with useAuth.signUp hook
   - Add error handling and loading states
   - Include link to sign-in page
   - Ensure responsive design

3. **Verification** (tasks.md):
   - Test at mobile, tablet, and desktop breakpoints
   - Verify validation feedback
   - Test success and error scenarios
   - Confirm navigation works correctly

This plan provides a clear path to implementing the sign-up page feature while maintaining clean architecture, following UI/UX principles, and ensuring responsive design compliance.
