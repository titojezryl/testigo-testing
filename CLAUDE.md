# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a frontend-only React application with TanStack Router that consumes external APIs. The architecture has been refactored from a full-stack application to a clean client-side implementation.

### Tech Stack

- **Framework**: TanStack Router (client-side routing)
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with Radix UI components
- **HTTP Client**: Axios with interceptors for API calls
- **Authentication**: External provider integration (OAuth/JWT)
- **File Storage**: External storage service integration
- **TypeScript**: Full type safety throughout

### Project Structure

- `src/routes/` - File-based routing with TanStack Router
- `src/components/` - Reusable React components with `ui/` subfolder for base components
- `src/api-services/` - API service layer for external API communication
- `src/hooks/` - Custom React hooks for data fetching and state management
- `src/utils/` - Utility functions and helpers

### API Service Layer

- **Base HTTP Client**: `src/api-services/client.ts` with interceptors for auth tokens and error handling
- **Domain Services**: Organized service modules (`auth.service.ts`, `user.service.ts`, `storage.service.ts`)
- **Type Definitions**: External API contract types in `src/api-services/types.ts`
- **React Hooks**: TanStack Query hooks in `src/hooks/api/` for data fetching

### Key Patterns

- **Data Fetching**: Centralized API service layer with TanStack Query hooks
- **Authentication**: External provider integration with token management
- **File Uploads**: Direct client uploads to external storage services
- **Error Handling**: Centralized error handling with user-friendly messages
- **Type Safety**: Full TypeScript with API contract types

## Common Development Commands

```bash
# Development
npm run dev                 # Start development server on port 3000
npm run build              # Build for production (includes type checking)
npm run preview            # Preview production build locally
```

## Environment Setup

1. Copy `.env.example` to `.env` and configure:
   - External API base URL
   - Authentication provider configuration
   - External storage service details

2. No database setup required - the app consumes external APIs only.

## Development Notes

- Uses TanStack Router's file-based routing system (client-side only)
- All data flows through the centralized API service layer
- Authentication tokens are stored in localStorage with automatic refresh
- File uploads use presigned URLs or direct client uploads
- Build process includes TypeScript type checking

## API Service Architecture

### Authentication Service
- External OAuth provider integration
- JWT token management with refresh logic
- Email/password authentication support
- Session persistence in localStorage

### User Service
- User profile management
- Admin user management capabilities
- Profile updates and avatar uploads
- Search and pagination support

### Storage Service
- External file storage integration
- Presigned URL generation
- File validation and upload progress
- Download URL generation with expiration

## External Dependencies

This application requires the following external services to be running:

1. **Backend API Server** - Handles authentication, user management, and business logic
2. **Authentication Provider** - OAuth provider (Auth0, Clerk, etc.) or custom auth service
3. **File Storage Service** - S3, Cloudflare R2, or similar object storage
4. **Optional AI Service** - For AI-powered features (Anthropic Claude API)

## Configuration

### Environment Variables

```bash
# External API Configuration
VITE_API_BASE_URL="http://localhost:8000/api"

# External Authentication
VITE_AUTH_PROVIDER_URL="https://your-auth-provider.com"
VITE_AUTH_CLIENT_ID=""
VITE_AUTH_CALLBACK_URL="http://localhost:3000/auth/callback"

# External Storage
VITE_STORAGE_BASE_URL="https://your-storage-service.com"
VITE_STORAGE_BUCKET=""

# Anthropic (for AI features)
ANTHROPIC_API_KEY=""
```

## Development Guidelines

### Adding New API Endpoints

1. Define types in `src/api-services/types.ts`
2. Add methods to the appropriate service in `src/api-services/`
3. Create TanStack Query hooks in `src/hooks/api/`
4. Use hooks in components with proper error handling

### Error Handling

- API service handles network errors and authentication failures
- Components should display user-friendly error messages
- Use mutation status for loading states and success feedback

### Authentication Flow

- Tokens stored in localStorage with automatic refresh
- Redirect to login on authentication failure
- Route protection implemented at the component level