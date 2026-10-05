-- 0006_harden_is_admin_user.sql
-- T-006: Harden is_admin_user; ensure search_path safe and future-proof
-- Existing function is_admin_user exists live; recreate with SET search_path TO ''

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS 
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN (
        'Super Administrator',
        'National Administrator',
        'Administrator',
        'Reviewer',
        'Moderator'
      )
  );
;
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
