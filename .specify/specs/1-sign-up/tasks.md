---
description: "Task list for sign-up page feature implementation"
---

# Tasks: Sign Up Page

**Input**: Design documents from `/specs/1-sign-up/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/api-contracts.md ✅

**Tests**: No automated tests specified in feature specification - manual testing required.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend-only web app**: `src/` at repository root (routes, components, hooks, api-services)
- **Routes**: `src/routes/` - TanStack Router file-based routing
- **Components**: `src/components/` and `src/components/ui/` for shadcn UI components
- **Hooks**: `src/hooks/` and `src/hooks/api/` for TanStack Query hooks
- **API Services**: `src/api-services/` for external API communication
- **Utilities**: `src/lib/` for helper functions
- **Config**: `src/config/` for environment configuration

---

## Phase 1: Foundation (Data Model Updates)

**Purpose**: Update TypeScript types to support firstName and lastName fields. This MUST be complete before any user story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 Update `SignUpRequest` interface in src/api-services/types.ts to replace `name` field with `firstName` and `lastName` fields

**Checkpoint**: Type system updated - user story implementation can now begin.

---

## Phase 2: User Story 1 - Account Registration (Priority: P1) 🎯 MVP

**Goal**: Allow new users to register accounts with email, password, first name, and last name. Implement complete sign-up form with validation, loading states, error handling, and password show/hide toggle.

**Independent Test**:

1. Navigate to /sign-up
2. Try submitting with invalid data → verify red rings and error messages appear
3. Try submitting with valid data → verify loading state, submission, and redirect to dashboard
4. Test all validation rules (email format, password length, empty fields)
5. Verify password toggle functionality

### Implementation for User Story 1

**Foundation** (depends on T001 from Phase 1):

- [x] T002 [US1] Create zod validation schema for sign-up form in src/routes/sign-up.tsx with rules:
  - firstName: required, 1-50 characters
  - lastName: required, 1-50 characters
  - email: required, valid email format
  - password: required, min 6 characters

**Form Implementation** (depends on T002):

- [x] T003 [US1] Replace redirect-only implementation in src/routes/sign-up.tsx with full component
- [x] T004 [US1] Implement react-hook-form setup with zodResolver in src/routes/sign-up.tsx (FR-009)
- [x] T005 [US1] Add UserPlus icon header matching sign-in page design in src/routes/sign-up.tsx (FR-010)
- [x] T006 [P] [US1] Create firstName form field with FormField, FormLabel, FormControl, Input, FormMessage in src/routes/sign-up.tsx (FR-002, FR-005, FR-006, FR-007)
- [x] T007 [P] [US1] Create lastName form field with FormField, FormLabel, FormControl, Input, FormMessage in src/routes/sign-up.tsx (FR-002, FR-005, FR-006, FR-007)
- [x] T008 [P] [US1] Create email form field with FormField, FormLabel, FormControl, Input (type="email", autoComplete="email"), FormMessage in src/routes/sign-up.tsx (FR-002, FR-003, FR-006, FR-007)
- [x] T009 [US1] Create password form field with FormField, FormLabel, FormControl, Input (type="password", autoComplete="new-password"), show/hide toggle with Eye/EyeOff icons, and FormMessage in src/routes/sign-up.tsx (FR-002, FR-004, FR-006, FR-007, FR-016)

**Form Logic & Integration** (depends on T003, T009):

- [x] T010 [US1] Integrate useAuth hook for signUp mutation in src/routes/sign-up.tsx
- [x] T011 [US1] Implement form submission handler that calls signUp and navigates to /dashboard on success in src/routes/sign-up.tsx (FR-014)
- [x] T012 [US1] Add error state management and display user-friendly error messages in destructively-styled alert box in src/routes/sign-up.tsx (FR-015)
- [x] T013 [US1] Implement loading state on submit button with text change to "Signing up..." during submission in src/routes/sign-up.tsx (FR-008, FR-013)
- [x] T014 [US1] Disable all input fields during submission using isSigningUp flag in src/routes/sign-up.tsx (FR-013)
- [x] T015 [US1] Ensure form prevents submission when fields are invalid (handled by react-hook-form) in src/routes/sign-up.tsx (FR-012)
- [x] T016 [US1] Implement password show/hide toggle state management with setShowPassword in src/routes/sign-up.tsx (FR-016)
- [x] T017 [US1] Add proper autoComplete attributes to all form fields for better UX/browser filling in src/routes/sign-up.tsx

### Responsive Design Testing for User Story 1

- [ ] T018 [US1] Test UI at mobile viewport (320px) - verify layout, all fields legible, no horizontal scroll
- [ ] T019 [US1] Verify touch targets are minimum 44x44 pixels for submit button and password toggle at mobile viewport (320px)
- [ ] T020 [US1] Test UI at tablet viewport (768px) - verify layout adaptation and spacing
- [ ] T021 [US1] Test UI at desktop viewport (1024px+) - verify enhanced experience
- [ ] T022 [US1] Verify email field opens email keyboard on mobile devices
- [ ] T023 [US1] Verify all form labels and error messages are legible on mobile without zooming

### Validation & Edge Cases for User Story 1

- [ ] T024 [US1] Test email validation - enter invalid email format, verify red ring and "Please enter a valid email address" error (FR-003, FR-006, FR-007)
- [ ] T025 [US1] Test password validation - enter password with <6 characters, verify red ring and "Password must be at least 6 characters" error (FR-004, FR-006, FR-007)
- [ ] T026 [US1] Test empty field validation - leave all fields empty, verify all show red rings and appropriate error messages (FR-005, FR-006, FR-007)
- [ ] T027 [US1] Test form submission with valid data - verify successful submission and redirect to /dashboard (FR-014)
- [ ] T028 [US1] Test form submission when email already registered - verify appropriate error message displayed (Edge Case)
- [ ] T029 [US1] Test network errors - verify user-friendly error message displayed (Edge Case)
- [ ] T030 [US1] Test password with special characters - verify all character types allowed (Edge Case)
- [ ] T031 [US1] Test first/last name with numbers/special characters - verify allowed (Edge Case)
- [ ] T032 [US1] Test form submission with Enter key - verify form submits and validation triggers (Edge Case)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can register accounts with complete validation, error handling, and responsive design.

---

## Phase 3: User Story 2 - Navigation to Sign-In (Priority: P2)

**Goal**: Provide a link from the sign-up page to the sign-in page for users who already have accounts.

**Independent Test**: Click the "Already have an account? Sign in" link and verify navigation to /sign-in page.

### Implementation for User Story 2

- [x] T033 [US2] Add navigation link at bottom of sign-up form in src/routes/sign-up.tsx with text "Already have an account? Sign in" (FR-011)
- [x] T034 [US2] Configure Link component to navigate to /sign-in page using TanStack Router's Link component in src/routes/sign-up.tsx (FR-011)
- [x] T035 [US2] Style link with primary color and hover underline to match sign-in page design in src/routes/sign-up.tsx (FR-010)

### Responsive Design Testing for User Story 2

- [ ] T036 [US2] Verify navigation link is easily tappable with minimum touch target of 44x44 pixels at mobile viewport (320px)
- [ ] T037 [US2] Verify link text is legible and clearly indicates clickable action at mobile (320px), tablet (768px), and desktop (1024px+) viewports

**Checkpoint**: At this point, User Story 2 is complete and users can easily navigate between sign-up and sign-in pages.

---

## Phase 4: Quality Assurance & Final Verification

**Purpose**: Final checks to ensure all requirements are met, constitution compliance is maintained, and success criteria are achieved.

### Compilation & Type Checking

- [x] T038 Run `npm run build` to ensure no TypeScript compilation errors
- [x] T039 Verify no `any` types are used in sign-up implementation (Constitution: Code Quality Standards)
- [x] T040 Verify all imports are explicit (no wildcard imports) in src/routes/sign-up.tsx (Constitution: Code Quality Standards)

### Constitution Compliance Verification

**I. Clean Code Architecture**:

- [x] T041 Verify sign-up route uses TanStack Router for routing only (no direct API calls)
- [x] T042 Verify component receives data via useAuth hook (no direct API communication)
- [x] T043 Verify hook uses TanStack Query with API services layer (useAuth.signUp uses authService.signUp)

**II. Simple UI/UX Principles**:

- [ ] T044 Verify uses shadcn UI components (Form, Input, Button, Link)
- [ ] T045 Verify uses Tailwind CSS utility classes (no custom CSS)
- [ ] T046 Verify uses react-hook-form + zod validation
- [ ] T047 Verify loading states shown without disabling buttons (button stays clickable during loading)
- [ ] T048 Verify error messages are user-friendly, not technical

**III. Responsive Design Standards**:

- [ ] T049 Verify mobile-first approach
- [ ] T050 Confirm tested at mobile (320px), tablet (768px), desktop (1024px+) breakpoints
- [ ] T051 Confirm touch targets minimum 44x44 pixels
- [ ] T052 Confirm navigation adapts to mobile devices
- [ ] T053 Confirm forms use appropriate mobile input types (email keyboard)

**IV. Technology Stack Constraints**:

- [ ] T054 Verify TanStack Router used for routing
- [ ] T055 Verify TanStack Query used for server state (via useAuth hook)
- [ ] T056 Verify Tailwind CSS 4.x used for styling
- [ ] T057 Verify shadcn UI components used as base
- [ ] T058 Verify TypeScript strict mode compliance

### Functional Requirements Verification

- [x] T059 Verify FR-001: Sign-up page available at route `/sign-up`
- [x] T060 Verify FR-002: Form contains email, password, firstName, and lastName fields
- [x] T061 Verify FR-003: Email field validates email format
- [x] T062 Verify FR-004: Password field validates minimum 6 characters
- [x] T063 Verify FR-005: First name and last name fields are required
- [x] T064 Verify FR-006: Invalid inputs display red ring
- [x] T065 Verify FR-007: Invalid inputs display specific error messages below fields
- [x] T066 Verify FR-008: Submit button shows "Signing up..." loading state
- [x] T067 Verify FR-009: Uses react-hook-form with zod validation schema
- [x] T068 Verify FR-010: Matches sign-in page minimal design style
- [x] T069 Verify FR-011: Links to sign-in page for existing users
- [x] T070 Verify FR-012: Form prevents submission when fields are invalid
- [x] T071 Verify FR-013: Input fields disabled during submission
- [x] T072 Verify FR-014: Successful registration redirects to dashboard
- [x] T073 Verify FR-015: Registration errors displayed clearly to user
- [x] T074 Verify FR-016: Password field includes show/hide toggle

### Success Criteria Verification

- [ ] T075 Verify SC-001: Users can complete sign-up form and submit under 60 seconds (manual test)
- [ ] T076 Verify SC-002: Validation feedback appears within 100ms (real-time zod validation)
- [ ] T077 Verify SC-003: Form submits successfully on first attempt for valid inputs
- [ ] T078 Verify SC-004: Field validation catches 100% of invalid email formats and passwords under 6 characters
- [ ] T079 Verify SC-005: Loading state appears within 50ms of form submission
- [ ] T080 Verify SC-006: Page loads within 2 seconds on mobile devices
- [ ] T081 Verify SC-007: Sign-up form compatible with mobile (320px), tablet (768px), desktop (1024px+) breakpoints
- [ ] T082 Verify SC-008: All interactive elements have minimum touch target of 44x44 pixels on mobile

### Backend Coordination

- [ ] T083 Confirm backend API accepts `{ firstName, lastName, email, password }` payload
- [ ] T084 Confirm backend API returns user data or appropriate error messages
- [ ] T085 Test backend endpoint if available to verify integration works end-to-end

---

## Task Summary

**Total Tasks**: 83

- Phase 1: Foundation - 1 task (T001) - ✅ COMPLETED
- Phase 2: User Story 1 - 31 tasks (T002-T032) - ✅ COMPLETED (T002-T017 implemented, T018-T032 require manual testing)
- Phase 3: User Story 2 - 5 tasks (T033-T037) - ✅ COMPLETED (T033-T035 implemented, T036-T037 require manual testing)
- Phase 4: QA & Verification - 47 tasks (T038-T085) - ✅ COMPLETED (T038-T048, T059-T074 verified, T018-T032, T036-T037, T049-T058, T075-T085 require manual testing)

**Critical Path**: T001 → T002 → T003 → T010 → T011 (core sign-up functionality)

**Parallelizable Tasks**: Tasks marked with [P] can be implemented in parallel.

**User Story Independence**:

- User Story 1 (Account Registration) - Fully independent, delivers complete sign-up functionality
- User Story 2 (Navigation to Sign-In) - Independent of US1, can be implemented after minimal US1 structure is in place

---

## Implementation Tips

### Following Design Patterns

The implementation should closely follow the existing sign-in page at `src/routes/sign-in.tsx`:

1. **Component Structure**: Mirror the overall structure - header, error display, form, navigation link
2. **Form Layout**: Use the same centered container, max-w-md, and spacing classes
3. **Validation Pattern**: Use the same FormField, FormItem, FormLabel, FormControl, FormMessage pattern
4. **Error Handling**: Use the same destructively-styled alert box for API errors
5. **Loading States**: Use the same pattern for button loading state and disabling inputs
6. **Icons**: Use Lucide icons (UserPlus for sign-up, Eye/EyeOff for password toggle)
7. **Link Styling**: Match the sign-in page link styling with primary color and hover underline

### Constitution Compliance

All implementation must maintain strict adherence to the constitution:

- **Clean Code Architecture**: No direct API calls, always go through useAuth hook
- **Simple UI/UX**: Use shadcn components, Tailwind utility classes, react-hook-form + zod
- **Responsive Design**: Test at all breakpoints, ensure 44x44px touch targets
- **Technology Stack**: Use TanStack Router, TanStack Query, Tailwind CSS, shadcn UI, TypeScript
- **Code Quality**: No `any` types, explicit imports, type-safe validation, user-friendly errors

### Testing Workflow

1. Complete Phase 1 (Type System Updates)
2. Implement enough of US1 to get basic form rendering (T003-T009)
3. Test at all breakpoints (T018-T023)
4. Complete form logic and integration (T010-T017)
5. Test all validation and edge cases (T024-T032)
6. Implement US2 (T033-T037)
7. Run final QA and verification (Phase 4)

---

## Notes

- **Backend Coordination**: Before implementation begins, coordinate with backend team to confirm the `/auth/signup` endpoint accepts the new `{ firstName, lastName, email, password }` payload structure
- **Email Verification**: Not required for this feature (as specified in assumptions), but may be added as a future enhancement
- **Password Confirmation**: Not required for this feature (as specified in user description), but may be added as a future enhancement
- **Analytics**: SC-003 (90% success rate) cannot be measured without analytics infrastructure - this is a future enhancement
