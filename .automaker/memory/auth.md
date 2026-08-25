---
tags: [auth]
summary: auth implementation decisions and patterns
relevantTo: [auth]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 0
  referenced: 0
  successfulFeatures: 0
---
# auth

#### [Gotcha] Client-side auth checks must replace route guards when removing server middleware (2026-02-04)
- **Situation:** Server-side route protection disappeared with backend removal
- **Root cause:** TanStack Router doesn't have built-in auth guards like the removed server middleware
- **How to avoid:** More client-side code but provides equivalent security UX