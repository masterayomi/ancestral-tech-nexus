import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { UserRole } from '@/constants'

export interface Profile {
  id: string
  name: string | null
  biography: string | null
  institution: string | null
  country: string | null
  community: string | null
  indigenous_language: string | null
  research_interests: string[] | null
  expertise: string[] | null
  role: UserRole
  verification_status: string
  profile_image_url: string | null
  privacy_settings: Record<string, boolean>
  notification_settings: Record<string, boolean>
  language_preferences: string
  accessibility_settings: Record<string, boolean>
  connected_institutions: string[] | null
  updated_at: string | null
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
  logAudit: (action: string, details?: Record<string, unknown>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error && data) {
      setProfile(data as Profile)
    } else if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch profile:', error.message)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const logAudit = useCallback(async (action: string, details: Record<string, unknown> = {}) => {
    if (!user) return
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      details,
    })
  }, [user])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (u) {
        await supabase.from('audit_logs').insert({ user_id: u.id, action: 'login', details: {} })
      }
    }
    return { error }
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    if (user) {
      await supabase.from('audit_logs').insert({ user_id: user.id, action: 'logout', details: {} })
    }
    await supabase.auth.signOut()
  }, [user])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') }
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (!error) {
      await fetchProfile(user.id)
      await logAudit('profile_edit', { fields: Object.keys(updates) })
    }
    return { error }
  }, [user, fetchProfile, logAudit])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  const value: AuthContextValue = {
    session, user, profile, loading,
    signIn, signUp, signOut, resetPassword,
    updateProfile, refreshProfile, logAudit,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
