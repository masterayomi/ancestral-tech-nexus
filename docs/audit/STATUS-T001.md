# Implementation Status — After T-001

**Live schema:** Verified from docs/audit/schema-dump.sql (project qplwgkycufzbmafztpae)
- Public tables: audit_logs, knowledge_objects, knowledge_relationships, knowledge_versions, profiles, user_roles (6)
- Missing (not in live): platform_settings, moderator_comments, notifications (3) — code references PlatformSettings; will not create blindly
- Enums: user_role matches constants exactly
- Public functions: handle_new_user, is_admin_user, sync_user_role, trg_record_knowledge_version, update_updated_at_column
- Triggers: trg_handle_new_user, trg_knowledge_object_version, trg_knowledge_objects_updated_at, trg_profiles_updated_at, trg_sync_user_role, tr_check_filters
- Policies: 19 policies (ko_*, kr_*, profiles/admins_can_update_profiles/insert_own_profile)

**Created:**
- supabase/migrations/0000_baseline_schema_snapshot.sql (additive reference)
- docs/audit/SCHEMA-RECONCILIATION.md

**Proceeding to:** Phase 8 — T-002 (Lock user_roles), T-003 (guard profiles.role), T-004 (close knowledge_versions anon INSERT), T-005 (RLS for unknown tables), T-006 (harden is_admin_user), T-007 (object policies + is_restricted + suspension), T-008–T-011 (UI/restore/audit).

All changes remain additive and non-destructive. Windows PowerShell-native commands used.
