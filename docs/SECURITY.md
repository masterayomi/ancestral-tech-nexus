# SECURITY.md — Credential Handling and Data Protection Policy

Applies to: **Knowledge Bridge Africa** (`ancestral-tech-nexus`).
Date: 2026-10-11
Scope: how emails, passwords, and authentication tokens are stored, transmitted,
and processed. Companion to `docs/STATE.md` and `docs/adr/ADR-0002-security-first.md`.

---

## 1. Policy statement

1. **Passwords are never stored, logged, or processed in plaintext by this
   application.** All password hashing is performed **server-side by the
   authentication provider** (Supabase Auth, bcrypt with per-user salt) **before
   any storage layer sees the value**. The client browser only ever holds a
   password transiently in a React form input and transmits it once over TLS to
   `POST /auth/v1/signup` or `POST /auth/v1/token`.

2. **Emails are the user's login identifier and recovery address.** They are
   stored ONLY inside the platform auth service (`auth.users`, encrypted at
   rest) and are required in plaintext by that service to (a) look up the
   account at sign-in, (b) send password-reset and confirmation links, and
   (c) prevent duplicate accounts. **The application data layer stores no emails:
   no table owned by this app has an email column, and application rows hold no
   PII copied from the auth service.** Hashing emails on the client or at rest
   would make email-based login and password recovery impossible, so this
   application deliberately does NOT hash emails; instead it confines emails to
   the auth service and keeps them out of application data, logs, and analytics.

3. **Credentials and secrets never enter the repository, the bundle, or logs.**
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` live only in the gitignored
   `.env.local`. The anon key is safe to ship (it is a public, RLS-limited key,
   not a secret), but no service-role key, password, or user email is ever read
   into client code.

4. **Authentication tokens are managed by the Supabase client library** and are
   not written, read, or manipulated by application code. The app never touches
   `localStorage`/`sessionStorage` directly. The default supabase-js storage
   backend persists the session token in `localStorage` (standard for a static
   SPA without a server); this is an accepted trade-off for a client-only app and
   is mitigated by the platform's CSP-less static host plus TLS. If a backend
   were added, the tokens should move to HTTP-only cookies (`@supabase/ssr`).

## 2. Verified baseline (2026-10-11, code search)

- Passwords appear only in `src/components/AuthManagement.tsx` (local React state,
  `type="password"` inputs) and are passed straight to
  `supabase.auth.signInWithPassword` / `signUp` in `src/contexts/AuthContext.tsx`.
- No `console.*` call outside two DB-error logs; none prints an email, password,
  or token.
- No `localStorage`/`sessionStorage` access in application code.
- `src/integrations/supabase/client.ts` uses the platform anon key and default
  auth settings; no custom storage or logging hooks are configured.
- `audit_logs` is written only by server-side triggers (client INSERT has no
  policy — removed in `633453d`).

## 3. Rules for contributors (enforced during review)

- Never `console.log` an email, password, token, `session`, or `access_token`.
- Never persist credentials or tokens to `localStorage`/`sessionStorage` from
  application code.
- Never add an email/PII column to an application-owned table — auth-owned data
  stays in `auth.*`; reference users only by `profiles.id` (the auth `user.uid`).
- Never commit `.env*` or any file containing credentials or secrets.
- Never weaken RLS or bypass the role-gated RPCs (`admin_set_user_role`,
  lifecycle RPCs). Client role checks are UX only; the server is the authority.
- Questions: treat the security-first ADRs (0001–0005) and migrations 0000–0016
  as normative.

## 4. Commands used to verify

- `rg -n "console\.(log|error|warn|debug)|localStorage\.(setItem|getItem|removeItem)|password" src`
- `git status --porcelain` and `git ls-files | rg "\.env"` (expect: nothing
  tracked).

## 5. Open follow-ups (not done here)

- Move auth tokens to HTTP-only cookies behind a small server/BFF for full
  XSS hardening of token storage (requires adding a backend; not a static-SPA
  change). See policy item 4.
- Re-run the security-focused review after any change to `AuthContext.tsx` or
  the Supabase client configuration.