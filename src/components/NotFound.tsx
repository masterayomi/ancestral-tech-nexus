import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { APP_NAME } from '@/constants'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-3">404</h1>
        <p className="text-stone-400 mb-2">This page doesn't exist.</p>
        <p className="text-stone-600 text-sm mb-8">
          The page you're looking for was moved, renamed, or never existed on {APP_NAME}.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            Back to home
          </Link>
          <Link
            to="/dashboard/repository"
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium transition-colors"
          >
            Knowledge repository
          </Link>
        </div>
      </div>
    </div>
  )
}