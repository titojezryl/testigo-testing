---
tags: [architecture]
summary: architecture implementation decisions and patterns
relevantTo: [architecture]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 0
  referenced: 0
  successfulFeatures: 0
---
# architecture

### Maintained TanStack Query hooks while removing server-side code to preserve existing component interfaces (2026-02-04)
- **Context:** Components were built around TanStack Query mutation and query patterns
- **Why:** Avoiding massive component refactoring and preserving established data flow patterns
- **Rejected:** Switching to simple fetch calls would have required rewriting dozens of components
- **Trade-offs:** Easier migration path but requires maintaining external API contract compatibility
- **Breaking if changed:** Any component expecting server-side data transformation would fail silently