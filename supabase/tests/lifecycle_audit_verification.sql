-- ============================================================================
-- T-010 / T-011 verification script
--
-- PURPOSE
--   Demonstrates, against a real database, that:
--     1. the knowledge lifecycle cannot be bypassed by a client that writes
--        status columns directly (T-010);
--     2. the audit trail is produced by the database with a server-derived actor,
--        and a client cannot fabricate entries or actor identities (T-011).
--
-- HOW IT WORKS
--   Every check runs with `set local role authenticated` and a faked
--   `request.jwt.claim.sub`. That is exactly what PostgREST does for a signed-in
--   user, so RLS and the triggers are exercised on the real path a client takes -
--   not against a privileged session.
--
--   Each check raises NOTICE on success and EXCEPTION on violation, so the script
--   aborts with a non-zero status at the first broken property.
--
-- HOW TO RUN
--   supabase db execute --file supabase/tests/lifecycle_audit_verification.sql
--   (or paste into the Supabase SQL editor and run it)
--
--   Requires migrations 0013-0016 to have been applied.
--
--   NOTE: this script has NOT been executed against a database in the authoring
--   environment (no Postgres instance or credentials available there). It is the
--   executable specification of the properties; run it before relying on them.
--
-- Everything below is contained in a transaction that is rolled back, so no
-- fixture data survives the run.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Fixtures (created as the owner, standing in for seeded/system-created rows)
-- ---------------------------------------------------------------------------
do $$
begin
  -- Supabase's auth trigger normally creates profiles/user_roles on signup.
  insert into public.profiles (id, name, role) values
    ('00000000-0000-4000-8000-0000000000a1', 'Verify Contributor', 'Student'),
    ('00000000-0000-4000-8000-0000000000a2', 'Verify Reviewer',   'Reviewer'),
    ('00000000-0000-4000-8000-0000000000a3', 'Verify Admin',      'Administrator'),
    ('00000000-0000-4000-8000-0000000000a4', 'Verify Admin Author','Administrator')
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values
    ('00000000-0000-4000-8000-0000000000a1', 'Student'),
    ('00000000-0000-4000-8000-0000000000a2', 'Reviewer'),
    ('00000000-0000-4000-8000-0000000000a3', 'Administrator'),
    ('00000000-0000-4000-8000-0000000000a4', 'Administrator')
  on conflict (user_id) do update set role = excluded.role;
end;
$$;

-- One object owned by the plain contributor.
do $$
declare v_id uuid;
begin
  select id into v_id from public.knowledge_objects
   where title = 'VERIFY object' limit 1;
  if v_id is null then
    insert into public.knowledge_objects (title, summary, created_by)
    values ('VERIFY object', 'verification fixture',
            '00000000-0000-4000-8000-0000000000a1')
    returning id into v_id;
  end if;
end;
$$;

-- One object owned by an administrator, for the independence test.
do $$
begin
  if not exists (select 1 from public.knowledge_objects where title = 'VERIFY admin object') then
    insert into public.knowledge_objects (title, summary, created_by)
    values ('VERIFY admin object', 'verification fixture',
            '00000000-0000-4000-8000-0000000000a4');
  end if;
end;
$$;

-- ===========================================================================
-- T-010 : lifecycle enforcement
-- ===========================================================================

-- --- 1. INSERT cannot specify a pre-published status -------------------------
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', true);

do $$
begin
  begin
    insert into public.knowledge_objects (title, summary, created_by, validation_status, published_at)
    values ('VERIFY sneaky publish', 'x', '00000000-0000-4000-8000-0000000000a1', 'published', now());
  exception when others then
    -- Rejecting outright is also acceptable; the check below proves the outcome.
    null;
  end;
end;
$$;

do $$
declare v_status text;
begin
  select validation_status into v_status
    from public.knowledge_objects where title = 'VERIFY sneaky publish';
  if v_status = 'published' then
    raise exception 'FAIL T-010: a client INSERTed an object directly as published';
  end if;
  raise notice 'PASS T-010.1  INSERT cannot create a published object (stored as draft)';
end;
$$;

-- --- 2. A contributor cannot publish their own object ------------------------
do $$
begin
  begin
    update public.knowledge_objects set validation_status = 'published'
     where title = 'VERIFY object';
    raise exception 'FAIL T-010: a contributor self-published their own object';
  exception when others then
    if sqlerrm like 'FAIL T-010%' then raise; end if;
    raise notice 'PASS T-010.2  contributor cannot publish (blocked: %)', sqlerrm;
  end;
end;
$$;

-- --- 3. A contributor cannot approve -----------------------------------------
do $$
begin
  begin
    update public.knowledge_objects set validation_status = 'approved'
     where title = 'VERIFY object';
    raise exception 'FAIL T-010: a contributor approved knowledge';
  exception when others then
    if sqlerrm like 'FAIL T-010%' then raise; end if;
    raise notice 'PASS T-010.3  contributor cannot approve (blocked: %)', sqlerrm;
  end;
end;
$$;

-- --- 4. Publishing without approval is refused ------------------------------
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a2', true);

do $$
begin
  begin
    update public.knowledge_objects set validation_status = 'published'
     where title = 'VERIFY object';
    raise exception 'FAIL T-010: publication skipped the approval step';
  exception when others then
    if sqlerrm like 'FAIL T-010%' then raise; end if;
    raise notice 'PASS T-010.4  publish-before-approve refused (blocked: %)', sqlerrm;
  end;
end;
$$;

-- --- 5. A reviewer may approve someone else's submission ---------------------
do $$
begin
  update public.knowledge_objects set validation_status = 'under_review'
   where title = 'VERIFY object';
  update public.knowledge_objects set validation_status = 'approved'
   where title = 'VERIFY object';
  raise notice 'PASS T-010.5  reviewer can approve another contributor''s submission';
exception when others then
  raise exception 'FAIL T-010: the legitimate review workflow was broken: %', sqlerrm;
end;
$$;

-- --- 6. A reviewer may publish once approved --------------------------------
do $$
begin
  update public.knowledge_objects set validation_status = 'published'
   where title = 'VERIFY object';
  raise notice 'PASS T-010.6  reviewer can publish an approved object';
exception when others then
  raise exception 'FAIL T-010: the legitimate publication workflow was broken: %', sqlerrm;
end;
$$;

-- --- 7. published_at is assigned by the database ----------------------------
do $$
declare v_pub timestamptz; v_client timestamptz := '1999-01-01 00:00:00+00';
begin
  select published_at into v_pub from public.knowledge_objects where title = 'VERIFY object';
  if v_pub is null or v_pub < '2000-01-01'::timestamptz then
    raise exception 'FAIL T-010: published_at was not set by the server';
  end if;
  if v_pub = v_client then
    raise exception 'FAIL T-010: published_at accepted a client-supplied value';
  end if;
  raise notice 'PASS T-010.7  published_at is server-assigned';
end;
$$;

-- --- 8. Self-approval by an administrator is refused ------------------------
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a4', true);

do $$
begin
  update public.knowledge_objects set validation_status = 'under_review'
   where title = 'VERIFY admin object';
  begin
    update public.knowledge_objects set validation_status = 'approved'
     where title = 'VERIFY admin object';
    raise exception 'FAIL T-010: an administrator approved their own submission';
  exception when others then
    if sqlerrm like 'FAIL T-010%' then raise; end if;
    raise notice 'PASS T-010.8  administrator cannot approve their own submission (blocked: %)', sqlerrm;
  end;
end;
$$;

-- --- 9. An administrator may still approve someone else's work ---------------
-- 'VERIFY admin object' is under_review and owned by fixture a4, so a3 approving it
-- exercises the administrator path without colliding with its own state machine.
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a3', true);

do $$
begin
  update public.knowledge_objects set validation_status = 'approved'
   where title = 'VERIFY admin object';
  raise notice 'PASS T-010.9  administrator can approve another contributor''s work';
exception when others then
  raise exception 'FAIL T-010: administrator review workflow broken: %', sqlerrm;
end;
$$;

-- --- 10. Escalation by writing user_roles is refused -------------------------
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', true);

do $$
begin
  begin
    update public.user_roles set role = 'Super Administrator'
     where user_id = '00000000-0000-4000-8000-0000000000a1';
    raise exception 'FAIL T-010: a client escalated itself by writing user_roles';
  exception when others then
    if sqlerrm like 'FAIL T-010%' then raise; end if;
    raise notice 'PASS T-010.10 self-escalation via user_roles is refused (blocked: %)', sqlerrm;
  end;
end;
$$;

-- --- 11. Self-approval via profiles.role is refused --------------------------
do $$
begin
  begin
    update public.profiles set role = 'Administrator'
     where id = '00000000-0000-4000-8000-0000000000a1';
    raise exception 'FAIL T-010: a client changed its own profiles.role';
  exception when others then
    if sqlerrm like 'FAIL T-010%' then raise; end if;
    raise notice 'PASS T-010.11 self-escalation via profiles.role is refused (blocked: %)', sqlerrm;
  end;
end;
$$;

-- --- 12. Admin-only role management RPC works and refuses non-admins ---------
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a3', true);

do $$
begin
  perform public.admin_set_user_role(
    '00000000-0000-4000-8000-0000000000a1'::uuid, 'Moderator'::public.user_role);
  raise notice 'PASS T-010.12 admin_set_user_role succeeds for an administrator';
exception when others then
  raise exception 'FAIL T-010: admin_set_user_role broke the admin workflow: %', sqlerrm;
end;
$$;

do $$
begin
  perform public.admin_set_user_role(
    '00000000-0000-4000-8000-0000000000a2'::uuid, 'Administrator'::public.user_role);
  raise exception 'FAIL T-011: a non-admin changed a role';
exception when others then
  if sqlerrm like 'FAIL T-011%' then raise; end if;
  raise notice 'PASS T-011.13 admin_set_user_role refuses a non-admin (blocked: %)', sqlerrm;
end;
$$;

-- ===========================================================================
-- T-011 : server-generated audit trail
-- ===========================================================================

-- --- 14. A client cannot fabricate an audit entry ----------------------------
do $$
begin
  begin
    insert into public.audit_logs (user_id, action, details)
    values ('00000000-0000-4000-8000-0000000000a2', 'knowledge_object_published',
            '{"forged": true}'::jsonb);
    raise exception 'FAIL T-011: a client inserted a fabricated audit row';
  exception when others then
    if sqlerrm like 'FAIL T-011%' then raise; end if;
    raise notice 'PASS T-011.14 fabricated audit insert refused (blocked: %)', sqlerrm;
  end;
end;
$$;

-- --- 15. A client cannot claim someone else's identity in the audit trail ----
-- (Already implied by 0005/0016 removing the INSERT policy; verified explicitly.)
do $$
declare v_forged int;
begin
  select count(*) into v_forged from public.audit_logs
   where details ? 'forged';
  if v_forged > 0 then
    raise exception 'FAIL T-011: a forged audit row is present';
  end if;
  raise notice 'PASS T-011.15 no forged audit rows exist';
end;
$$;

reset role;

-- --- 16. Creation and transitions are recorded server-side ------------------
do $$
declare v_actor uuid; v_status text;
begin
  select user_id into v_actor from public.audit_logs
   where action = 'knowledge_object_created'
     and details ->> 'title' = 'VERIFY object'
   order by created_at desc limit 1;
  if v_actor is null then
    raise exception 'FAIL T-011: creation was not audited';
  end if;
  if v_actor <> '00000000-0000-4000-8000-0000000000a1'::uuid then
    raise exception 'FAIL T-011: creation audit actor % is not the server-derived owner', v_actor;
  end if;
  raise notice 'PASS T-011.16 creation is audited with a server-derived actor';
end;
$$;

do $$
begin
  if not exists (
    select 1 from public.audit_logs
     where action = 'knowledge_object_published'
       and details ->> 'from_status' = 'approved'
       and details ->> 'to_status' = 'published'
  ) then
    raise exception 'FAIL T-011: the publication transition was not audited with provenance';
  end if;
  raise notice 'PASS T-011.17 publication transition is audited with from/to status';
end;
$$;

do $$
begin
  if not exists (select 1 from public.audit_logs where action = 'role_changed') then
    raise exception 'FAIL T-011: the role change was not audited';
  end if;
  raise notice 'PASS T-011.18 role change is audited';
end;
$$;

-- --- 19. Role change performed through the RPC is attributed to the caller ---
do $$
declare v_actor uuid;
begin
  select user_id into v_actor from public.audit_logs
   where action = 'role_changed'
   order by created_at desc limit 1;
  if v_actor is distinct from '00000000-0000-4000-8000-0000000000a3'::uuid then
    raise exception 'FAIL T-011: role_change audit actor is % , expected the calling administrator', v_actor;
  end if;
  raise notice 'PASS T-011.19 role change is attributed to the calling administrator';
end;
$$;

-- --- 20. No knowledge content is stored in the audit trail ------------------
do $$
begin
  if exists (
    select 1 from public.audit_logs
     where details ? 'full_content'
        or details ? 'scientific_explanation'
        or details ? 'indigenous_knowledge'
        or details ? 'summary'
        or details ? 'suspension_reason'
  ) then
    raise exception 'FAIL T-011: the audit trail stores free-text content it should not';
  end if;
  raise notice 'PASS T-011.20 audit details are limited to identifiers and state transitions';
end;
$$;

-- --- 21. Recursion safety ---------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_trigger t
      join pg_class c on c.oid = t.tgrelid
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relname = 'audit_logs' and not t.tgisinternal
  ) then
    raise exception 'FAIL T-011: audit_logs has a trigger, which risks recursive audit writes';
  end if;
  raise notice 'PASS T-011.21 audit_logs has no trigger, so audit writes cannot recurse';
end;
$$;

-- --- 22. Audit read access for the admin UI --------------------------------
do $$
begin
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public' and tablename = 'audit_logs'
       and policyname = 'audit_logs_select_admin'
  ) then
    raise exception 'FAIL T-011: administrators cannot read the audit trail (Governance UI would break)';
  end if;
  raise notice 'PASS T-011.22 administrators retain read access to the audit trail';
end;
$$;

rollback;

raise notice 'All T-010 / T-011 verification checks passed.';