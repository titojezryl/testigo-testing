# Data Model: Sign Up Page

**Feature**: Sign Up Page  
**Branch**: `1-sign-up`  
**Date**: 2026-02-04

## Overview

This document describes the data model changes required to support the sign-up page feature. The primary change is updating the `SignUpRequest` interface to use separate `firstName` and `lastName` fields instead of a single `name` field.

## Data Model Changes

### Existing Types

#### User Entity

```typescript
export interface User {
  id: string;
  name: string; // Full name stored in user profile
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "super_admin" | "admin" | "guest";
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}
```

**Status**: UNCHANGED

The User interface will continue to store the full name as a single `name` field. The sign-up form accepts separate firstName and lastName, which will be combined by the backend API into the User.name field during account creation.

#### Current SignUpRequest Interface

```typescript
export interface SignUpRequest {
  name: string; // Single name field
  email: string;
  password: string;
}
```

**Status**: TO BE UPDATED

### Updated Types

#### New SignUpRequest Interface

```typescript
export interface SignUpRequest {
  firstName: string; // First name (required)
  lastName: string; // Last name (required)
  email: string; // Email address (required)
  password: string; // Password (required, min 6 chars)
}
```

**Changes**:

- ✅ Add `firstName: string` field
- ✅ Add `lastName: string` field
- ❌ Remove `name: string` field
- ✅ Keep `email: string` field
- ✅ Keep `password: string` field

### Form Validation Types

#### Zod Schema for Sign-Up Form

```typescript
import { z } from "zod";

export const signUpSchema = z.object({
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

export type SignUpForm = z.infer<typeof signUpSchema>;
```

**Validation Rules**:

- `firstName`: Required, 1-50 characters
- `lastName`: Required, 1-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

## Data Flow

### Client-Side Form Submission Flow

```
┌─────────────────┐
│  Sign-Up Form   │
│  (sign-up.tsx)  │
└────────┬────────┘
         │
         │ 1. React Hook Form validates with zod schema
         │    - firstName (required, length check)
         │    - lastName (required, length check)
         │    - email (required, email format)
         │    - password (required, min 6 chars)
         │
         ▼
┌─────────────────┐
│  useAuth Hook   │
│  (use-auth.ts)  │
└────────┬────────┘
         │
         │ 2. Converts to SignUpRequest type
         │    { firstName, lastName, email, password }
         │
         ▼
┌──────────────────┐
│ AuthService      │
│ (auth.service.ts)│
└────────┬─────────┘
         │
         │ 3. POST to /auth/signup endpoint
         │    Payload: { firstName, lastName, email, password }
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  (External)     │
└────────┬────────┘
         │
         │ 4. Processes sign-up
         │    - Validates data
         │    - Combines firstName + lastName → name
         │    - Creates User record
         │    - Returns AuthResponse
         │
         ▼
┌─────────────────┐
│  AuthResponse   │
└─────────────────┘
```

### API Request/Response Types

#### Request (POST /auth/signup)

```typescript
// Type: SignUpRequest
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response (200 OK)

```typescript
// Type: AuthResponse
{
  "user": {
    "id": "usr_abc123",
    "name": "John Doe",        // Combined from firstName + lastName
    "email": "john.doe@example.com",
    "emailVerified": false,
    "role": "guest",
    "status": "active",
    "createdAt": "2026-02-04T12:00:00Z",
    "updatedAt": "2026-02-04T12:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Error Response (400 Bad Request / 409 Conflict)

```typescript
{
  "success": false,
  "message": "Email already registered"
}
```

## Type Safety

### Type Hierarchy

```
SignUpForm (zod schema inference)
    ↓ extends
SignUpRequest (API interface)
    ↓ posted to
AuthService.signUp()
    ↓ returns
AuthResponse
    ↓ contains
User interface
```

### Type Conversion

Form data (SignUpForm type from zod) → API request (SignUpRequest type):

```typescript
// Automatic conversion - types are compatible
const formData: SignUpForm = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "password123",
};

// Can be directly passed to authService.signUp()
await authService.signUp(formData); // Accepts SignUpRequest
```

## Assumptions & Dependencies

### Assumptions

1. **Backend API Compatibility**: The backend `/auth/signup` endpoint will be updated to accept `{ firstName, lastName, email, password }` instead of `{ name, email, password }`

2. **Name Combination**: The backend will combine `firstName` and `lastName` into the User.name field (e.g., "firstName lastName" or with space separator)

3. **Validation**: Backend validation rules match client-side validation:
   - firstName: required, max 50 chars
   - lastName: required, max 50 chars
   - email: required, valid format
   - password: required, min 6 chars

### Dependencies

1. **TypeScript**: Strict mode enabled for type safety
2. **Zod**: Version 4.x for schema validation
3. **React Hook Form**: Version 7.x for form management
4. **AuthService**: Existing service with `signUp` method

## Migration Notes

### Breaking Changes

None for existing frontend code. The change only affects:

- Sign-up form data structure
- Backend API endpoint contract

### Non-Breaking Changes

- User interface remains unchanged (still stores combined name)
- Sign-in flow unaffected (uses SignInRequest, not SignUpRequest)
- Other auth methods unaffected (signOut, refreshToken, etc.)

### Backward Compatibility Consideration

If the backend must support both old and new formats during migration, consider making the fields optional temporarily:

```typescript
// Temporary during migration
export interface SignUpRequest {
  name?: string; // Deprecated
  firstName?: string; // New field
  lastName?: string; // New field
  email: string;
  password: string;
}
```

This is NOT recommended for production and should be resolved quickly with a coordinated backend update.

## Testing Considerations

### Type Validation Tests

1. **Form Schema Validation**
   - Test all field validation rules
   - Test invalid email formats
   - Test short passwords
   - Test empty fields

2. **Type Safety**
   - Verify SignUpForm type matches SignUpRequest
   - Verify type inference from zod schema
   - Verify no `any` types in the flow

3. **API Integration**
   - Test valid submission flow
   - Test API error responses (email already exists)
   - Test network error handling

### Test Data Examples

```typescript
// Valid submission
const validData: SignUpForm = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
  password: "password123",
};

// Invalid - short password
const shortPassword: SignUpForm = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
  password: "12345", // Should fail: less than 6 chars
};

// Invalid - bad email format
const badEmail: SignUpForm = {
  firstName: "Jane",
  lastName: "Smith",
  email: "not-an-email", // Should fail: invalid email format
  password: "password123",
};
```

## Conclusion

The data model changes for the sign-up page feature are minimal and focused. The primary change is updating the `SignUpRequest` interface to support separate firstName and lastName fields. All other types remain unchanged, and the integration with existing authentication infrastructure is straightforward.

The zod validation schema ensures type safety and client-side validation, while maintaining compatibility with the backend API contract through proper TypeScript typing.
