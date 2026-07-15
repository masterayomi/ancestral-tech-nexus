import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, type Profile } from '@/contexts/AuthContext'
import { usePermission } from '@/hooks/usePermission'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import {
  ROLES, VERIFICATION_TYPES, COUNTRIES, AUTH_LABELS, APP_NAME, APP_TAGLINE,
} from '@/constants'
import type { UserRole } from '@/constants'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import {
  LogIn, UserPlus, KeyRound, ShieldCheck, User, Settings, FileText, Clock,
  ArrowLeft, CheckCircle2, XCircle, Loader2, LogOut, Mail,
} from 'lucide-react'

type AuthView = 'signIn' | 'signUp' | 'forgotPassword' | 'dashboard'

interface VerificationRequest {
  id: string
  user_id: string
  verification_type: string
  documents_or_notes: string | null
  status: string
  reviewer_id: string | null
  reviewer_notes: string | null
  created_at: string
  updated_at: string
}

interface AuditLog {
  id: string
  user_id: string
  action: string
  details: Record<string, unknown>
  ip_address: string | null
  created_at: string
}

export default function AuthManagement() {
  const { user, profile, loading, signIn, signUp, signOut, resetPassword, updateProfile, logAudit } = useAuth()
  const { can } = usePermission()
  const [view, setView] = useState<AuthView>('signIn')
  const navigate = useNavigate()

  useEffect(() => {
    if (user && profile) {
      // If authenticated and profile exists, navigate to dashboard
      navigate('/dashboard')
    } else if (user && !profile && !loading) {
      // If user exists but no profile, keep them on sign-in/profile flow
      navigate('/profile')
    } else if (!user && !loading) {
      // Ensure unauthenticated users stay on sign-in
      navigate('/profile')
    }
  }, [user, profile, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (!user && view !== 'signIn' && view !== 'signUp' && view !== 'forgotPassword') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AuthForms
            view="signIn"
            setView={setView}
            signIn={signIn}
            signUp={signUp}
            resetPassword={resetPassword}
          />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <AuthForms
            view={view}
            setView={setView}
            signIn={signIn}
            signUp={signUp}
            resetPassword={resetPassword}
          />
        </div>
      </div>
    )
  }

  return (
    <Dashboard
      profile={profile}
      updateProfile={updateProfile}
      signOut={signOut}
      can={can}
      logAudit={logAudit}
      userId={user.id}
    />
  )
}

function AuthForms({
  view, setView, signIn, signUp, resetPassword,
}: {
  view: AuthView
  setView: (v: AuthView) => void
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) toast.error(error.message)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await signUp(email, password, name)
    setSubmitting(false)
    if (error) toast.error(error.message)
    else toast.success('Account created! Check your email to confirm.')
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await resetPassword(email)
    setSubmitting(false)
    if (error) toast.error(error.message)
    else setSent(true)
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'signIn' && (
        <motion.div
          key="signIn"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6 text-amber-400" />
              </div>
              <CardTitle className="text-white text-xl">{AUTH_LABELS.signInTitle}</CardTitle>
              <CardDescription className="text-emerald-200/60">{AUTH_LABELS.signInSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-emerald-100">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-emerald-900/40 border-emerald-700 text-white placeholder:text-emerald-400/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-emerald-100">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="bg-emerald-900/40 border-emerald-700 text-white placeholder:text-emerald-400/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
              </form>
              <div className="mt-4 text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setView('forgotPassword')}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot your password?
                </button>
                <p className="text-sm text-emerald-200/60">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signUp')}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {view === 'signUp' && (
        <motion.div
          key="signUp"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-amber-400" />
              </div>
              <CardTitle className="text-white text-xl">{AUTH_LABELS.signUpTitle}</CardTitle>
              <CardDescription className="text-emerald-200/60">{AUTH_LABELS.signUpSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-emerald-100">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="bg-emerald-900/40 border-emerald-700 text-white placeholder:text-emerald-400/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-emerald-100">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-emerald-900/40 border-emerald-700 text-white placeholder:text-emerald-400/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-emerald-100">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="bg-emerald-900/40 border-emerald-700 text-white placeholder:text-emerald-400/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Account
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-emerald-200/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('signIn')}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Sign in
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {view === 'forgotPassword' && (
        <motion.div
          key="forgotPassword"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-amber-400" />
              </div>
              <CardTitle className="text-white text-xl">{AUTH_LABELS.forgotPasswordTitle}</CardTitle>
              <CardDescription className="text-emerald-200/60">{AUTH_LABELS.forgotPasswordSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <p className="text-emerald-200">Check your email for the reset link.</p>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-emerald-100">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="bg-emerald-900/40 border-emerald-700 text-white placeholder:text-emerald-400/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Send Reset Link
                  </Button>
                </form>
              )}
              <p className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setView('signIn')}
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Dashboard({
  profile, updateProfile, signOut, can, logAudit, userId,
}: {
  profile: Profile | null
  updateProfile: (u: Partial<Profile>) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  can: (a: 'view_verification_queue' | 'approve_verification' | 'view_all_audit_logs' | 'manage_roles') => boolean
  logAudit: (action: string, details?: Record<string, unknown>) => Promise<void>
  userId: string
}) {
  const [activeTab, setActiveTab] = useState('profile')

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center">
            <User className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile?.name || 'User'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-emerald-800 text-emerald-200 border-emerald-700">{profile?.role || 'Student'}</Badge>
              <VerificationBadge status={profile?.verification_status || 'none'} />
            </div>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="border-emerald-700 text-emerald-200 hover:bg-emerald-900/40"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {AUTH_LABELS.signOutLabel}
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-emerald-950/60 border border-emerald-800 p-1 rounded-lg mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-amber-500 data-[state=active]:text-emerald-950 text-emerald-200">
            <User className="w-4 h-4 mr-2" />
            {AUTH_LABELS.profileTab}
          </TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-amber-500 data-[state=active]:text-emerald-950 text-emerald-200">
            <ShieldCheck className="w-4 h-4 mr-2" />
            {AUTH_LABELS.verificationTab}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-amber-500 data-[state=active]:text-emerald-950 text-emerald-200">
            <Settings className="w-4 h-4 mr-2" />
            {AUTH_LABELS.preferencesTab}
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-amber-500 data-[state=active]:text-emerald-950 text-emerald-200">
            <FileText className="w-4 h-4 mr-2" />
            {AUTH_LABELS.auditTab}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileEditor profile={profile} updateProfile={updateProfile} canManageRoles={can('manage_roles')} />
        </TabsContent>
        <TabsContent value="verification">
          <VerificationCenter profile={profile} userId={userId} canReview={can('approve_verification')} logAudit={logAudit} />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesPanel profile={profile} updateProfile={updateProfile} />
        </TabsContent>
        <TabsContent value="audit">
          <AuditLogViewer userId={userId} canViewAll={can('view_all_audit_logs')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VerificationBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    none: { label: 'Unverified', className: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
    pending: { label: 'Pending', className: 'bg-amber-900/40 text-amber-300 border-amber-700' },
    approved: { label: 'Verified', className: 'bg-emerald-900/40 text-emerald-300 border-emerald-700' },
    rejected: { label: 'Rejected', className: 'bg-red-900/40 text-red-300 border-red-700' },
  }
  const info = map[status] || map.none
  return <Badge className={info.className + ' border'}>{info.label}</Badge>
}

function ProfileEditor({
  profile, updateProfile, canManageRoles,
}: {
  profile: Profile | null
  updateProfile: (u: Partial<Profile>) => Promise<{ error: Error | null }>
  canManageRoles: boolean
}) {
  const [name, setName] = useState(profile?.name || '')
  const [biography, setBiography] = useState(profile?.biography || '')
  const [institution, setInstitution] = useState(profile?.institution || '')
  const [country, setCountry] = useState(profile?.country || '')
  const [community, setCommunity] = useState(profile?.community || '')
  const [indigenousLanguage, setIndigenousLanguage] = useState(profile?.indigenous_language || '')
  const [role, setRole] = useState<UserRole>(profile?.role || 'Student')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setBiography(profile.biography || '')
      setInstitution(profile.institution || '')
      setCountry(profile.country || '')
      setCommunity(profile.community || '')
      setIndigenousLanguage(profile.indigenous_language || '')
      setRole(profile.role)
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    const updates: Partial<Profile> = {
      name, biography, institution, country, community,
      indigenous_language: indigenousLanguage,
    }
    if (canManageRoles) (updates as Record<string, unknown>).role = role
    const { error } = await updateProfile(updates)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Profile updated')
  }

  return (
    <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white text-lg">Profile Information</CardTitle>
        <CardDescription className="text-emerald-200/60">Update your public profile details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-emerald-100">Full Name</Label>
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-country" className="text-emerald-100">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="bg-emerald-900/40 border-emerald-700 text-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-emerald-950 border-emerald-700 max-h-60">
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-white focus:bg-emerald-800">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-institution" className="text-emerald-100">Institution</Label>
            <Input id="profile-institution" value={institution} onChange={(e) => setInstitution(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="University or organization" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-community" className="text-emerald-100">Community</Label>
            <Input id="profile-community" value={community} onChange={(e) => setCommunity(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="Your community" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-language" className="text-emerald-100">Indigenous Language</Label>
            <Input id="profile-language" value={indigenousLanguage} onChange={(e) => setIndigenousLanguage(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="e.g. Yoruba, Swahili" />
          </div>
          {canManageRoles && (
            <div className="space-y-2">
              <Label htmlFor="profile-role" className="text-emerald-100">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="bg-emerald-900/40 border-emerald-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-emerald-950 border-emerald-700">
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="text-white focus:bg-emerald-800">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-bio" className="text-emerald-100">Biography</Label>
          <Textarea id="profile-bio" value={biography} onChange={(e) => setBiography(e.target.value)} rows={4} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="Tell us about yourself..." />
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}

function VerificationCenter({
  profile, userId, canReview, logAudit,
}: {
  profile: Profile | null
  userId: string
  canReview: boolean
  logAudit: (action: string, details?: Record<string, unknown>) => Promise<void>
}) {
  const [vType, setVType] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)

  useEffect(() => {
    if (canReview) {
      loadAllRequests()
    } else if (userId) {
      loadMyRequests()
    }
  }, [canReview, userId])

  const loadMyRequests = async () => {
    setLoadingRequests(true)
    const { data } = await supabase.from('verification_requests').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (data) setRequests(data as VerificationRequest[])
    setLoadingRequests(false)
  }

  const loadAllRequests = async () => {
    setLoadingRequests(true)
    const { data } = await supabase.from('verification_requests').select('*').order('created_at', { ascending: false })
    if (data) setRequests(data as VerificationRequest[])
    setLoadingRequests(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vType) return toast.error('Please select a verification type')
    setSubmitting(true)
    const { error } = await supabase.from('verification_requests').insert({
      user_id: userId,
      verification_type: vType,
      documents_or_notes: notes,
    })
    setSubmitting(false)
    if (error) toast.error(error.message)
    else {
      toast.success('Verification request submitted')
      setVType('')
      setNotes('')
      await logAudit('verification_submitted', { verification_type: vType })
      loadMyRequests()
    }
  }

  const handleReview = async (reqId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('verification_requests')
      .update({ status, reviewer_id: userId, updated_at: new Date().toISOString() })
      .eq('id', reqId)
    if (error) toast.error(error.message)
    else {
      toast.success(`Request ${status}`)
      await loadAllRequests()
      await logAudit('verification_decision', { request_id: reqId, status })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            {profile?.verification_status === 'approved' ? 'Verification Status' : 'Request Verification'}
          </CardTitle>
          <CardDescription className="text-emerald-200/60">
            {profile?.verification_status === 'approved'
              ? 'Your account is verified.'
              : profile?.verification_status === 'pending'
                ? 'Your verification request is under review.'
                : 'Submit a verification request to confirm your credentials.'}
          </CardDescription>
        </CardHeader>
        {profile?.verification_status !== 'pending' && profile?.verification_status !== 'approved' && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-emerald-100">Verification Type</Label>
                <Select value={vType} onValueChange={setVType}>
                  <SelectTrigger className="bg-emerald-900/40 border-emerald-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-emerald-950 border-emerald-700">
                    {VERIFICATION_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-white focus:bg-emerald-800">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-emerald-100">Notes / Supporting Information</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="bg-emerald-900/40 border-emerald-700 text-white"
                  placeholder="Provide details to support your verification..."
                />
              </div>
              <Button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Request
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            {canReview ? 'Verification Queue' : 'Your Requests'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRequests ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
          ) : requests.length === 0 ? (
            <p className="text-emerald-200/40 text-center py-8">No requests yet.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-900/30 border border-emerald-800">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-800 text-emerald-200 border-emerald-700">{req.verification_type}</Badge>
                    <VerificationBadge status={req.status} />
                    <span className="text-xs text-emerald-300/60">{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                  {canReview && req.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReview(req.id, 'approved')} className="bg-emerald-600 hover:bg-emerald-500 text-white h-8">
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleReview(req.id, 'rejected')} className="bg-red-600 hover:bg-red-500 text-white h-8">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PreferencesPanel({
  profile, updateProfile,
}: {
  profile: Profile | null
  updateProfile: (u: Partial<Profile>) => Promise<{ error: Error | null }>
}) {
  const [privacy, setPrivacy] = useState(profile?.privacy_settings || { profile_public: true, show_email: false })
  const [notifications, setNotifications] = useState(profile?.notification_settings || { email_alerts: true, system_updates: false })
  const [language, setLanguage] = useState(profile?.language_preferences || 'en')
  const [accessibility, setAccessibility] = useState(profile?.accessibility_settings || { high_contrast: false, large_text: false })

  const togglePrivacy = (key: string) => {
    const updated = { ...privacy, [key]: !privacy[key as keyof typeof privacy] }
    setPrivacy(updated)
    updateProfile({ privacy_settings: updated } as Partial<Profile>)
  }

  const toggleNotification = (key: string) => {
    const updated = { ...notifications, [key]: !notifications[key as keyof typeof notifications] }
    setNotifications(updated)
    updateProfile({ notification_settings: updated } as Partial<Profile>)
  }

  const toggleAccessibility = (key: string) => {
    const updated = { ...accessibility, [key]: !accessibility[key as keyof typeof accessibility] }
    setAccessibility(updated)
    updateProfile({ accessibility_settings: updated } as Partial<Profile>)
  }

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang)
    const { error } = await updateProfile({ language_preferences: lang } as Partial<Profile>)
    if (error) toast.error(error.message)
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white text-lg">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Public Profile</p>
              <p className="text-xs text-emerald-300/60">Allow others to see your profile</p>
            </div>
            <Switch checked={privacy.profile_public} onCheckedChange={() => togglePrivacy('profile_public')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Show Email</p>
              <p className="text-xs text-emerald-300/60">Display your email on your profile</p>
            </div>
            <Switch checked={privacy.show_email} onCheckedChange={() => togglePrivacy('show_email')} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white text-lg">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Email Alerts</p>
              <p className="text-xs text-emerald-300/60">Receive email notifications</p>
            </div>
            <Switch checked={notifications.email_alerts} onCheckedChange={() => toggleNotification('email_alerts')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">System Updates</p>
              <p className="text-xs text-emerald-300/60">Get notified about platform changes</p>
            </div>
            <Switch checked={notifications.system_updates} onCheckedChange={() => toggleNotification('system_updates')} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white text-lg">Language</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-emerald-900/40 border-emerald-700 text-white w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-emerald-950 border-emerald-700">
              <SelectItem value="en" className="text-white focus:bg-emerald-800">English</SelectItem>
              <SelectItem value="fr" className="text-white focus:bg-emerald-800">Francais</SelectItem>
              <SelectItem value="sw" className="text-white focus:bg-emerald-800">Kiswahili</SelectItem>
              <SelectItem value="ar" className="text-white focus:bg-emerald-800">العربية</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white text-lg">Accessibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">High Contrast</p>
              <p className="text-xs text-emerald-300/60">Increase contrast for better readability</p>
            </div>
            <Switch checked={accessibility.high_contrast} onCheckedChange={() => toggleAccessibility('high_contrast')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Large Text</p>
              <p className="text-xs text-emerald-300/60">Increase text size throughout the interface</p>
            </div>
            <Switch checked={accessibility.large_text} onCheckedChange={() => toggleAccessibility('large_text')} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AuditLogViewer({ userId, canViewAll }: { userId: string; canViewAll: boolean }) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  useEffect(() => {
    loadLogs()
  }, [canViewAll, userId])

  const loadLogs = async () => {
    setLoadingLogs(true)
    const query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50)
    if (!canViewAll) query.eq('user_id', userId)
    const { data } = await query
    if (data) setLogs(data as AuditLog[])
    setLoadingLogs(false)
  }

  return (
    <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white text-lg">Audit Log</CardTitle>
        <CardDescription className="text-emerald-200/60">
          {canViewAll ? 'All system activity logs.' : 'Your recent account activity.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadingLogs ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
        ) : logs.length === 0 ? (
          <p className="text-emerald-200/40 text-center py-8">No activity recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-900/30 border border-emerald-800">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-100 text-sm capitalize">{log.action.replace(/_/g, ' ')}</p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <p className="text-xs text-emerald-300/50 truncate">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-emerald-400/50 flex-shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
