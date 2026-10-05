-- 0011_audit_helpers.sql
-- T-011: Server-generated audit via SECURITY DEFINER helper (non-recursive)
-- Called from RPCs/triggers; audit_logs remain server-only (no client INSERT)

CREATE OR REPLACE FUNCTION public.insert_audit(
  p_action TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS 
BEGIN
  INSERT INTO public.audit_logs (user_id, action, details, created_at)
  VALUES (auth.uid(), p_action, COALESCE(p_details, '{}'::jsonb), NOW());
END;
;

REVOKE EXECUTE ON FUNCTION public.insert_audit(TEXT, TEXT, UUID, JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.insert_audit(TEXT, TEXT, UUID, JSONB) TO authenticated;
