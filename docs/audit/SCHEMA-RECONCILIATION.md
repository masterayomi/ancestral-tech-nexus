# Live Schema Reconciliation (T-001)

From docs\audit\schema-dump.sql (schema-only, project qplwgkycufzbmafztpae):
- Tables in public: audit_logs, knowledge_objects, knowledge_relationships, knowledge_versions, profiles, user_roles (6)
- NOT present in public: moderator_comments, notifications, platform_settings (3) — do not invent
- Enums: user_role values match constants (11 values)
- Functions (public): handle_new_user, is_admin_user, sync_user_role, trg_record_knowledge_version, update_updated_at_column
- Triggers observed: trg_handle_new_user, trg_knowledge_object_version, trg_knowledge_objects_updated_at, trg_profiles_updated_at, trg_sync_user_role, tr_check_filters
- Policies: 19 policies found (includes ko_* and kr_* and profiles/admins_can_update_profiles/insert_own_profile)

Differences vs repo:
- Repo migration only creates user_roles and patches policies/triggers; live has full tables/functions/triggers
- audit_logs exists live; code inserts into it (client-side) — must move to server-generated (T-011)
- knowledge_relationships exists live with policies kr_*
- platform_settings/moderator_comments/notifications do NOT exist live — code expects them (PlatformSettings.tsx, etc.) — DO NOT CREATE blindly; defer to Phase 12 if needed or confirm

Next: Write 0000_baseline_schema_snapshot.sql (additive) capturing what code depends on, then proceed to P0 hardening T-002–T-011.
