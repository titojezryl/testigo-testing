# API Contracts: Sign Up Page

**Feature**: Sign Up Page  
**Branch**: `1-sign-up`  
**Date**: 2026-02-04

## Overview

This feature uses existing API contracts from the authentication service. No new API endpoints or contracts are required.

## Existing API Contract

### POST /auth/signup

**Endpoint**: Already exists in authentication service

**Request Type**: `SignUpRequest`

```typescript
interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```

**Response Type**: `AuthResponse`

```typescript
interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
```

**Implementation Details**:

- Method: POST
- Content-Type: application/json
- Authentication: None (public endpoint)

## Contract Changes

### Modified Interface

**File**: `src/api-services/types.ts`

**Change**: Updated `SignUpRequest` interface

```diff
- name: string
+ firstName: string
+ lastName: string
```

**Impact**:

- Backend API must accept new field structure
- Frontend form sends separate firstName and lastName
- No breaking changes to response structure

## OpenAPI Specification

If your project uses OpenAPI/Swagger for API documentation, update the `/auth/signup` endpoint schema:

```yaml
/auth/signup:
  post:
    summary: Register a new user account
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - firstName
              - lastName
              - email
              - password
            properties:
              firstName:
                type: string
                minLength: 1
                maxLength: 50
                example: "John"
              lastName:
                type: string
                minLength: 1
                maxLength: 50
                example: "Doe"
              email:
                type: string
                format: email
                example: "john.doe@example.com"
              password:
                type: string
                minLength: 6
                format: password
                example: "securePassword123"
    responses:
      200:
        description: User registered successfully
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AuthResponse"
      400:
        description: Invalid input data
      409:
        description: Email already registered
```

## Testing API Contract

### Valid Request

```bash
curl -X POST https://api.example.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response**: 200 OK with `AuthResponse`

### Invalid Request - Missing Fields

```bash
curl -X POST https://api.example.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response**: 400 Bad Request with validation errors

### Invalid Request - Email Already Exists

```bash
curl -X POST https://api.example.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "existing@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response**: 409 Conflict with error message

## Backend Migration Notes

If migrating from old `SignUpRequest` format:

### Before

```typescript
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### After

```typescript
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Migration Strategy

1. Update backend API to accept both formats temporarily
2. Deploy frontend with new format
3. Remove old format support after frontend deployment
4. Combine firstName + lastName into User.name field

**Note**: This temporary dual-format support should be implemented and removed as quickly as possible to avoid technical debt.

## Summary

No new API contracts are required for this feature. The implementation relies on existing authentication infrastructure with a modified request format. The primary change is updating the `SignUpRequest` interface to use separate firstName and lastName fields.

All API communication is handled by:

- `AuthService.signUp()` in `src/api-services/auth.service.ts`
- `useAuth.signUp()` hook in `src/hooks/api/use-auth.ts`
- Type definitions in `src/api-services/types.ts`
