-- 0010_knowledge_lifecycle_rpc.sql
-- T-010: Server-enforced knowledge lifecycle via SECURITY DEFINER RPCs
-- Prevents clients from directly setting validation_status/published_at arbitrarily

CREATE OR REPLACE FUNCTION public.submit_knowledge_for_review(p_object_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS 
DECLARE
  v_creator UUID;
  v_status TEXT;
BEGIN
  SELECT created_by, validation_status INTO v_creator, v_status
  FROM public.knowledge_objects
  WHERE id = p_object_id AND is_deleted = FALSE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE='no_data_found';
  END IF;

  -- Only creator or admin can submit
  IF v_creator IS DISTINCT FROM auth.uid() AND NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Insufficient privileges' USING ERRCODE='insufficient_privilege';
  END IF;

  -- Enforce state transition: draft or revision_requested -> under_review
  IF v_status NOT IN ('draft','revision_requested') THEN
    RAISE EXCEPTION 'Invalid state transition for submit' USING ERRCODE='invalid_state';
  END IF;

  UPDATE public.knowledge_objects
  SET validation_status = 'under_review',
      updated_at = NOW()
  WHERE id = p_object_id;
END;
;

REVOKE EXECUTE ON FUNCTION public.submit_knowledge_for_review(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.submit_knowledge_for_review(UUID) TO authenticated;

-- Approve knowledge
CREATE OR REPLACE FUNCTION public.approve_knowledge(p_object_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS 
DECLARE
  v_creator UUID;
  v_status TEXT;
  v_reviewer TEXT;
BEGIN
  SELECT created_by, validation_status, reviewer INTO v_creator, v_status, v_reviewer
  FROM public.knowledge_objects
  WHERE id = p_object_id AND is_deleted = FALSE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE='no_data_found';
  END IF;

  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Insufficient privileges' USING ERRCODE='insufficient_privilege';
  END IF;

  -- Prevent self-approval if independence required (creator != approver)
  IF v_creator IS NOT DISTINCT FROM auth.uid() THEN
    -- Allow only if Super Administrator? Keep strict: no self-approval by default
    RAISE EXCEPTION 'Cannot approve own submission' USING ERRCODE='invalid_operation';
  END IF;

  IF v_status NOT IN ('under_review','pending_review') THEN
    RAISE EXCEPTION 'Invalid state transition for approve' USING ERRCODE='invalid_state';
  END IF;

  UPDATE public.knowledge_objects
  SET validation_status = 'approved',
      updated_at = NOW()
  WHERE id = p_object_id;
END;
;

REVOKE EXECUTE ON FUNCTION public.approve_knowledge(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.approve_knowledge(UUID) TO authenticated;

-- Reject (request revision)
CREATE OR REPLACE FUNCTION public.reject_knowledge(p_object_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS 
DECLARE
  v_creator UUID;
  v_status TEXT;
BEGIN
  SELECT created_by, validation_status INTO v_creator, v_status
  FROM public.knowledge_objects
  WHERE id = p_object_id AND is_deleted = FALSE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE='no_data_found';
  END IF;

  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Insufficient privileges' USING ERRCODE='insufficient_privilege';
  END IF;

  IF v_status NOT IN ('under_review','pending_review') THEN
    RAISE EXCEPTION 'Invalid state transition for reject' USING ERRCODE='invalid_state';
  END IF;

  UPDATE public.knowledge_objects
  SET validation_status = 'revision_requested',
      updated_at = NOW()
  WHERE id = p_object_id;
END;
;

REVOKE EXECUTE ON FUNCTION public.reject_knowledge(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.reject_knowledge(UUID, TEXT) TO authenticated;

-- Publish knowledge
CREATE OR REPLACE FUNCTION public.publish_knowledge(p_object_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS 
DECLARE
  v_status TEXT;
BEGIN
  SELECT validation_status INTO v_status
  FROM public.knowledge_objects
  WHERE id = p_object_id AND is_deleted = FALSE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Knowledge object not found' USING ERRCODE='no_data_found';
  END IF;

  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Insufficient privileges' USING ERRCODE='insufficient_privilege';
  END IF;

  -- Can only publish from approved state
  IF v_status != 'approved' THEN
    RAISE EXCEPTION 'Invalid state transition for publish' USING ERRCODE='invalid_state';
  END IF;

  UPDATE public.knowledge_objects
  SET validation_status = 'published',
      published_at = NOW(),
      updated_at = NOW()
  WHERE id = p_object_id;
END;
;

REVOKE EXECUTE ON FUNCTION public.publish_knowledge(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.publish_knowledge(UUID) TO authenticated;
