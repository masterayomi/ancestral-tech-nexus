import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { usePermission } from '@/hooks/usePermission'
import {
  LayoutDashboard, Users, BookOpen, Shield, Settings, LogOut,
  Menu, X, Bell, ChevronDown, Activity, FileText, MessageSquare
} from 'lucide-react'

type AdminView = 'dashboard' | 'users' | 'knowledge' | 'governance' | 'settings'

interface AdminLayoutProps {
  children: React.ReactNode
  currentView: AdminView
  onViewChange: (view: AdminView) => void
}

export default function AdminLayout({ children, currentView, onViewChange }: AdminLayoutProps) {
  const { profile, signOut } = useAuth()
  const { isAdmin } = usePermission()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-stone-400">You do not have administrator privileges.</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'governance', label: 'Governance', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-stone-900 border border-stone-800 rounded-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 h-full w-64 bg-stone-900 border-r border-stone-800 z-40 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-stone-800">
              <h1 className="font-serif text-xl font-bold text-amber-400">Admin Panel</h1>
              <p className="text-xs text-stone-500 mt-1">Knowledge Bridge Africa</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id as AdminView)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-stone-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold">
                  {profile?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{profile?.name || 'Administrator'}</p>
                  <p className="text-xs text-stone-500 truncate">{profile?.role}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-stone-400 hover:text-red-400 hover:bg-stone-800/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-stone-900/80 backdrop-blur-md border-b border-stone-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white capitalize">{currentView}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <Bell className="w-5 h-5 text-stone-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
