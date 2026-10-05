-- 0003_profiles_role_guard.sql
-- T-003: Prevent self-promotion via profiles.role; only authorized roles may change role
-- Works with sync_user_role (SECURITY DEFINER) but blocks non-privileged role changes

CREATE OR REPLACE FUNCTION public.guard_profiles_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS 
DECLARE
  can_change boolean;
BEGIN
  -- Allow INSERT (handled elsewhere); allow if role unchanged
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
      RETURN NEW;
    END IF;
    -- Only allow role change if caller is admin
    can_change := public.is_admin_user();
    IF NOT can_change THEN
      RAISE EXCEPTION 'Insufficient privileges to change role' USING ERRCODE='insufficient_privilege';
    END IF;
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
;

DROP TRIGGER IF EXISTS trg_guard_profiles_role_change ON public.profiles;
CREATE TRIGGER trg_guard_profiles_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profiles_role_change();
