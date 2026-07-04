-- ============================================================================
-- Migration: Fix Profiles RLS Recursion & Add Missing Policies
-- Date: 2025-07-04
-- Description: 
--   1. Break infinite recursion in profiles RLS by creating a user_roles
--      lookup table and updating is_admin_user() to query it instead.
--   2. Add missing DELETE policy on knowledge_objects.
--   3. Add INSERT policy on profiles for user self-creation.
--   4. Add proper RLS policies on knowledge_versions.
--   5. Add performance indexes.
--   6. Revoke EXECUTE on internal trigger functions from anon/authenticated.
-- ============================================================================

-- ============================================================================
-- FIX 1: Break infinite recursion in profiles RLS
-- ============================================================================

-- Step 1a: Create the user_roles lookup table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'Student',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 1b: Populate user_roles from existing profiles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.profiles
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, updated_at = now();

-- Step 1c: Create trigger function to keep user_roles in sync with profiles
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.user_roles (user_id, role, updated_at)
    VALUES (NEW.id, NEW.role, now())
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, updated_at = now();
  END IF;
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.user_roles WHERE user_id = OLD.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Step 1d: Create trigger on profiles to sync roles
DROP TRIGGER IF EXISTS trg_sync_user_role ON public.profiles;
CREATE TRIGGER trg_sync_user_role
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION sync_user_role();

-- Step 1e: Recreate is_admin_user() to query user_roles instead of profiles
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN (
        'Super Administrator',
        'National Administrator',
        'Reviewer',
        'Moderator'
      )
  );
$$;

-- Step 1f: Add RLS policies for user_roles
DROP POLICY IF EXISTS "user_roles_own" ON public.user_roles;
CREATE POLICY "user_roles_own" ON public.user_roles
  FOR ALL TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FIX 2: Add missing DELETE policy on knowledge_objects
-- ============================================================================
DROP POLICY IF EXISTS "auth_delete_own" ON public.knowledge_objects;
CREATE POLICY "auth_delete_own" ON public.knowledge_objects
  FOR DELETE TO public
  USING (created_by = auth.uid() OR is_admin_user());

-- ============================================================================
-- FIX 3: Add INSERT policy on profiles for user self-creation
-- ============================================================================
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT TO public
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- FIX 4: Add UPDATE policy on profiles with proper with_check
-- ============================================================================
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- FIX 5: Ensure knowledge_versions has proper RLS policies
-- ============================================================================
DROP POLICY IF EXISTS "service_role_insert_versions" ON public.knowledge_versions;
CREATE POLICY "service_role_insert_versions" ON public.knowledge_versions
  FOR INSERT TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_versions" ON public.knowledge_versions;
CREATE POLICY "admin_delete_versions" ON public.knowledge_versions
  FOR DELETE TO public
  USING (is_admin_user());

-- ============================================================================
-- FIX 6: Add admin update policy for profiles
-- ============================================================================
DROP POLICY IF EXISTS "admins_can_update_profiles" ON public.profiles;
CREATE POLICY "admins_can_update_profiles" ON public.profiles
  FOR UPDATE TO public
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ============================================================================
-- FIX 7: Add indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_knowledge_versions_object_id ON public.knowledge_versions(knowledge_object_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_versions_changed_by ON public.knowledge_versions(changed_by);
CREATE INDEX IF NOT EXISTS idx_knowledge_objects_created_by ON public.knowledge_objects(created_by);
CREATE INDEX IF NOT EXISTS idx_knowledge_objects_validation_status ON public.knowledge_objects(validation_status);
CREATE INDEX IF NOT EXISTS idx_knowledge_objects_is_deleted ON public.knowledge_objects(is_deleted);

-- ============================================================================
-- FIX 8: Security hardening - revoke EXECUTE on internal functions
-- ============================================================================
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_role() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_record_knowledge_version() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM anon;
