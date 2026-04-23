# Table Talk — Instructions for Claude

This file loads automatically whenever Claude Code runs in this repo. Any change you make must follow the rules below so all 4 developers stay in sync.

---

## About this project

Table Talk is a React + Node/Express + MongoDB app that helps org admins create events and auto-group members by shared interests (hobbies, budget, MBTI). It's being built by 4 beginner developers working in parallel for an MVP launch. Keep changes small, predictable, and matched to the existing code style.

**Stack:**
- Frontend: React (Vite), React Router, react-toastify, plain CSS in `frontend/src/index.css`
- Backend: Node, Express, MongoDB via Mongoose, JWT auth
- API base URL: `http://localhost:3000/api/v1`

---

## The golden rule: DO NOT edit `frontend/src/index.css`

Four devs are working in parallel. If more than one of us edits `index.css`, git conflicts are almost guaranteed.

- **Never add new CSS classes or variables.** Use what's already there (list below).
- **Never hardcode colors, fonts, spacing, or border styles.** Always reference a CSS variable.
- If you genuinely need a style that doesn't exist, **stop and ask the user first** — don't silently add it.
- Small inline style adjustments using existing CSS variables are fine (e.g. `style={{ marginTop: '8px', color: 'var(--text-muted)' }}`).

---

## Design system — use these variables only

All values live in `:root` in [index.css](frontend/src/index.css).

### Colors
| Variable | Use for |
|---|---|
| `var(--primary)` | Main brand orange (#C44C00) — buttons, active states, links |
| `var(--primary-dark)` | Button hover |
| `var(--primary-light)` | Lighter brand accent |
| `var(--accent)` | Secondary warm tan (#C4783A) — logo icons, outlines |
| `var(--bg)` | Page background (#F5F3EF, warm off-white) |
| `var(--white)` | Pure white surfaces (inputs, cards) |

### Text (dark-on-light scale, darkest → lightest)
`--text-dark` → `--text-body` → `--text-secondary` → `--text-muted` → `--text-subtle`

### Borders (lightest → darkest)
`--border-subtle` → `--border-light` → `--border-default` → `--border-medium`
Plus `--border-accent` for warm tan-tinted borders on cards.

### Backgrounds
`--bg-hover` (row/button hover), `--bg-muted` (subtle fill), `--card-warm-bg` (cream card background).

### Shadows
`--shadow-sm`, `--shadow-md`, `--shadow-focus` (input focus ring).

### Status
`--error`, `--error-bg`, `--error-bg-strong`, `--error-border`, `--error-text`, `--success`.

### Typography
- `var(--font-heading)` → Pangolin (playful, for titles)
- `var(--font-body)` → Inter (default everything)
- `var(--font-mono)` → Courier New (codes, numeric stats)

---

## Reusable CSS classes — pick from this list

### Buttons
- `.btn-primary` — full-width orange solid button
- `.btn-secondary` — full-width outlined button
- `.btn-delete` — full-width delete button (red tones)
- `.btn-delete-sm` — small inline delete button
- `.btn-auto` — add alongside `.btn-primary`/`.btn-secondary` to make them hug their content instead of filling width
- `.form-footer-btn` — text-style link button ("Sign in" / "Sign up")

### Forms
- `.form-group` — wraps label + input, handles spacing
- `.form-group label` / `.form-group input` / `.form-group textarea` / `.form-group select` — auto-styled
- `.label-row` — label with trailing link (e.g. "Password / Forgot?")
- `.remember-row` — checkbox row
- `.remember-forgot` — checkbox-and-link row

### Cards & layout
- `.page`, `.page-title`, `.page-subtitle` — standard centered page shell
- `.glass-card`, `.glass-card-wide` — cream card with tan border
- `.modal-overlay` + `.modal-card` + `.modal-close` + `.modal-title` + `.modal-meta` + `.modal-description` + `.modal-actions` + `.modal-date-badge` — event/popup modal
- `.feature-card`, `.feature-icon`, `.feature-title`, `.feature-desc` — Home marketing cards
- `.cta-card`, `.cta-title`, `.cta-desc`, `.cta-welcome` — Home call-to-action card

### Auth page
- `.auth-page`, `.auth-card`, `.auth-back`, `.auth-logo`, `.auth-title`, `.auth-subtitle`, `.auth-divider`

### Dashboard shell
- `.dashboard-layout`, `.dash-sidebar`, `.dash-sidebar-header`, `.dash-sidebar-label`, `.dash-sidebar-org`
- `.dash-nav`, `.dash-nav-item`, `.dash-nav-item.active`, `.dash-nav-divider`
- `.dash-content`, `.dash-view`, `.dash-view-title`, `.dash-view-subtitle`
- `.dash-form-card`, `.dash-section-title`, `.dash-section-header`
- `.dash-stat-cards`, `.dash-stat-card`, `.dash-stat-label`, `.dash-stat-value`, `.dash-stat-value-mono`
- `.dash-events-table`, `.dash-events-header`, `.dash-events-row`, `.dash-events-title`, `.dash-events-desc`, `.dash-events-meta`
- `.dash-hint` (small helper text), `.dash-empty` (empty state)

### Members / events lists
- `.members-table`, `.members-table-header`, `.members-table-row`, `.member-index`, `.member-email`
- `.admin-event-row`, `.admin-event-date`, `.admin-event-info`, `.admin-event-title`, `.admin-event-meta`, `.admin-event-actions`
- `.event-card` + `.event-card-date`, `.event-card-month`, `.event-card-day`, `.event-card-info`, `.event-card-title`, `.event-card-time`, `.event-card-location`, `.event-card-org`

### Calendar
- `.cal-header`, `.cal-month-title`, `.cal-nav-btn`
- `.cal-grid-header`, `.cal-day-label`, `.cal-grid`
- `.cal-cell`, `.cal-cell-empty`, `.cal-cell-today`, `.cal-cell-num`
- `.cal-event-pill`, `.cal-event-more`

### Small bits
- `.tab-bar` + `.tab-btn` + `.tab-btn-active` — tab switchers
- `.view-toggle` + `.view-btn` + `.view-btn-active` — view toggles
- `.chip` + `.chip-active` (inside `.multi-select`) — selectable chips
- `.role-badge` + `.role-badge.admin` — role label
- `.invite-code-display` — large monospace invite code
- `.progress-bar-track` + `.progress-bar-fill` — onboarding progress

---

## How to build new UI without adding CSS

Start from the closest existing pattern:

| You need | Reach for |
|---|---|
| A new section on an event card | `.admin-event-row` → add children using existing text classes |
| A new group of selectable items | `.multi-select` + `.chip` + `.chip-active` |
| A new stat or summary tile | `.dash-stat-card` + `.dash-stat-label` + `.dash-stat-value` |
| A new popup / modal | `.modal-overlay` + `.modal-card` + `.modal-close` |
| A new list of names | `.members-table-row` pattern, or just a comma-separated string with `color: var(--text-secondary)` |
| A new form input | `.form-group` with label + input |

If you need local tweaks, use inline `style={{}}` with CSS variables (e.g. `style={{ marginTop: '12px', color: 'var(--text-muted)' }}`) — **not** a new class.

---

## Code style rules

### Frontend (React)
- Functional components with hooks only
- Use existing `useAuth()` from `frontend/src/context/AuthContext` for user/token/login — don't reinvent
- Use `fetch()` with the `API` constant: `const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'`
- Show feedback with `toast.success()` / `toast.error()` from `react-toastify`
- Keep state minimal — local `useState` is fine, don't introduce Redux/Zustand/etc.
- Don't add new npm dependencies without asking first

### Backend (Express)
- Controllers in `backend/controllers/`, routes in `backend/routes/`, models in `backend/models/`
- Use the existing auth middleware (JWT + role check) — don't reinvent
- Validate input and return JSON errors as `{ msg: 'message' }` (matches existing pattern)
- Mongoose schemas use `ObjectId` refs — populate as needed on read

### General
- Don't delete code that another developer wrote unless asked
- Don't rename existing variables, routes, or component exports — other devs are importing them
- Don't touch files outside your assigned task. If you think you need to, ask the user first.

---

## Task ownership (who touches what)

To avoid merge conflicts, stay inside your assigned file set:

| Developer task | Files owned |
|---|---|
| Task 1 (Backend grouping) | `backend/models/Event.js`, `backend/controllers/event.js`, `backend/routes/events.js`, `backend/utils/groupMatcher.js` |
| Task 2 (Admin groups UI) | `frontend/src/pages/AdminDashboard.jsx` |
| Task 3 (Calendar group popup) | `frontend/src/pages/Calendar.jsx` |
| Task 4 (Member dashboard group) | `frontend/src/pages/Dashboard.jsx` |

**Shared files no one should edit without coordination:** `frontend/src/index.css`, `frontend/src/context/AuthContext.jsx`, `frontend/src/App.jsx`, `backend/server.js`, `package.json`.

---

## Git workflow

1. Pull `main` before starting: `git pull origin main`
2. Create a branch named after your task: `git checkout -b task-1-backend` (or `task-2-admin`, etc.)
3. Commit often with clear messages
4. Push and open a PR against `main`
5. Wait for at least one teammate to review before merging
6. **Task 1 (backend) merges first.** Tasks 2–4 rebase onto `main` after Task 1 lands so they have the API and `groups` data available.

---

## When in doubt

- Read existing similar code in the repo first; match its style.
- Ask the user before adding new libraries, CSS, routes, or files outside your task.
- Prefer small, readable changes over clever ones.
