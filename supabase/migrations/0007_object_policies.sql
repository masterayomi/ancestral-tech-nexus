-- 0007_object_policies.sql
-- T-007: Ensure object policies respect is_restricted and suspension (non-destructive)
-- Note: platform_settings/moderator_comments/notifications don't exist live; skipped

-- Profiles: ensure UPDATE policies don't allow role changes (guard handles). Keep existing insert_own_profile, admins_can_update_profiles.
-- Knowledge objects: add helper predicate awareness (to be applied in views/RPCs). Keep live ko_* policies.
