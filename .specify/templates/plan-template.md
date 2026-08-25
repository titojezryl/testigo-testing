# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x with strict mode enabled  
**Primary Dependencies**: TanStack Router (routing), TanStack Query (state), Tailwind CSS 4.x (styling), shadcn UI (components), React 19.x, Vite 7.x  
**Storage**: N/A (frontend-only, external API services)  
**Testing**: Manual testing at multiple viewport sizes; automated tests optional  
**Target Platform**: Web browsers (mobile, tablet, desktop) with responsive design  
**Project Type**: Web - Frontend-only application consuming external APIs  
**Performance Goals**: Fast page loads, smooth 60fps animations, efficient TanStack Query caching  
**Constraints**: Mobile-first responsive design, accessible (WCAG AA where possible), TypeScript strict mode  
**Scale/Scope**: Typical SPA with multiple pages (landing, auth, dashboard, etc.)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**I. Clean Code Architecture**

- [ ] Routes layer uses TanStack Router for routing only (no direct API calls)
- [ ] Components receive data via props/hooks, no direct API communication
- [ ] Hooks use TanStack Query with API services layer
- [ ] API services layer handles all external HTTP communication
- [ ] Type definitions centralized in `src/api-services/types.ts`

**II. Simple UI/UX Principles**

- [ ] Uses shadcn UI components (Radix UI primitives) where applicable
- [ ] Tailwind CSS utility classes used for styling (avoid custom CSS)
- [ ] Form validation with `react-hook-form` + `zod`
- [ ] Loading states shown without disabling buttons
- [ ] Toast notifications for user feedback (sonner)
- [ ] Empty states provided where applicable

**III. Responsive Design Standards**

- [ ] Mobile-first approach confirmed
- [ ] Tested at mobile (320px), tablet (768px), desktop (1024px+) breakpoints
- [ ] Touch targets minimum 44x44 pixels
- [ ] Navigation adapts to mobile devices
- [ ] Forms usable on mobile (appropriate input types)

**IV. Technology Stack Constraints**

- [ ] TanStack Router used for routing
- [ ] TanStack Query used for server state
- [ ] Tailwind CSS 4.x used for styling
- [ ] shadcn UI (Radix UI) components used as base
- [ ] AXIOS used for API communication
- [ ] TypeScript strict mode enabled

**V. Code Quality Standards**

- [ ] No `any` types in type definitions
- [ ] Explicit imports (no wildcard imports)
- [ ] Event handlers memoized with `useCallback` when needed
- [ ] Error handling: user-friendly messages, no stack traces
- [ ] Client-side validation for all user inputs

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── routes/              # TanStack Router file-based routing
├── components/          # Reusable React components
│   └── ui/             # shadcn UI components (Radix UI primitives)
├── api-services/       # External API communication layer
│   ├── client.ts       # Axios instance with interceptors
│   ├── auth.service.ts # Authentication API service
│   ├── user.service.ts # User management API service
│   ├── storage.service.ts # File storage API service
│   └── types.ts        # TypeScript API contract types
├── hooks/              # Custom React hooks
│   └── api/            # TanStack Query hooks
├── lib/                # Utility functions
└── config/             # Environment configuration

docs/                   # Project documentation
public/                 # Static assets
```

**Structure Decision**: Frontend-only TanStack Router application with layered architecture (routes → components → hooks → services)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
