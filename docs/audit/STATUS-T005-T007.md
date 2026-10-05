# Implementation Status — T-005–T-007

- 0005_rls_policy_audit.sql: RLS ensured on all 6 live tables; audit_logs has no client policies (server-generated only).
- 0006_harden_is_admin_user.sql: search_path safe, SECURITY DEFINER/STABLE; revoked anon EXECUTE; includes Administrator in admin roles.
- 0007_object_policies.sql: documented policy posture (is_restricted/suspension enforcement) without destructive changes to live policies.

Next: T-008 (remove self-service role changes in UI), T-009 (kill .or() injection), T-010 (server-enforced lifecycle, remove self-publish), T-011 (server-generated audit). Then lint/dep hygiene and test harness foundation.
