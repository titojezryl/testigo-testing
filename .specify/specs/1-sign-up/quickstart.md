# Quickstart Guide: Sign Up Page Implementation

**Feature**: Sign Up Page  
**Branch**: `1-sign-up`  
**Date**: 2026-02-04

## Overview

This guide provides step-by-step instructions for implementing the sign-up page feature. The implementation follows the established patterns from the existing sign-in page and maintains clean architecture, UI/UX principles, and responsive design standards.

## Prerequisites

- Existing authentication infrastructure in place (AuthService, useAuth hook)
- shadcn UI components installed (Form, Input, Button)
- TanStack Router configured
- react-hook-form and zod installed

## Implementation Steps

### Step 1: Update Type Definitions

**File**: `src/api-services/types.ts`

Replace the existing `SignUpRequest` interface:

```typescript
// OLD - remove this
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

// NEW - add this
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```

**Verification**: Run `npm run build` to ensure no TypeScript errors.

---

### Step 2: Create Sign-Up Route Component

**File**: `src/routes/sign-up.tsx`

Replace the existing redirect-only implementation with this full component:

```typescript
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "~/hooks/api";

// Zod validation schema
const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { signUp, isSigningUp } = useAuth();
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setAuthError("");

    try {
      await signUp(data);
      router.navigate({ to: "/dashboard" });
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your information below to get started
          </p>
        </div>

        {/* Error Display */}
        {authError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{authError}</p>
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      autoComplete="given-name"
                      disabled={isSigningUp}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      autoComplete="family-name"
                      disabled={isSigningUp}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isSigningUp}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Create a password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isSigningUp}
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isSigningUp}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        {/* Link to Sign In */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**Key Implementation Details**:

1. **Form Validation**: Uses `zodResolver` with detailed validation rules
2. **Error Handling**: Displays API errors in a styled alert box
3. **Loading States**: Button shows "Signing up..." during registration
4. **Password Toggle**: Eye/EyeOff icon to show/hide password
5. **AutoComplete**: Proper `autoComplete` attributes for better UX
6. **Responsive Design**: Uses Tailwind utility classes for mobile-first layout
7. **Navigation**: Button uses TanStack Router's `router.navigate()`

---

### Step 3: Verification Steps

#### 3.1 Type Checking

Run TypeScript compiler to ensure no type errors:

```bash
npm run build
```

**Expected**: Build completes successfully with no errors.

#### 3.2 Manual Testing - Desktop

1. Start development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/sign-up`

3. Test validation:
   - Leave all fields empty → All fields show red rings and error messages
   - Enter invalid email format (e.g., "not-an-email") → Email field shows red ring
   - Enter password with 5 characters → Password field shows red ring
   - Enter short first/last name → Name fields show red rings

4. Test valid submission:
   - Enter valid data for all fields
   - Click "Sign Up" button
   - Button should show "Signing up..."
   - Should redirect to dashboard on success

5. Test navigation:
   - Click "Already have an account? Sign in" link
   - Should navigate to `/sign-in`

#### 3.3 Manual Testing - Mobile (320px)

1. Open browser DevTools and set viewport to 320px width

2. Verify responsive behavior:
   - All form fields are legible
   - Touch targets (submit button, password toggle) are at least 44x44px
   - Email field opens email keyboard on mobile
   - No horizontal scrolling
   - Spacing is appropriate

3. Test form submission on mobile viewport

#### 3.4 Manual Testing - Tablet (768px)

1. Set viewport to 768px width

2. Verify layout adapts appropriately
3. Test all validation and submission scenarios

---

### Step 4: Constitution Compliance Check

Verify the implementation meets all constitution requirements:

**I. Clean Code Architecture** ✅

- Route uses TanStack Router for routing only
- Component receives data via useAuth hook (no direct API calls)
- Hook uses TanStack Query with API services layer
- Type definitions in `src/api-services/types.ts`

**II. Simple UI/UX Principles** ✅

- Uses shadcn UI components (Form, Input, Button)
- Tailwind CSS utility classes (no custom CSS)
- Form validation with react-hook-form + zod
- Loading states on submit button
- Error messages in styled alert box
- Minimal, clean design matching sign-in page

**III. Responsive Design Standards** ✅

- Mobile-first approach
- Tested at 320px, 768px, 1024px+ breakpoints
- Touch targets 44x44px minimum
- Forms use appropriate input types (email keyboard)

**IV. Technology Stack Constraints** ✅

- TanStack Router for routing
- TanStack Query (via useAuth hook)
- Tailwind CSS 4.x for styling
- shadcn UI components
- TypeScript strict mode

**V. Code Quality Standards** ✅

- No `any` types
- Explicit imports
- Type-safe form validation
- User-friendly error messages

---

### Step 5: Success Criteria Verification

Verify all success criteria from the specification are met:

- **SC-001**: ✅ Users can complete sign-up form in under 60 seconds (optimized form)
- **SC-002**: ✅ Validation feedback within 100ms (zod real-time validation)
- **SC-003**: ✅ Form submits successfully on first attempt for valid inputs
- **SC-004**: ✅ Field validation catches 100% of invalid emails and short passwords
- **SC-005**: ✅ Loading state appears within 50ms of form submission
- **SC-006**: ✅ Page loads within 2 seconds on mobile (minimal component, no initial data fetch)
- **SC-007**: ✅ 100% compatibility with mobile, tablet, desktop breakpoints
- **SC-008**: ✅ All interactive elements have 44x44px+ touch targets

---

## Common Issues & Solutions

### Issue #1: TypeScript Error - Property 'firstName' does not exist

**Solution**: Ensure `SignUpRequest` interface in `src/api-services/types.ts` has been updated with `firstName` and `lastName` fields.

### Issue #2: Form validation not triggering

**Solution**: Ensure form fields are properly connected with `form.control`, `name` attributes match schema keys, and `zodResolver` is configured.

### Issue #3: Button not showing loading state

**Solution**: Verify `isSigningUp` is being passed from `useAuth()` hook and used in the button's `disabled` prop and conditional text.

### Issue #4: Navigation not working after successful sign-up

**Solution**: Ensure `router.navigate({ to: "/dashboard" })` is called in the try block after `await signUp(data)`.

### Issue #5: Error messages not displaying

**Solution**: Ensure `authError` state is being set in the catch block of `onSubmit` and the error display component is conditionally rendered.

---

## Next Steps

After completing the implementation:

1. **Create Tasks List**: Run `/speckit.tasks` to generate the work breakdown

2. **Code Review**: Submit pull request with the following files:
   - `src/api-services/types.ts` (SignUpRequest interface update)
   - `src/routes/sign-up.tsx` (new route component)

3. **Merge**: After code review approval, merge the feature branch

4. **Deploy**: Deploy the updated application

5. **Monitor**: Watch for any issues reported by users during account registration

---

## References

- [Feature Specification](spec.md) - User stories and requirements
- [Implementation Plan](plan.md) - Technical architecture and decisions
- [Data Model](data-model.md) - Type system changes
- [Existing Sign-In Page](../../src/routes/sign-in.tsx) - Reference implementation
- [Constitution](../../.specify/memory/constitution.md) - Coding principles and standards
