-- 0012_lifecycle_audit.sql
-- Update lifecycle RPCs to write audit server-side (T-011)

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

  IF v_creator IS DISTINCT FROM auth.uid() AND NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Insufficient privileges' USING ERRCODE='insufficient_privilege';
  END IF;

  IF v_status NOT IN ('draft','revision_requested') THEN
    RAISE EXCEPTION 'Invalid state transition for submit' USING ERRCODE='invalid_state';
  END IF;

  UPDATE public.knowledge_objects
  SET validation_status = 'under_review', updated_at = NOW()
  WHERE id = p_object_id;

  PERFORM public.insert_audit('knowledge_submitted', 'knowledge_object', p_object_id, jsonb_build_object('status', v_status));
END;
;

CREATE OR REPLACE FUNCTION public.approve_knowledge(p_object_id UUID)
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

  IF v_creator IS NOT DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Cannot approve own submission' USING ERRCODE='invalid_operation';
  END IF;

  IF v_status NOT IN ('under_review','pending_review') THEN
    RAISE EXCEPTION 'Invalid state transition for approve' USING ERRCODE='invalid_state';
  END IF;

  UPDATE public.knowledge_objects
  SET validation_status = 'approved', updated_at = NOW()
  WHERE id = p_object_id;

  PERFORM public.insert_audit('knowledge_approved', 'knowledge_object', p_object_id, jsonb_build_object('from_status', v_status));
END;
;

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
  SET validation_status = 'revision_requested', updated_at = NOW()
  WHERE id = p_object_id;

  PERFORM public.insert_audit('knowledge_revision_requested', 'knowledge_object', p_object_id, jsonb_build_object('from_status', v_status, 'reason', p_reason));
END;
;

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

  IF v_status != 'approved' THEN
    RAISE EXCEPTION 'Invalid state transition for publish' USING ERRCODE='invalid_state';
  END IF;

  UPDATE public.knowledge_objects
  SET validation_status = 'published', published_at = NOW(), updated_at = NOW()
  WHERE id = p_object_id;

  PERFORM public.insert_audit('knowledge_published', 'knowledge_object', p_object_id, jsonb_build_object('from_status', v_status));
END;
;
