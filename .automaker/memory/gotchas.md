---
tags: [gotcha, mistake, edge-case, bug, warning]
summary: Mistakes and edge cases to avoid
relevantTo: [error, bug, fix, issue, problem]
importance: 0.9
relatedFiles: []
usageStats:
  loaded: 1
  referenced: 0
  successfulFeatures: 0
---
# Gotchas

Mistakes and edge cases to avoid. These are lessons learned from past issues.

---



#### [Gotcha] File upload patterns must change from direct server handling to presigned URL flow (2026-02-04)
- **Situation:** Server-side file handling utilities were removed during cleanup
- **Root cause:** External storage services require different upload mechanisms than direct server processing
- **How to avoid:** More complex upload flow but eliminates server storage requirements