-- 0000_baseline_schema_snapshot.sql
-- Additive baseline capturing what the codebase depends on (read-only reference)
-- Generated from live schema audit (project qplwgkycufzbmafztpae). Do not drop existing objects.

-- Enums
DO 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='user_role') THEN
    CREATE TYPE public.user_role AS ENUM (
      'Visitor','Student','Administrator','Researcher','Indigenous Knowledge Holder','Translator','Reviewer','Moderator','Institution Administrator','National Administrator','Super Administrator'
    );
  END IF;
END;

-- Note: The following tables exist live: audit_logs, knowledge_objects, knowledge_relationships, knowledge_versions, profiles, user_roles
-- platform_settings, moderator_comments, notifications do NOT exist live — do not create yet.

-- RLS state and policy inventory captured in docs/audit/SCHEMA-RECONCILIATION.md
