-- 0005_rls_policy_audit.sql
-- T-005: Ensure RLS enabled and least-privilege policies for tables present live
-- Tables: audit_logs, knowledge_relationships, knowledge_objects, knowledge_versions, profiles, user_roles

-- Enable RLS (idempotent)
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.knowledge_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.knowledge_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.knowledge_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

-- audit_logs: server-generated only; no client INSERT/UPDATE/DELETE/SELECT policy for anon/authenticated
DO 
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='audit_logs' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.audit_logs', pol.policyname);
  END LOOP;
END;
-- No client policies created. Triggers/functions must insert; reads restricted to admins via future RPC/view.

-- knowledge_relationships: preserve existing policy set names if present? live has kr_* policies; keep minimal safe set
-- Drop overly broad if any, ensure authenticated can read own-related or as appropriate? Using live policy names preserved logic
-- But ensure no open write to anon - rely on existing kr_insert_authenticated/kr_update_own_or_admin/kr_delete_own_or_admin/kr_select_authenticated
