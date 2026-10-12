# STATE.md — Repository Audit (Step 1 of the "make it work" plan)

Date of audit: 2026-10-11
Commit audited: `df3c291` ("Update Knowledge Bridge Africa"), branch `main`, clean tree.

This document records what the project is *meant* to be (per the `.md` blueprint
docs) versus the *actual* state of the code and of the live Supabase project it is
wired to (`qplwgkycufzbmafztpae`). Unknowns and contradictions are listed so later
steps ("make it build", "finish features", "test like a user") can be executed
without re-deriving this state.

---

## 1. The product (intended scope)

Per `KNOWLEDGE_BRIDGE_AFRICA_MASTER_BLUEPRINT.md`, `DATABASE_BLUEPRINT.md`,
`ADMIN_MODULE_SUMMARY.md`, `UI_UX_DESIGN_SYSTEM.md`:

- **Knowledge Bridge Africa** — a living archive of African indigenous knowledge
  that bridges "indigenous wisdom" and "scientific context" (dual-integrity).
- **Roles** (11, in `src/constants.ts`, matching the live enum): Visitor, Student,
  Administrator, Researcher, Indigenous Knowledge Holder, Translator, Reviewer,
  Moderator, Institution Administrator, National Administrator, Super Administrator.
- **Knowledge lifecycle**: draft → under_review → approved → published (plus
  revision_requested / archived / deprecated). Server-enforced state machine +
  server-generated audit trail (migrations 0010–0016).
- **Admin module**: dashboard (stats, activity, notifications), user management
  (search/filter, suspend, role change), knowledge management (moderate, archive,
  restore, hard delete, versions), governance (review queue, audit logs, version
  history, timeline), platform settings.
- **Security posture** (ADRs 0001–0005, migrations 0000–0016): RLS everywhere,
  additive-only migrations, server-only audit writes, role-guarded transitions,
  client search sanitisation (T-009).
- **Design system**: Emerald-950 primary, Amber-500 accent, Stone base, Playfair
  Display headings + Inter body, 8-pt grid, max-w-7xl, lucide-react, 44px targets.
- **AI engine** (`AI_ENGINE_ARCHITECTURE.md`): a future pipeline, not present in code.

## 2. Actual stack and structure

- React 19 + TypeScript + Vite 5 (`port 3000`, host) + Tailwind CSS 4 (via
  `@tailwindcss/vite`) + React Router 7 (`createBrowserRouter`, lazy routes) +
  Supabase (`@supabase/supabase-js`) + framer-motion, recharts, dnd-kit, sonner,
  shadcn/ui components. `vite-plugin-checker` runs `tsc` in the dev overlay.
- Build script: `tsc -b && vite build`. Lint: `eslint .`. `packageManager: bun`. 
  `package-lock.json` and `bun.lock` are both present.
- Routed components: 11 static "documentation" pages (`/strategy`, `/architecture`,
  `/security`, `/ecosystem`, `/model`, `/types`, `/graph`, `/governance`, `/recommendations`,
  `/scalability`, `/reference`), `/profile` (auth-or-profile switch), `/dashboard`
  (auth-guarded, with nested `/dashboard/repository`), `/admin` (auth guarded +
  role gate inside `AdminLayout`), legacy `/repository` → redirect.
- DB-touching code lives in exactly 7 files: `KnowledgeRepository.tsx`,
  `admin/{AdminDashboard,AdminLayout? no,Governance,KnowledgeManagement,UserManagement,PlatformSettings}.tsx`,
  and `contexts/AuthContext.tsx` plus `hooks/usePermission.ts` (logic only).
  All 12 documentation pages and `MultilingualArchitecture.tsx` are static.

## 3. Verified facts

### 3.1 Repo
- HEAD `df3c291`, clean tree, upstream `origin/main`.
- `.gitignore` covers `node_modules`, `.env`, `.env.*`, `dist`, `build`, logs, OS/VSCode.
- `.env.local` (131 bytes, gitignored, untracked) contains `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` for `https://qplwgkycufzbmafztpae.supabase.co`. **Never
  print or commit these values.**

### 3.2 Live Supabase probes (2026-10-11, anon only, read-only)
| object | live? | evidence |
|---|---|---|
| knowledge_objects, knowledge_versions, knowledge_relationships, profiles, audit_logs | yes | `GET …/rest/v1/<t>` → 200 |
| user_roles | yes | 400 (exists, no anon SELECT policy) |
| platform_settings, moderator_comments, notifications | **no** | 404 |
| submit/approve/reject/publish_knowledge RPCs | **no** | `POST /rpc/<fn>` with correct args → 404 PGRST202 |
| admin_set_user_role, insert_audit | **no** | 404 PGRST202 |

Conclusion: the live database is effectively the **baseline schema (0000) plus the
0002–0007 policy/guard migrations**, but migrations **0010–0016 are NOT applied**,
even though they sit in `supabase/migrations/` (added in commit `b1b23fd`).
`0016` also *depends* on `public.is_admin_user()`, so applying 0013–0016 without
0010-era helpers would fail — the whole 0010–0016 set must be applied together.

### 3.3 What compiles / is consistent
- Router, auth context, constants, permission hook are internally consistent.
- Admin/Repository code already calls the **intended** server RPCs
  (`approve_knowledge`, `reject_knowledge`, `publish_knowledge`,
  `submit_knowledge_for_review`, `admin_set_user_role`) — i.e. the UI was migrated
  ahead of the database (commit `b1b23fd`).
- Search sanitisation (`src/lib/search.ts`) is in place in all `.or()` builders.
- `npm install` / `npm run build` / `npm run dev` have **not yet been run** in this
  session (Step 2). Build status is therefore UNVERIFIED.

## 4. Intended vs actual — gaps that block a "working, testable" app

1. **Lifecycle RPCs missing live (PGRST202).** Governance approve/reject/publish,
   KnowledgeManagement status transitions, UserManagement "change role", and
   Repository "Submit for Review" will all fail against the live DB until
   migrations 0010–0016 are applied.
2. **Missing tables live.** Platform Settings (`platform_settings`) shows
   "Failed to load settings"; Admin Dashboard Notifications (`notifications`) and
   the bell icon are backed by a table that does not exist. `moderator_comments`
   is only referenced in docs.
3. **Client audit writes still in code.** `AuthContext.signIn`, `signOut`, and
   `logAudit` (used by `updateProfile`) still `INSERT INTO audit_logs` — but client
   INSERT/UPDATE/DELETE on `audit_logs` is impossible (0005 removed the policies,
   0016 revokes the grants). These calls fail **silently**; they should be removed
   now the trigger-based audit (0014) owns the audit trail. This also affects
   `/profile` saves (the `profile_edit` audit silently never happens).
4. **Dead nav links in Dashboard.** `src/components/Dashboard.tsx` links to
   `/verification`, `/settings`, `/audit` — none of these routes exist, so clicking
   them renders a blank page. It is also branded "Knowledge Nexus" while the app is
   "Knowledge Bridge Africa". Other doc routes (`model`, `types`, `graph`,
   `recommendations`, `governance`, `reference`) are missing from its nav.
5. **No catch-all / 404 route and no error boundary** — an unknown URL (including
   those dead links) renders a blank screen with no navigation back.
6. **Gebeya Dala branding.** `index.html` still carries Gebeya Dala metadata,
   `gebeya.webp` OG image, and `robots.txt`; README is the generic
   `react-starter-template` README. ADR-0005 says to rewrite these.
7. **Tracked junk / broken scripts.** Git still tracks `bun.lock`,
   `build-output.txt`, `react-starter-template@0.0.0`, `vite` — despite
   `docs/migration/dala_removal_log.md` claiming they were removed. `package.json`
   references `node dala-internal-watch-build-errors.js` (missing file) in
   `watch:errors`. There is no `dalar-internal…` script file in the repo.
8. **Encoding corruption.** `admin/UserManagement.tsx` contains literal U+FFFD
   replacement characters in display fallbacks (e.g. `country || '�'` at lines
   302/414/418/422/426) — visibly broken text.
9. **Orphaned component.** `src/components/MultilingualArchitecture.tsx` is a
   complete page that is never imported or routed.
10. **Type-check exemptions.** `tsconfig.app.json` and `eslint.config.js` both
    exclude `src/components/ui` — those ~60 files are not type-checked or linted.
11. **Admin "settings" behaviour when empty.** `PlatformSettings` renders an empty
    grid when the table is empty; fine once seeded, broken when missing.
12. **Route-wrapper redundancy / dead code.** `App.tsx` is a pass-through
    (`<Outlet/>` + `<Toaster/>`); its `routeMap`/`handleNavigate` are unused.
    `NAV_ITEMS` in `constants.ts` is unused (Dashboard hard-codes its own nav).

## 5. Doc contradictions worth recording

- `docs/migration/dala_removal_log.md` says the junk files were removed from the
  index; `git ls-files` shows they are still tracked.
- `docs/audit/STATUS-T010-T011.md` marks the Governance UI migration as a *next
  step*; commit `b1b23fd` already did it (it now calls the RPCs). The doc is stale.
- `docs/audit/SCHEMA-RECONCILIATION.md` says migrations 0010–0012 were "added";
  live probes show **no** lifecycle RPCs exist. "Added to repo" ≠ "applied live".
- REFACTORING docs describe `/` redirect to `/scalability`; the real router
  redirects `/` → `/dashboard`.
- ADR-0005 mandates index.html/README rewriting; both still contain template/Dala
  content.
- `.github/instructions` lists 7 user roles (Student, Researcher, Community Elder,
  Government, NGO, Reviewer, Admin) that do not match `constants.ts`'s 11 roles or
  the live enum. Per-role dashboards are not implemented beyond the admin gate.

## 6. Open decisions (need user input before Step 3)

1. **Apply migrations 0010–0016 (and optionally create the 3 missing tables +
   seed `platform_settings`) to the live Supabase project?** This is required for
   administrative/governance features and "submit for review" to work end-to-end.
   It modifies the remote dev database; the user must approve. Existing data is
   compatible (reconciliation shows baseline tables only).
2. **Junk-file cleanup** (`git rm` the 4 tracked files) — low risk, but touches the
   index and will show up on `origin/main` next push.
3. **404-route decisions** (add missing docs nav / remove dead links; add 404 page)
   are low-risk code changes that don't need approval beyond the plan itself.

## 7. Remaining plan

- [x] Step 2 — `npm install`, `npm run build`, `npm run dev`; fix errors; one commit
      per fix. Verify home page + repository load with no console errors.
- [x] Step 3 — resolve the open decisions above; then finish documented features
      (audit-write cleanup, nav/dead-links, 404 page, branding, encoding fix).
- [ ] Step 4 — user-flow smoke test, seed data, `TESTING.md`, final commit + report.

## 8. Step 3 decisions and completed fixes (2026-10-11)

User decided: **do NOT touch the live database**; remove tracked junk files;
install Playwright CLI for user-flow testing.

- **DB unchanged.** The app now degrades gracefully wherever server objects are
  missing instead of failing hard:
  - New `src/lib/capabilities.ts` probes (cached, one-time) whether the lifecycle
    RPCs, `admin_set_user_role`, `platform_settings`, and `notifications` exist,
    and exposes `useCapabilities()`.
  - `AdminDashboard` — banner explaining the `notifications` table isn't deployed;
    stats still load (counts/activity/recent rows come back as empty, not errors).
  - `PlatformSettings` — shows a "not configured" state instead of a broken form.
  - `Governance` + `KnowledgeManagement` — Approve/Publish/Reject/Revision buttons
    are hidden with an explanatory note when the lifecycle RPCs are missing;
    archive/restore/edit (direct row updates) still work.
  - `UserManagement` — role-change modal disables with a note when
    `admin_set_user_role` is missing; suspend/reactivate/delete keep working.
  - `KnowledgeRepository` — submitting for review reports "lifecycle service not
    deployed" (object is still saved as a draft); `PGRST202` handled specifically.
- **AuthContext** no longer writes to `audit_logs` from the client (no INSERT
  policy exists; audit is trigger-generated server-side). `logAudit` removed.
- **Dashboard** — dead nav links removed (`/verification`, `/settings`, `/audit`);
  product name corrected to `APP_NAME`; added reachable doc links (Model, Types,
  Graph, Recommendations, Governance Guide, Multilingual, Reference).
- **Routing** — new 404 page + catch-all `*` route; root `errorElement` error
  boundary via `useRouteError()`; the orphaned `MultilingualArchitecture` page is
  now routed at `/multilingual`.
- **Branding** — `index.html` meta + title and `README.md` rewritten for
  Knowledge Bridge Africa (no more Gebeya Dala / starter-template).
- **Fixed encoding** — replaced U+FFFD replacement glyphs in `UserManagement.tsx`.
- **Repo hygiene** — `git rm` of tracked junk (`react-starter-template@0.0.0`,
  `vite`, `build-output.txt`, `bun.lock`); `bun.lock` added to `.gitignore`.
- **Known backlog (untouched):** ~140 pre-existing ESLint errors
  (`no-explicit-any`, `no-unused-vars`, `react-refresh`) across the codebase —
  prior changelogs claimed lint-clean, which is inaccurate. Type errors: 0;
  production build passes. Not fixed to avoid a large, low-value diff; consider as
  follow-up.

Commits: `b054b15`, `633453d`, `3f5a3f3`, `4f7fa55`, `ba5937e`, `e0dd1f3`.

## 9. Step 4 — testing attempts and security policy (2026-10-11)

- **Signed-out smoke tests passed** (Playwright): `/` → `/dashboard` → `/profile`
  redirect chain; sign-in/sign-up/forgot-password forms render; all doc pages
  render; 404 page works; admin/repository routes redirect to `/profile` when
  logged out; a bad-credential sign-in hits Supabase and shows the
  "Invalid login credentials" toast; console clean apart from expected 400s.
- **Signed-in flows are blocked on credentials, not code.** The user-provided
  account (`COMRADEAYOMI0166@GMAIL.COM`) returns "Invalid login credentials".
  Playwright sign-up attempts for a throwaway account
  (`kba.throwaway.1011@gmail.com` etc.) are rate-limited/rejected by Supabase
  ("…only request this after 8 seconds.", "Email address … is invalid",
  "email rate limit exceeded"). Re-test after the Supabase cooldown (rate limits
  are per-IP/per-email, up to an hour) or with a confirmed account.
  NOTE: those throwaway credentials were invented for testing and are not real.
- **Credential-handling security policy added** (`docs/SECURITY.md`): passwords
  are bcrypt-hashed server-side by Supabase Auth (the app never stores/logs
  them); emails are stored only in `auth.users` (encrypted at rest) and never in
  application tables — hashing emails client-side would break login/reset and is
  intentionally not implemented; tokens are managed by supabase-js (localStorage
  default accepted for a static SPA, cookie-auth documented as follow-up).
- **Step 4 remainder:** sign in with a working test account; exercise
  repository CRUD, Submit-for-Review (degraded state), profile editor, and admin
  pages; then write `TESTING.md`, final report, and push.