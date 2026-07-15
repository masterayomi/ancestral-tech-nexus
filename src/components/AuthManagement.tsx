import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { LogIn, UserPlus, KeyRound, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { AUTH_LABELS } from '@/constants'

type AuthView = 'signIn' | 'signUp' | 'forgotPassword'

export default function AuthManagement() {
  const { user, loading, signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState<AuthView>('signIn')

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <AuthForms view={view} setView={setView} signIn={signIn} signUp={signUp} resetPassword={resetPassword} />
      </div>
    </div>
  )
}

function AuthForms({
  view,
  setView,
  signIn,
  signUp,
  resetPassword,
}: {
  view: AuthView
  setView: (view: AuthView) => void
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
    if (error) {
      toast.error(error.message)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await signUp(email, password, name)
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Check your email to confirm.')
      setView('signIn')
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await resetPassword(email)
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
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
                <Button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold">
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
                  Don't have an account?{' '}
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
                <Button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold">
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
                  <Button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold">
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
