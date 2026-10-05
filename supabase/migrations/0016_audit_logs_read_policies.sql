-- 0016_audit_logs_read_policies.sql
-- T-011 follow-up: 0005 removed every policy on audit_logs to stop clients writing
-- their own entries, but that also removed the SELECT policies the admin UI relies on
-- (AdminDashboard "recent activity", Governance "Audit Trail" tab). Restore read access
-- only, and scope it:
--
--   * a principal may read its own entries
--   * administrators may read all entries
--   * INSERT / UPDATE / DELETE remain impossible for anon and authenticated, so an
--     audit row can only originate from the SECURITY DEFINER audit triggers.

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies
             WHERE schemaname = 'public' AND tablename = 'audit_logs' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.audit_logs', pol.policyname);
  END LOOP;
END$$;

CREATE POLICY audit_logs_select_own
  ON public.audit_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY audit_logs_select_admin
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- Belt and braces: no client write privilege on the table at all.
REVOKE INSERT, UPDATE, DELETE ON public.audit_logs FROM anon, authenticated;

-- 0014 records the actor from auth.uid(), falling back to the row owner. System-level
-- events (signup via handle_new_user, migrations run with no JWT) have no interactive
-- actor, and the live column is NOT NULL. Rather than lose those audit rows - or abort
-- the business write - the actor is allowed to be NULL, which means "not an
-- interactive actor". Widening nullability is safe for existing rows.
ALTER TABLE public.audit_logs ALTER COLUMN user_id DROP NOT NULL;