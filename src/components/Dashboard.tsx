import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Shield, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const isAdmin = profile?.role === 'Administrator' ||
    profile?.role === 'Super Administrator' ||
    profile?.role === 'National Administrator' ||
    profile?.role === 'Moderator' ||
    profile?.role === 'Reviewer'

  const navItems = [
    { id: 'scalability', label: 'Home', to: '/dashboard' },
    { id: 'repository', label: 'Repository', to: '/dashboard/repository' },
    { id: 'strategy', label: 'Strategy', to: '/strategy' },
    { id: 'architecture', label: 'Architecture', to: '/architecture' },
    { id: 'security', label: 'Security', to: '/security' },
    { id: 'ecosystem', label: 'Ecosystem', to: '/ecosystem' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-stone-900 border-r border-stone-800 p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-amber-500/20 rounded-md flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-semibold">Dashboard</div>
            <div className="text-sm font-bold">Knowledge Nexus</div>
          </div>
        </div>

        <nav className="flex-1 overflow-auto">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.id}>
                <button onClick={() => navigate(item.to)} className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-stone-800 transition-colors">
                  {item.label}
                </button>
              </li>
            ))}
            {isAdmin && (
              <li>
                <button onClick={() => navigate('/admin')} className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-stone-800 transition-colors">
                  Admin
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="mt-4 text-sm text-stone-400">{user ? user.email : 'Guest'}</div>
      </aside>

      {/* Mobile top drawer toggled area (pushes content down, not overlay) */}
      <div className="w-full md:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-stone-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500/20 rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-bold">Knowledge Nexus</div>
          </div>
          <div>
            <button onClick={() => setMobileNavOpen(v => !v)} className="px-3 py-2 rounded-md bg-stone-800 text-stone-300">
              {mobileNavOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="bg-stone-900 border-b border-stone-800 px-4 py-3">
            <nav>
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button onClick={() => { navigate(item.to); setMobileNavOpen(false) }} className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-stone-800 transition-colors">
                      {item.label}
                    </button>
                  </li>
                ))}
                {isAdmin && (
                  <li>
                    <button onClick={() => { navigate('/admin'); setMobileNavOpen(false) }} className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-stone-800 transition-colors">
                      Admin
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
