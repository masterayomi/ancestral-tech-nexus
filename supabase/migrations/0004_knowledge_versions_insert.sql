-- 0004_knowledge_versions_insert.sql
-- T-004: Restrict knowledge_versions INSERT; only trigger/system may insert
-- Removes open INSERT policy for anon/authenticated

DO 
DECLARE
  pol record;
BEGIN
  -- Drop any policy allowing INSERT to authenticated/anon if exists
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='knowledge_versions' AND cmd='INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.knowledge_versions', pol.policyname);
  END LOOP;
END;

-- No INSERT policy for authenticated/anon; trg_knowledge_object_version is SECURITY DEFINER
