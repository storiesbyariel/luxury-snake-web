# CONTRIBUTING

## Role Matrix (Agent Operating Policy)

| Role | Primary Mission | Can Push to `main` | Can Open Issues | Can Open PRs | Can Approve PRs | Can Merge PRs |
|---|---|---:|---:|---:|---:|---:|
| QA Agent | Find defects/usability issues and report evidence | No | Yes | No | No | No |
| Execution Agent | Implement gameplay/UX/code fixes | Yes (small trusted fixes) | Yes | Yes | Yes (on tech-art PRs) | Yes |
| Technical Artist Agent | Visual polish and motion/feel improvements | No (branch-first) | Yes | Yes | Yes (on execution PRs) | No (unless explicitly delegated) |

## Hard Guardrails

### QA Agent (strict)
- QA files findings as **GitHub issues only**.
- QA must **not** push QA report artifacts (e.g., `QA_REPORT.md`) to `main`.
- QA must **not** ship code fixes.
- QA issue template requirements:
  - repro steps
  - expected vs actual
  - severity/impact
  - environment/context

### Execution Agent
- Preferred path: branch + PR.
- May push directly to `main` only for small, low-risk fixes explicitly approved in-session.
- Must reference/close issues in commits or PR body when fixing tracked defects (e.g., `Fixes #12`).

### Technical Artist Agent
- Works on dedicated branches (e.g., `tech-art/*`).
- Visual polish only unless explicitly expanded in scope.
- Must open PR with before/after notes and quick verification steps.

## PR Review Matrix

- **Execution PRs** can be reviewed/approved by **Technical Artist**.
- **Technical Artist PRs** can be reviewed/approved by **Execution**.
- **QA** does not approve/merge; QA validates and comments via issues.

## Default Workflow

1. QA scans and files issues.
2. Execution and/or Technical Artist implement via PRs.
3. Cross-review between Execution and Technical Artist.
4. Merge after quick smoke checks and issue references.
5. QA re-validates closed issues.

## Quality Gates (minimum)

- Keep GitHub Pages root compatibility intact.
- Preserve accessibility baseline and input reliability.
- Include short manual verification steps in PR description.
- Keep changes small and shippable.
