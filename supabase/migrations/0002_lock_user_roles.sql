-- 0002_lock_user_roles.sql
-- T-002: Lock user_roles write access; only SECURITY DEFINER triggers/functions may write
-- Prevents self-promotion via direct UPDATE to user_roles (escalation path #2)

DO 
BEGIN
  -- Drop the overly permissive policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='user_roles_own'
  ) THEN
    EXECUTE 'DROP POLICY "user_roles_own" ON public.user_roles';
  END IF;
END;

-- Allow authenticated users to SELECT only their own row
CREATE POLICY IF NOT EXISTS "user_roles_select_own" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE for authenticated/anon; writes only via SECURITY DEFINER
