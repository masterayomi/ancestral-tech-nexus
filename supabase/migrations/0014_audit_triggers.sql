-- 0014_audit_triggers.sql
-- T-011: Server-generated audit trail. Privileged events are recorded by the database,
-- so a client cannot skip them, cannot fabricate an actor identity, and cannot insert
-- its own "approved" rows (client INSERT on audit_logs was removed in 0005).
--
-- Actor identity is derived from auth.uid(), falling back to the row owner when the
-- write came from service_role or a migration. It is never read from client input.
--
-- Recorded metadata is limited to identifiers and state transitions plus the object
-- title. No free-text knowledge content, no credentials, no contact details.
--
-- Recursion safety: the audit triggers write only to public.audit_logs, which has no
-- audit trigger of its own, and the write goes through a SECURITY DEFINER function so
-- RLS on audit_logs cannot block it. No audit_logs trigger re-enters another audited
-- table, so the chain always terminates.
--
-- The function is deliberately table-agnostic: it reads columns through to_jsonb()
-- rather than NEW.<column> so it can serve knowledge_objects (created_by, title),
-- profiles (id, role) and user_roles (user_id, role) from one implementation.

CREATE OR REPLACE FUNCTION public.audit_row_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_row JSONB := '{}'::jsonb;
  old_row JSONB := '{}'::jsonb;
  v_actor UUID;
  v_action TEXT;
  v_details JSONB;
BEGIN
  -- to_jsonb() is only evaluated for the operations where that record exists:
  -- NEW is unassigned in a DELETE trigger and OLD is unassigned in an INSERT one.
  IF TG_OP <> 'INSERT' THEN old_row := to_jsonb(OLD); END IF;
  IF TG_OP <> 'DELETE' THEN new_row := to_jsonb(NEW); END IF;

  ------------------------------------------------------------------
  -- Build the event from a small, fixed set of tracked fields.
  ------------------------------------------------------------------
  IF TG_OP = 'INSERT' THEN
    v_action := TG_ARGV[0] || '_created';
    v_details := jsonb_build_object(
      'status', new_row ->> 'validation_status',
      'title',  new_row ->> 'title'
    );

  ELSIF TG_OP = 'DELETE' THEN
    v_action := TG_ARGV[0] || '_deleted';
    v_details := jsonb_build_object(
      'status', old_row ->> 'validation_status',
      'title',  old_row ->> 'title'
    );

  ELSE  -- UPDATE
    IF new_row -> 'validation_status' IS DISTINCT FROM old_row -> 'validation_status' THEN
      v_action  := TG_ARGV[0] || '_' || (new_row ->> 'validation_status');
      v_details := jsonb_build_object(
        'from_status', old_row ->> 'validation_status',
        'to_status',   new_row ->> 'validation_status'
      );
    ELSIF new_row -> 'role' IS DISTINCT FROM old_row -> 'role' THEN
      v_action  := 'role_changed';
      v_details := jsonb_build_object(
        'subject_id', COALESCE(new_row ->> 'id', new_row ->> 'user_id'),
        'from_role',  old_row ->> 'role',
        'to_role',    new_row ->> 'role'
      );
    ELSIF new_row -> 'is_suspended' IS DISTINCT FROM old_row -> 'is_suspended' THEN
      IF (new_row ->> 'is_suspended')::boolean THEN
        v_action := 'user_suspended';
      ELSE
        v_action := 'user_reactivated';
      END IF;
      v_details := jsonb_build_object(
        'subject_id', COALESCE(new_row ->> 'id', new_row ->> 'user_id'),
        'reason',     new_row ->> 'suspension_reason'
      );
    ELSIF new_row -> 'is_deleted' IS DISTINCT FROM old_row -> 'is_deleted' THEN
      IF (new_row ->> 'is_deleted')::boolean THEN
        v_action := TG_ARGV[0] || '_archived';
      ELSE
        v_action := TG_ARGV[0] || '_restored';
      END IF;
      v_details := jsonb_build_object('status', new_row ->> 'validation_status');
    ELSE
      -- Ordinary content edit: not a security-relevant event, nothing to record.
      IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END IF;
  END IF;

  ------------------------------------------------------------------
  -- Actor: the authenticated principal, else the row owner for trusted writes.
  -- Remains NULL only for system-level events (signup, migrations), which is
  -- recorded faithfully as "no interactive actor".
  ------------------------------------------------------------------
  v_actor := COALESCE(
    auth.uid(),
    NULLIF(new_row ->> 'created_by', '')::UUID,
    NULLIF(old_row ->> 'created_by', '')::UUID
  );

  INSERT INTO public.audit_logs (user_id, action, details, created_at)
  VALUES (v_actor, v_action, v_details, now());

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.audit_row_change() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.audit_row_change() TO postgres, service_role;

-- knowledge_objects: creation, status transitions, archival/restoration, deletion.
DROP TRIGGER IF EXISTS trg_audit_knowledge_objects ON public.knowledge_objects;
CREATE TRIGGER trg_audit_knowledge_objects
  AFTER INSERT OR UPDATE OR DELETE ON public.knowledge_objects
  FOR EACH ROW EXECUTE FUNCTION public.audit_row_change('knowledge_object');

-- profiles: a role change is a privileged event and must be recorded.
DROP TRIGGER IF EXISTS trg_audit_profiles ON public.profiles;
CREATE TRIGGER trg_audit_profiles
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_row_change('profile');

-- user_roles: writes are already restricted to SECURITY DEFINER functions (0002),
-- and this records which principal ended up holding which role.
DROP TRIGGER IF EXISTS trg_audit_user_roles ON public.user_roles;
CREATE TRIGGER trg_audit_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_row_change('user_role');