# Implementation Status — T-002–T-004

- 0002_lock_user_roles.sql: dropped permissive 'user_roles_own', added SELECT-only policy for authenticated (users see only own). No INSERT/UPDATE/DELETE for clients.
- 0003_profiles_role_guard.sql: added BEFORE UPDATE trigger guard_profiles_role_change() — blocks non-admin role changes; uses is_admin_user().
- 0004_knowledge_versions_insert.sql: dropped all INSERT policies on knowledge_versions; prevents anon/authenticated inserts.

All migrations additive/non-destructive. Windows PowerShell-native commands.
Next: T-005 (RLS audit for unknown tables: audit_logs, knowledge_relationships; also confirm policies), T-006 (harden is_admin_user/admin_capabilities), T-007 (object policies + is_restricted + suspension).
