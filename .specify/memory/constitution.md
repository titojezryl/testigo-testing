<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial adoption)

Modified principles: N/A (initial creation)

Added sections:
- Clean Code Architecture
- Simple UI/UX Principles
- Responsive Design Standards
- Technology Stack Constraints

Removed sections: N/A

Templates requiring updates:
- ✅ .specify/templates/plan-template.md (Constitution Check section validated)
- ✅ .specify/templates/spec-template.md (Requirements section validated)
- ✅ .specify/templates/tasks-template.md (Task categorization validated)
- ⚠ pending - Consider agent-specific command file updates if needed

Follow-up TODOs: None
-->

# Automaker Starter Kit Constitution

## Core Principles

### I. Clean Code Architecture

Every feature MUST follow a layered architecture with strict separation of concerns:

- **Routes Layer** (`src/routes/`): File-based routing with TanStack Router, handles URL structure and route-level state only
- **Components Layer** (`src/components/`): Reusable UI components using shadcn (Radix UI) primitives and Tailwind CSS
- **Hooks Layer** (`src/hooks/`): Custom React hooks that bridge UI with API services using TanStack Query
- **API Services Layer** (`src/api-services/`): Centralized external API communication using Axios

**Rationale**: This separation ensures portability, testability, and maintainability. No component should directly call APIs—always go through hooks. No hook should directly call external APIs—always go through services.

**Enforcement Rules**:

- Components MUST receive data via props or hooks, NEVER make direct API calls
- Hooks MUST encapsulate TanStack Query logic and API service calls
- Services MUST handle HTTP communication, error handling, and token refresh
- Type definitions MUST be centralized in `src/api-services/types.ts`
- Utility functions MUST be in `src/lib/` and documented with JSDoc

### II. Simple UI/UX Principles

User interfaces MUST prioritize simplicity, clarity, and consistency:

- **Loading States**: Buttons show loading state but remain clickable (NEVER disable buttons)
- **Form Validation**: Use `react-hook-form` with `zod` schema validation, show field-specific errors
- **Toast Notifications**: Use `sonner` for success/error feedback after actions
- **Never Disrupt Flow**: Confirmations for destructive actions ONLY, avoid unnecessary modals
- **Progress Indicators**: Show progress for long-running operations (file uploads, data fetching)
- **Empty States**: Provide clear guidance when no data exists
- **Error Messages**: Must be actionable and user-friendly, not technical

**Rationale**: Simple interfaces reduce cognitive load and improve user satisfaction. Consistent patterns make the application predictable and easier to use.

**Component Library Rules**:

- Use shadcn UI components (Radix UI primitives) for all base UI elements
- Extend shadcn components in `src/components/ui/` when customization is needed
- Follow the UX patterns documented in `docs/ux.md`
- Tailwind utility classes MUST be used for styling, avoid custom CSS when possible
- Use `clsx` and `tailwind-merge` for conditional class management

### III. Responsive Design Standards

All interfaces MUST be responsive and accessible across device sizes:

- **Mobile-First**: Design for mobile devices first, then enhance for larger screens
- **Breakpoints**: Use Tailwind's default breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- **Touch Targets**: Minimum 44x44 pixels for interactive elements
- **Readability**: Text must be legible without zooming on mobile devices
- **Grid and Flexbox**: Use responsive layouts that adapt to viewport size
- **Testing**: Verify functionality on multiple viewport sizes during development

**Rationale**: Users access applications from various devices. Responsive design ensures usability regardless of device.

**Enforcement Rules**:

- All page layouts MUST be tested at mobile (320px), tablet (768px), and desktop (1024px+) widths
- Navigation patterns MUST adapt to mobile (hamburger menu, bottom bars, etc.)
- Forms MUST be usable on mobile with appropriate input types (keyboard, picker)
- Charts and tables MUST be horizontally scrollable or responsive on mobile

## Technology Stack Constraints

### Mandatory Technologies

- **Routing**: TanStack Router (@tanstack/react-router) - File-based, type-safe routing
- **State Management**: TanStack Query (@tanstack/react-query) - Server state and caching
- **Styling**: Tailwind CSS 4.x - Utility-first CSS framework
- **Components**: shadcn UI (Radix UI primitives) - Accessible, unstyled components
- **Forms**: react-hook-form + zod - Form validation with TypeScript
- **HTTP Client**: Axios - API communication with interceptors
- **TypeScript**: 5.x - Full type safety across the codebase
- **Build Tool**: Vite - Fast development and production builds

### Architectural Pattern

- **Frontend-Only**: This is a client-side only application consuming external APIs
- **No Backend Code**: No server-side logic, databases, or file storage in this repository
- **External Services**: Authentication, user management, and file storage are external services

### Version Management

- **Constitution Versioning**: MAJOR.MINOR.PATCH (e.g., 1.0.0)
  - MAJOR: Backward incompatible principle removals or redefinitions
  - MINOR: New principles added or materially expanded guidance
  - PATCH: Clarifications, wording, or typo fixes
- **Dependency Updates**: Must maintain backward compatibility or include migration guide
- **Breaking Changes**: Documented with clear upgrade path

## Code Quality Standards

### TypeScript Best Practices

- **Strict Mode**: TypeScript strict mode MUST be enabled
- **No Any Types**: Use proper types or `unknown` instead of `any`
- **Interface vs Type**: Prefer `interface` for object shapes, `type` for unions/intersections
- **Exhaustive Checks**: Use discriminated unions and `never` for exhaustive type checks
- **Imports**: Use explicit imports (no wildcard imports) except for re-exports

### Component Design Patterns

- **Composition over Inheritance**: Prefer composition for building complex components
- **Props Interfaces**: Define props as interfaces with clear documentation
- **Default Props**: Use default parameters instead of default props pattern
- **Event Handlers**: Memoize event handlers with `useCallback` when passed as props
- **Optimization**: Use `React.memo` only when profiling indicates need

### Error Handling

- **Validation**: Client-side validation for all user inputs using zod schemas
- **API Errors**: Centralized error handling in Axios interceptors
- **User Messages**: Display user-friendly error messages, not stack traces
- **Logging**: Log errors to console in development environments only

## Development Workflow

### Feature Development Process

1. **Specification**: Create feature spec using `/speckit.specify` with user stories
2. **Planning**: Run `/speckit.plan` to generate implementation plan and research
3. **Implementation**: Follow tasks from `/speckit.tasks` organized by user story priority
4. **Testing**: Verify at mobile, tablet, and desktop viewport sizes
5. **Review**: All code must comply with this constitution before merging

### Code Review Requirements

- **Constitution Compliance**: Verify all principles are followed
- **Type Safety**: No TypeScript errors or `any` types
- **Responsive Design**: Test on multiple viewport sizes
- **UX Consistency**: Follow patterns in `docs/ux.md`
- **Clean Code**: Verify separation of concerns (routes → components → hooks → services)

### Quality Gates

- **Type Checking**: `tsc --noEmit` must pass with no errors
- **Build**: `npm run build` must complete successfully
- **Linting**: ESLint rules (if configured) must pass
- **Manual Testing**: Browser testing at multiple viewport sizes

## Governance

### Constitution Authority

This constitution supersedes all conflicting practices and guidelines. All code reviews, feature implementations, and architectural decisions MUST comply with these principles.

### Amendment Process

1. Propose amendment with clear rationale and impact analysis
2. Update version according to semantic versioning rules
3. Update dependent templates and documentation
4. Document in Sync Impact Report at top of constitution file
5. Communicate changes to team members

### Compliance Enforcement

- **Pull Request Reviews**: MUST verify constitution compliance
- **Complexity Justification**: Any deviation from principles must be explicitly justified
- **Runtime Guidance**: Use project documentation (README.md, docs/) for implementation guidance
- **Conflict Resolution**: Constitution is the source of truth; update it rather than making exceptions

### Maintenance

- **Regular Review**: Review principles quarterly for relevance
- **Template Updates**: Keep templates aligned with current constitution
- **Documentation Sync**: Ensure docs/ files reflect current practices

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
