---
name: eod-report
description: Drafts a plain-language end-of-day (EOD) progress report for supervisors from today's project updates. Use when the user asks for an EOD, end-of-day report, daily progress report, standup summary for a supervisor, or what they got done today.
---

# EOD Report Maker

Produce a supervisor-ready daily report from **what changed in the project today**. Write for **non-technical readers** (managers, clients, stakeholders).

## When to run

Apply when the user asks for an EOD / daily progress / supervisor update. Do **not** invent work — only report evidence found in the repo for the reporting day.

## Workflow

Copy and track:

```
EOD Progress:
- [ ] 1. Determine reporting day and delta scope
- [ ] 2. Gather today's project updates
- [ ] 3. Group into business-facing themes
- [ ] 4. Ask for in-progress / blockers / tomorrow / CC if missing
- [ ] 5. Draft report using the exact output format below
```

### 1. Determine reporting day and delta scope

- Default reporting day: **today** from user/system date.
- If the user mentions a prior EOD or “new since last report,” treat that prior report as the baseline and include **only new work** after it.
- If no prior EOD is in the conversation, report **all project updates for the reporting day**.

### 2. Gather today's project updates

Run in parallel (prefer Shell / git):

1. `git log` for the reporting day (`--since` / `--until`, or equivalent) — subjects + touched paths
2. New or changed files under `docs/qa/` for that day (feature handoffs)
3. Related feature docs under `docs/` when they clarify what shipped
4. `git status` only if uncommitted work is clearly part of “today”

If there are no commits and no meaningful file changes for the day, say so briefly and ask what to include (meetings, blockers, planned work).

**Do not** deep-dive the whole codebase. Prefer commit messages, paths, and short overview sections of new docs/QA files.

### 3. Group into business-facing themes

Cluster commits/files into numbered **TASK ACCOMPLISHED** items (usually 3–6):

- What users or admins can do now
- Learning / exam experience improvements
- Payments, accounts, or access control
- Reliability, polish, or setup that unblocks the team

Skip merge-noise, lockfile-only noise, and pure tooling unless it affects delivery.

### 4. Fill sections git cannot know

Before finalizing, use conversation context or ask briefly for:

| Section | If missing |
| --- | --- |
| **IN PROGRESS** | Ask what is still underway; if nothing, write `NONE` |
| **BLOCKERS/IMPEDIMENTS** | Ask; if none, write `NONE` |
| **PLAN FOR TOMORROW** | Ask or infer only from explicit user intent / open work |
| **CC** | Default `@Eliakim Toluan` `@Bea Donor` unless user specifies others |

Do not invent blockers or tomorrow plans.

### 5. Draft the report

**Always use the exact output format in [Report template](#report-template).** Do not use Summary / Focus / markdown tables / horizontal rules.

Language rules:

- **Plain language first.** Prefer “Students can take a practice exam by subject” over route or library names.
- **One idea per bullet.** Lead with outcome, not implementation.
- Every numbered task ends with a final bullet:  
  `Who benefits: [stakeholders]; ready for testing — yes|no`
- **Translate jargon** when a technical detail is needed:

  | Instead of… | Write… |
  | --- | --- |
  | migration / schema | database updates |
  | seed script | loading the question set into the system |
  | middleware / guards | access rules (who can open which pages) |
  | SM-2 / spaced repetition | smart review schedule that brings back weak topics |
  | Gemini / AI tutor | AI study help during the exam |
  | QA test cases | step-by-step testing checklist for QA |
  | PR / merge | delivered / completed into the shared project |
  | RAG / pgvector | smart search over study materials (only if user already used that label in IN PROGRESS) |

- No code blocks in the supervisor report unless the user asks.
- No file paths in the report body.
- Tone: professional, confident, factual. No hype.

## Report template

Use this structure **verbatim** (bold labels, section order, spacing). Output as markdown the user can paste into chat/email:

```markdown
**END OF DAY REPORT**

**PROJECT:** TESTIGO

**TASK ACCOMPLISHED:**
1. [Theme in everyday words]
- [Outcome / capability]
- [Supporting detail if needed]
- Who benefits: [students|admins|QA|engineering]; ready for testing — [yes|no]

2. [Theme in everyday words]
- [Outcome / capability]
- Who benefits: [stakeholders]; ready for testing — [yes|no]

**IN PROGRESS:**
- [Ongoing work, or NONE]

**BLOCKERS/IMPEDIMENTS:**
- [Blocker, or NONE]

**PLAN FOR TOMORROW:**
- [Next concrete plan]

**CC:** @Eliakim Toluan @Bea Donor
**DATE:** [MM/DD/YYYY]
```

### Formatting rules matching the team template

- Title line: `**END OF DAY REPORT**` (all caps)
- Section headers in bold all caps with colon: `**PROJECT:**`, `**TASK ACCOMPLISHED:**`, `**IN PROGRESS:**`, `**BLOCKERS/IMPEDIMENTS:**`, `**PLAN FOR TOMORROW:**`, `**CC:**`, `**DATE:**`
- **TASK ACCOMPLISHED** uses a **numbered** list for themes; details under each theme are **bullets**
- Last bullet under each numbered task is always the Who benefits / ready for testing line
- Blank line between numbered tasks
- Date format: `MM/DD/YYYY` for the reporting day
- Default project name unless user overrides: `NARS - Nursing AI Review System`

## Delta reports (new since last EOD)

When the user asks for only what was **not** in the last EOD:

1. Use the prior EOD in the conversation as the baseline.
2. Gather updates after that cutoff.
3. Put only new themes under **TASK ACCOMPLISHED**.
4. Still include IN PROGRESS / BLOCKERS / PLAN / CC / DATE.

## Anti-patterns

- Dumping raw `git log` or file lists as the report
- Stack-heavy language (frameworks, ORMs, routes, components) as the main content
- Claiming unfinished work under **TASK ACCOMPLISHED** (put it under **IN PROGRESS**)
- Adding Summary, Focus, or “Ready for testing” tables — those are not in this template
- Inventing blockers or tomorrow plans
- Mentioning internal agent/skills/tooling process

## Examples

**Good numbered task:**

```markdown
1. Full mock exam experience
- Subscribed students can start a 100-item mock from the dashboard, answer with immediate feedback, optionally chat with AI study help, finish, and see scored results with mastery updates.
- Results pages show calm loading placeholders instead of a blank wait.
- Who benefits: students; ready for testing — yes
```

**Weak numbered task:**

```markdown
1. Exam session store + Gemini panel
- Implemented Zustand exam-session and Drizzle exam_sessions migration.
- Who benefits: students; ready for testing — yes
```
