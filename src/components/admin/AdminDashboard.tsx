import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import {
  Users, BookOpen, Clock, CheckCircle, Building2, Globe,
  Languages, Activity, Bell, TrendingUp, AlertCircle, Loader2
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalKnowledgeObjects: number
  pendingReviews: number
  publishedKnowledge: number
  institutions: number
  communities: number
  languages: number
}

interface RecentActivity {
  id: string
  user_id: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
  user_name?: string
}

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  is_read: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalKnowledgeObjects: 0,
    pendingReviews: 0,
    publishedKnowledge: 0,
    institutions: 0,
    communities: 0,
    languages: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all stats in parallel
      const [
        { count: totalUsers },
        { count: totalKnowledgeObjects },
        { count: pendingReviews },
        { count: publishedKnowledge },
        { data: profilesData },
        { data: activityData },
        { data: notificationsData },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('knowledge_objects').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('knowledge_objects').select('*', { count: 'exact', head: true }).eq('validation_status', 'under_review'),
        supabase.from('knowledge_objects').select('*', { count: 'exact', head: true }).eq('validation_status', 'published'),
        supabase.from('profiles').select('institution, community, indigenous_language'),
        supabase.from('audit_logs').select('*, profiles(name)').order('created_at', { ascending: false }).limit(10),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      // Calculate unique institutions, communities, languages
      const institutions = new Set(profilesData?.map(p => p.institution).filter(Boolean) || [])
      const communities = new Set(profilesData?.map(p => p.community).filter(Boolean) || [])
      const languages = new Set(profilesData?.map(p => p.indigenous_language).filter(Boolean) || [])

      setStats({
        totalUsers: totalUsers || 0,
        totalKnowledgeObjects: totalKnowledgeObjects || 0,
        pendingReviews: pendingReviews || 0,
        publishedKnowledge: publishedKnowledge || 0,
        institutions: institutions.size,
        communities: communities.size,
        languages: languages.size,
      })

      setRecentActivity(activityData || [])
      setNotifications(notificationsData || [])
    } catch (error: any) {
      toast.error('Failed to load dashboard data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-600 to-blue-800' },
    { label: 'Knowledge Objects', value: stats.totalKnowledgeObjects, icon: BookOpen, color: 'from-emerald-600 to-emerald-800' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Clock, color: 'from-amber-600 to-amber-800' },
    { label: 'Published', value: stats.publishedKnowledge, icon: CheckCircle, color: 'from-green-600 to-green-800' },
    { label: 'Institutions', value: stats.institutions, icon: Building2, color: 'from-purple-600 to-purple-800' },
    { label: 'Communities', value: stats.communities, icon: Globe, color: 'from-teal-600 to-teal-800' },
    { label: 'Languages', value: stats.languages, icon: Languages, color: 'from-orange-600 to-orange-800' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 text-white/80" />
                <TrendingUp className="w-4 h-4 text-white/60" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-stone-500 text-sm text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-stone-800/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{(activity as any).profiles?.name || 'System'}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-stone-500 text-sm text-center py-8">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl border ${
                    notification.is_read
                      ? 'bg-stone-800/30 border-stone-800'
                      : 'bg-amber-900/20 border-amber-800/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {notification.notification_type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                    {notification.notification_type === 'success' && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
                    {notification.notification_type === 'info' && <Bell className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{notification.title}</p>
                      <p className="text-xs text-stone-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-stone-500 mt-2">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
