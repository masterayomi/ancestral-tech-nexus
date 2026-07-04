import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
  Shield, Clock, FileText, MessageSquare, Activity, CheckCircle,
  XCircle, Eye, Loader2, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react'
import { VALIDATION_STATUSES } from '@/constants'

type GovernanceTab = 'review' | 'audit' | 'versions' | 'comments' | 'timeline'

interface ReviewItem {
  id: string
  title: string
  summary: string
  validation_status: string
  indigenous_category: string | null
  country: string | null
  evidence_level: number
  created_by: string | null
  created_at: string
  updated_at: string
  submitter_name?: string
}

interface AuditLog {
  id: string
  user_id: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
  user_name?: string
}

interface VersionEntry {
  id: string
  knowledge_object_id: string
  version_number: string
  change_summary: string | null
  change_type: string
  created_at: string
  object_title?: string
}

export default function Governance() {
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<GovernanceTab>('review')
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [recentVersions, setRecentVersions] = useState<VersionEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTabData()
  }, [activeTab])

  const loadTabData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'review') {
        const { data, error } = await supabase
          .from('knowledge_objects')
          .select('*')
          .eq('validation_status', 'under_review')
          .eq('is_deleted', false)
          .order('updated_at', { ascending: false })
          .limit(50)
        if (error) throw error
        setReviewQueue(data || [])
      } else if (activeTab === 'audit') {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false })
          .limit(100)
        if (error) throw error
        setAuditLogs(data || [])
      } else if (activeTab === 'versions') {
        const { data, error } = await supabase
          .from('knowledge_versions')
          .select('*, knowledge_objects(title)')
          .order('created_at', { ascending: false })
          .limit(50)
        if (error) throw error
        setRecentVersions(data || [])
      }
    } catch (error: any) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (item: ReviewItem) => {
    try {
      const { error } = await supabase
        .from('knowledge_objects')
        .update({ validation_status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', item.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'knowledge_approved',
        details: { object_id: item.id, title: item.title },
      })

      toast.success('Approved successfully')
      loadTabData()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    }
  }

  const handleReject = async (item: ReviewItem) => {
    try {
      const { error } = await supabase
        .from('knowledge_objects')
        .update({ validation_status: 'revision_requested', updated_at: new Date().toISOString() })
        .eq('id', item.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'knowledge_revision_requested',
        details: { object_id: item.id, title: item.title },
      })

      toast.success('Revision requested')
      loadTabData()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    }
  }

  const handlePublish = async (item: ReviewItem) => {
    try {
      const { error } = await supabase
        .from('knowledge_objects')
        .update({
          validation_status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'knowledge_published',
        details: { object_id: item.id, title: item.title },
      })

      toast.success('Published successfully')
      loadTabData()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    }
  }

  const tabs = [
    { id: 'review', label: 'Review Queue', icon: Clock },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'versions', label: 'Version History', icon: Activity },
    { id: 'timeline', label: 'Activity Timeline', icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Governance</h2>
        <p className="text-stone-400 text-sm mt-1">Review, audit, and manage platform governance</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-2xl p-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as GovernanceTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          {/* Review Queue */}
          {activeTab === 'review' && (
            <div className="space-y-3">
              {reviewQueue.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-stone-400">Review queue is empty</p>
                  <p className="text-stone-500 text-sm mt-1">All submissions have been processed</p>
                </div>
              ) : (
                reviewQueue.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-xs text-stone-400 line-clamp-2 mb-3">{item.summary}</p>
                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          {item.indigenous_category && <span>{item.indigenous_category}</span>}
                          {item.country && <span>• {item.country}</span>}
                          <span>• Evidence Level {item.evidence_level}</span>
                          <span>• Submitted {new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-900/50 text-green-400 hover:bg-green-900 border border-green-800/50 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handlePublish(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/50 transition-all"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => handleReject(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-900/50 text-red-400 hover:bg-red-900 border border-red-800/50 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5 inline mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Audit Logs */}
          {activeTab === 'audit' && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
              {auditLogs.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <p className="text-stone-400">No audit logs found</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-800">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity className="w-4 h-4 text-stone-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">
                          <span className="font-medium">{(log as any).profiles?.name || 'System'}</span>
                          {' '}{log.action.replace(/_/g, ' ')}
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-stone-500 mt-1 font-mono">
                            {JSON.stringify(log.details).slice(0, 100)}
                          </p>
                        )}
                        <p className="text-xs text-stone-500 mt-1">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Version History */}
          {activeTab === 'versions' && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
              {recentVersions.length === 0 ? (
                <div className="p-12 text-center">
                  <Activity className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <p className="text-stone-400">No version history found</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-800">
                  {recentVersions.map((v) => (
                    <div key={v.id} className="px-5 py-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">
                          <span className="font-medium">{(v as any).knowledge_objects?.title || 'Unknown'}</span>
                          {' '}— Version {v.version_number}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">{v.change_summary || 'No summary'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                            v.change_type === 'major' ? 'bg-amber-900/50 text-amber-400' : 'bg-stone-700 text-stone-400'
                          }`}>{v.change_type}</span>
                          <span className="text-xs text-stone-500">{new Date(v.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activity Timeline */}
          {activeTab === 'timeline' && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <div className="space-y-4">
                {auditLogs.slice(0, 20).map((log, i) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        log.action.includes('publish') ? 'bg-emerald-500' :
                        log.action.includes('approve') ? 'bg-green-500' :
                        log.action.includes('delete') || log.action.includes('suspend') ? 'bg-red-500' :
                        'bg-stone-500'
                      }`} />
                      {i < auditLogs.length - 1 && <div className="w-px h-8 bg-stone-800 mt-1" />}
                    </div>
                    <div className="flex-1 -mt-1">
                      <p className="text-sm text-white">
                        <span className="font-medium">{(log as any).profiles?.name || 'System'}</span>
                        {' '}{log.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-stone-500 text-sm text-center py-8">No activity yet</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
