<!--
Sync Impact Report
- Version change: 0.1.0 → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → Layered Architecture Enforcement
  - [PRINCIPLE_2_NAME] → TanStack Query Standardization
  - [PRINCIPLE_3_NAME] → No Testing Policy
  - [PRINCIPLE_4_NAME] → TypeScript Strict Mode
  - [PRINCIPLE_5_NAME] → Drizzle ORM Compliance
- Removed sections: Test Coverage Requirements
- Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending
  - .specify/templates/spec-template.md ⚠ pending
  - .specify/templates/tasks-template.md ⚠ pending
  - .specify/templates/commands/*.md ⚠ pending
-->

# TanStack Fullstack Boilerplate Constitution

## Core Principles

### I. Layered Architecture Enforcement

All code must adhere to the strict layered architecture pattern with unidirectional dependencies (Routes → Components → Hooks → Queries → Fn → Data Access). No layer may import from higher layers or skip intermediate layers. Each layer must maintain single responsibility as defined in docs/architecture.md.

### II. TanStack Query Standardization

All data fetching operations must use TanStack Query with standardized patterns. Query keys must follow naming conventions, and all mutations must include appropriate invalidation patterns. Server functions must be the exclusive entry point for query operations.

### III. No Testing Policy

This project does not require any form of automated testing (unit tests, integration tests, or end-to-end tests). Code quality is maintained through architectural enforcement, type safety, and manual code review processes instead of test coverage requirements.

### IV. TypeScript Strict Mode

Strict TypeScript configuration enforced across all codebases (noImplicitAny, strictNullChecks, etc.). All public APIs must have complete type definitions. Type-only imports must be used where applicable to optimize bundle size.

### V. Drizzle ORM Compliance

All database interactions must use Drizzle ORM as defined in db/schema.ts. Raw SQL queries prohibited except for complex analytical operations. Schema migrations must follow DrizzleKit conventions with proper versioning.

## Technology Stack Constraints

- Frontend: TanStack Start with React 18
- State Management: TanStack Query exclusively
- Styling: Tailwind CSS with shadcn/ui components
- Database: PostgreSQL with Drizzle ORM
- Authentication: Lucia Auth
- File Storage: AWS S3 with presigned URLs

## Development Workflow

1. All features begin with specification in .specify/memory/
2. PRs require:
   - Passing CI lint checks
   - Architecture compliance review
   - Documentation updates
3. Versioning follows Semantic Versioning with conventional commits
4. Breaking changes require migration guide and 2-version deprecation cycle

## Governance

This constitution supersedes all other practices. Amendments require:

1. Constitution version bump according to semantic versioning
2. Documentation of changes in Sync Impact Report
3. Approval via PR with architecture team review
4. Migration plan for existing codebase

**Version**: 1.0.0 | **Ratified**: 2025-08-15 | **Last Amended**: 2026-02-04
