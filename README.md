# Frontend-Only React Application

A frontend-only React application that consumes external APIs, built with modern tooling and best practices.

## 🚀 Features

- **Landing Pages** - Modern, responsive landing page design
- **User Authentication** - OAuth/JWT integration with external providers
- **User Profiles** - User management and profile customization
- **File Upload/Download** - Integration with external storage services
- **Admin Dashboard** - User administration features

## 🛠️ Tech Stack

- **Framework**: [TanStack Router](https://tanstack.com/router) - Client-side routing
- **State Management**: [TanStack Query](https://tanstack.com/query) for server state
- **Styling**: Tailwind CSS with [Radix UI](https://www.radix-ui.com/) components
- **HTTP Client**: Axios with interceptors for API communication
- **Authentication**: External OAuth/JWT provider integration
- **File Storage**: External storage service integration (S3, R2, etc.)
- **TypeScript**: Full type safety throughout

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- External API services (authentication, storage, etc.)

## 🏃 Getting Started

### 1. Clone repository

```bash
git clone <repository-url>
cd automaker-starter-kit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and configure:

- External API base URL
- Authentication provider configuration
- External storage service details

### 4. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server on port 3000
npm run build        # Build for production (includes type checking)
npm run preview      # Preview production build locally
```

## 📁 Project Structure

```
src/
├── routes/              # File-based routing with TanStack Router
├── components/          # Reusable React components (ui/ subfolder for base components)
├── api-services/        # API service layer for external API communication
├── hooks/              # Custom React hooks for data fetching and state management
├── utils/              # Utility functions and helpers
└── config/             # Configuration files for environment variables
```

## 📚 API Service Architecture

### Service Layer Organization

- **Authentication Service** (`src/api-services/auth.service.ts`)
  - External OAuth provider integration
  - JWT token management with refresh logic
  - Session persistence in localStorage

- **User Service** (`src/api-services/user.service.ts`)
  - User profile management
  - Admin user management capabilities
  - Profile updates and avatar uploads
  - Search and pagination support

- **Storage Service** (`src/api-services/storage.service.ts`)
  - External file storage integration
  - Presigned URL generation
  - File validation and upload progress
  - Download URL generation with expiration

### HTTP Client Configuration

- **Base Client** (`src/api-services/client.ts`)
  - Axios instance with interceptors
  - Automatic token injection
  - Error handling and retry logic
  - Token refresh flow

### React Hooks

- **Auth Hooks** (`src/hooks/api/use-auth.ts`)
  - Authentication state management
  - Login/logout operations
  - Token refresh handling

- **User Hooks** (`src/hooks/api/use-users.ts`)
  - User data fetching and mutations
  - Profile management operations
  - Admin user management

- **Storage Hooks** (`src/hooks/api/use-storage.ts`)
  - File upload/download operations
  - Progress tracking
  - File validation

## 🏗️ Architecture Patterns

- **Data Fetching**: Centralized API service layer with TanStack Query hooks
- **Authentication**: External provider integration with token management
- **File Uploads**: Direct client uploads to external storage services
- **Error Handling**: Centralized error handling with user-friendly messages
- **Type Safety**: Full TypeScript with API contract types

## 🔧 External Service Requirements

This application requires the following external services to be configured:

### Backend API Server
- Handles authentication, user management, and business logic
- Must provide RESTful endpoints matching the service interfaces
- Base URL configured via `VITE_API_BASE_URL`

### Authentication Provider
- OAuth provider (Auth0, Clerk, Firebase Auth, etc.) or custom auth service
- Must support token-based authentication
- Callback URL configured via `VITE_AUTH_CALLBACK_URL`

### File Storage Service
- S3, Cloudflare R2, Google Cloud Storage, or similar object storage
- Must support presigned URL generation or direct uploads
- Configuration via `VITE_STORAGE_BASE_URL` and `VITE_STORAGE_BUCKET`

## 📖 Environment Configuration

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

## 🚀 Deployment

This application is designed for static deployment to CDNs or hosting platforms:

### Static Hosting Options
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- AWS S3 + CloudFront

### Build and Deploy

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🤝 Contributing

This project follows a clean architecture pattern with separation of concerns:

1. **API Services** - All external communication
2. **React Hooks** - State management and data fetching
3. **Components** - UI layer with no direct API calls
4. **Types** - TypeScript definitions for API contracts

## 📝 License

[Add your license here]

## 🔗 Links

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)