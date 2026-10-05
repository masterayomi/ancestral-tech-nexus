-- 0013_knowledge_lifecycle_enforcement.sql
-- T-010: Authoritative lifecycle enforcement at the database boundary.
--
-- Why a trigger and not only RPCs:
--   Live policy ko_update_own allows a creator (or admin) to UPDATE *any* column of
--   knowledge_objects, and ko_insert_authenticated allows an INSERT of an arbitrary
--   validation_status. That means a client can bypass any application-level rule by
--   writing the status column directly, and can create an object that is already
--   'published'. The trigger below is the single enforcement point that every write
--   path passes through, including the SECURITY DEFINER lifecycle RPCs.
--
-- Enforcement rules (direct writes and RPCs are validated identically):
--   INSERT          -> status forced to 'draft', published_at forced to NULL.
--                      Any client-supplied status is ignored rather than rejected so the
--                      existing create flow keeps working; "submit for review" is a
--                      separate, explicit transition.
--   UPDATE          -> status/published_at changes must follow the state machine and be
--                      performed by an authorised actor:
--                        draft|revision_requested -> under_review : creator or admin
--                        under_review            -> approved     : admin, and NOT the creator
--                        under_review            -> revision_requested : admin
--                        approved                -> published    : admin (published_at set server-side)
--                        any                     -> archived|deprecated : admin
--                      published_at may only ever change as part of the -> published
--                      transition, and is assigned by the database.
--   Content edits (status unchanged) by creator or admin are preserved.
--
-- service_role / SQL editor / migrations run with auth.uid() IS NULL; those are treated
-- as trusted infrastructure and are not subject to the transition table.

CREATE OR REPLACE FUNCTION public.enforce_knowledge_lifecycle()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_is_admin boolean;
BEGIN
  ------------------------------------------------------------------
  -- INSERT: a new object always starts as an unpublished draft.
  ------------------------------------------------------------------
  IF TG_OP = 'INSERT' THEN
    NEW.validation_status := 'draft';
    NEW.published_at := NULL;
    RETURN NEW;
  END IF;

  ------------------------------------------------------------------
  -- UPDATE
  ------------------------------------------------------------------
  v_is_admin := public.is_admin_user();

  IF NEW.is_deleted IS DISTINCT FROM OLD.is_deleted
     AND NOT (OLD.created_by IS NOT DISTINCT FROM v_caller OR v_is_admin) THEN
    RAISE EXCEPTION 'Only the creator or an administrator may archive or restore a knowledge object'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- No lifecycle column change: this is a content edit.
  IF NEW.validation_status IS NOT DISTINCT FROM OLD.validation_status THEN
    -- published_at must not be manipulated independently of the status.
    IF NEW.published_at IS DISTINCT FROM OLD.published_at THEN
      RAISE EXCEPTION 'published_at is managed by the publication transition only'
        USING ERRCODE = 'invalid_parameter_value';
    END IF;
    RETURN NEW;
  END IF;

  -- From here on a lifecycle transition is being attempted.
  IF v_caller IS NULL THEN
    RETURN NEW;  -- trusted infrastructure (service_role / SQL console / migrations)
  END IF;

  IF NOT (OLD.created_by IS NOT DISTINCT FROM v_caller OR v_is_admin) THEN
    RAISE EXCEPTION 'Only the creator or an administrator may change the validation status'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF NEW.validation_status = 'under_review' THEN
    IF OLD.validation_status NOT IN ('draft','revision_requested') THEN
      RAISE EXCEPTION 'Cannot submit for review from state "%"', OLD.validation_status
        USING ERRCODE = 'invalid_state';
    END IF;
    NEW.published_at := NULL;

  ELSIF NEW.validation_status = 'approved' THEN
    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Only reviewers and administrators may approve knowledge'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
    IF OLD.validation_status NOT IN ('under_review','pending_review') THEN
      RAISE EXCEPTION 'Cannot approve from state "%"', OLD.validation_status
        USING ERRCODE = 'invalid_state';
    END IF;
    IF OLD.created_by IS NOT DISTINCT FROM v_caller THEN
      RAISE EXCEPTION 'A contributor cannot approve their own submission'
        USING ERRCODE = 'invalid_operation';
    END IF;
    NEW.published_at := NULL;

  ELSIF NEW.validation_status = 'revision_requested' THEN
    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Only reviewers and administrators may request revisions'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
    IF OLD.validation_status <> 'under_review' THEN
      RAISE EXCEPTION 'Cannot request a revision from state "%"', OLD.validation_status
        USING ERRCODE = 'invalid_state';
    END IF;
    NEW.published_at := NULL;

  ELSIF NEW.validation_status = 'published' THEN
    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Only administrators may publish knowledge'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
    IF OLD.validation_status <> 'approved' THEN
      RAISE EXCEPTION 'Cannot publish from state "%"; approval is required first', OLD.validation_status
        USING ERRCODE = 'invalid_state';
    END IF;
    -- Publication timestamp is assigned by the database, never by the caller.
    IF OLD.published_at IS NULL THEN
      NEW.published_at := now();
    END IF;

  ELSIF NEW.validation_status IN ('archived','deprecated') THEN
    IF NOT v_is_admin THEN
      RAISE EXCEPTION 'Only administrators may archive or deprecate knowledge'
        USING ERRCODE = 'insufficient_privilege';
    END IF;

  ELSIF NEW.validation_status IN ('draft','updated','pending_review') THEN
    -- Reaching these states is never a valid user-initiated transition.
    RAISE EXCEPTION 'Transition to "%" is not permitted', NEW.validation_status
      USING ERRCODE = 'invalid_state';

  ELSE
    RAISE EXCEPTION 'Unknown validation status "%"', NEW.validation_status
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_knowledge_lifecycle() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enforce_knowledge_lifecycle() TO postgres, service_role;

DROP TRIGGER IF EXISTS trg_enforce_knowledge_lifecycle ON public.knowledge_objects;
CREATE TRIGGER trg_enforce_knowledge_lifecycle
  BEFORE INSERT OR UPDATE ON public.knowledge_objects
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_knowledge_lifecycle();

-- The lifecycle RPCs now only need to state intent; the trigger owns the rules and
-- supplies the publication timestamp. They are kept as the explicit, documented API.