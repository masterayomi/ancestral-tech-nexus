-- 0015_lifecycle_rpc_consolidation.sql
-- T-010/T-011 follow-up.
--
-- 1. The lifecycle RPCs written in 0010/0012 now delegate the rules to
--    trg_enforce_knowledge_lifecycle and no longer write audit rows themselves
--    (0014 already records every status transition server-side). This removes the
--    duplicate audit entries the earlier versions would have produced and guarantees
--    that an audit row exists for every transition regardless of the write path.
--
-- 2. 0002 removed the client write policies on user_roles, but
--    src/components/admin/UserManagement.tsx still writes the role directly and would
--    now fail. admin_set_user_role() is the server-side, audited replacement: it is
--    restricted to administrators, records the actor from auth.uid(), keeps profiles
--    and user_roles consistent, and is protected by the existing role guard.

--------------------------------------------------------------------------------
-- 1. Lifecycle RPCs: explicit API over the trigger's rules.
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.submit_knowledge_for_review(p_object_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  UPDATE public.knowledge_objects
     SET validation_status = 'under_review',
         updated_at = now()
   WHERE id = p_object_id
     AND is_deleted = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE = 'no_data_found';
  END IF;
  -- Authorisation and the allowed source state are enforced by
  -- trg_enforce_knowledge_lifecycle, which raises on an illegal transition.
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_knowledge(p_object_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  UPDATE public.knowledge_objects
     SET validation_status = 'approved',
         updated_at = now()
   WHERE id = p_object_id
     AND is_deleted = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_knowledge(p_object_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_reason IS NOT NULL AND length(p_reason) > 2000 THEN
    RAISE EXCEPTION 'Revision reason is too long' USING ERRCODE = 'invalid_parameter_value';
  END IF;

  UPDATE public.knowledge_objects
     SET validation_status = 'revision_requested',
         updated_at = now()
   WHERE id = p_object_id
     AND is_deleted = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE = 'no_data_found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_knowledge(p_object_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  UPDATE public.knowledge_objects
     SET validation_status = 'published',
         updated_at = now()
   WHERE id = p_object_id
     AND is_deleted = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE = 'no_data_found';
  END IF;
  -- published_at is assigned by trg_enforce_knowledge_lifecycle, not by the caller.
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_knowledge_for_review(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.approve_knowledge(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reject_knowledge(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.publish_knowledge(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_knowledge_for_review(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_knowledge(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_knowledge(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_knowledge(UUID) TO authenticated;

-- insert_audit() from 0011 is superseded by the audit triggers in 0014.
REVOKE EXECUTE ON FUNCTION public.insert_audit(TEXT, TEXT, UUID, JSONB) FROM PUBLIC;
DROP FUNCTION IF EXISTS public.insert_audit(TEXT, TEXT, UUID, JSONB);

--------------------------------------------------------------------------------
-- 2. Administrator-only, audited role change (replaces the direct user_roles write).
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_user_id UUID,
  p_role public.user_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Only administrators may change roles' USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own role' USING ERRCODE = 'invalid_operation';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Target user not found' USING ERRCODE = 'no_data_found';
  END IF;

  -- trg_guard_profiles_role_change authorises the profiles write; the role
  -- enumerates exist as constraints so an unknown role fails here.
  UPDATE public.profiles SET role = p_role WHERE id = p_user_id;

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, p_role);
  ELSE
    UPDATE public.user_roles SET role = p_role WHERE user_id = p_user_id;
  END IF;
  -- Both writes are recorded by trg_audit_profiles / trg_audit_user_roles.
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_set_user_role(UUID, public.user_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, public.user_role) TO authenticated;