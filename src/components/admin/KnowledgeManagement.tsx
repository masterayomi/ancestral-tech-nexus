import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
  Search, BookOpen, Edit, Trash2, Archive, CheckCircle, XCircle,
  Eye, Globe, ChevronLeft, ChevronRight, Loader2, X, AlertTriangle,
  RotateCcw, Send, FileText, Filter
} from 'lucide-react'
import { KNOWLEDGE_CATEGORIES, VALIDATION_STATUSES, COUNTRIES } from '@/constants'

interface KnowledgeObject {
  id: string
  title: string
  summary: string
  validation_status: string
  is_deleted: boolean
  is_restricted: boolean
  indigenous_category: string | null
  country: string | null
  evidence_level: number
  created_by: string | null
  created_at: string
  updated_at: string
  version: string
}

interface KnowledgeVersion {
  id: string
  knowledge_object_id: string
  version_number: string
  change_summary: string | null
  diff_snapshot: any
  changed_by: string | null
  change_type: string
  created_at: string
}

export default function KnowledgeManagement() {
  const { user: currentUser } = useAuth()
  const [objects, setObjects] = useState<KnowledgeObject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedObject, setSelectedObject] = useState<KnowledgeObject | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showVersionModal, setShowVersionModal] = useState(false)
  const [versions, setVersions] = useState<KnowledgeVersion[]>([])
  const [editForm, setEditForm] = useState<Partial<KnowledgeObject>>({})
  const [submitting, setSubmitting] = useState(false)

  const PAGE_SIZE = 20

  const fetchObjects = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('knowledge_objects')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (showDeleted) {
        query = query.eq('is_deleted', true)
      } else {
        query = query.eq('is_deleted', false)
      }

      if (statusFilter) query = query.eq('validation_status', statusFilter)
      if (categoryFilter) query = query.eq('indigenous_category', categoryFilter)
      if (countryFilter) query = query.eq('country', countryFilter)
      if (search) {
        query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`)
      }

      const { data, error, count } = await query
      if (error) throw error
      setObjects(data || [])
      setTotalCount(count || 0)
    } catch (error: any) {
      toast.error('Failed to load knowledge objects')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, categoryFilter, countryFilter, showDeleted])

  useEffect(() => {
    fetchObjects()
  }, [fetchObjects])

  const handleStatusChange = async (obj: KnowledgeObject, newStatus: string) => {
    try {
      const updates: any = {
        validation_status: newStatus,
        updated_at: new Date().toISOString(),
      }
      if (newStatus === 'published') updates.published_at = new Date().toISOString()

      const { error } = await supabase
        .from('knowledge_objects')
        .update(updates)
        .eq('id', obj.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: `knowledge_${newStatus}`,
        details: { object_id: obj.id, title: obj.title, old_status: obj.validation_status },
      })

      toast.success(`Knowledge object ${newStatus}`)
      fetchObjects()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    }
  }

  const handleSoftDelete = async () => {
    if (!selectedObject) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('knowledge_objects')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', selectedObject.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'knowledge_archived',
        details: { object_id: selectedObject.id, title: selectedObject.title },
      })

      toast.success('Knowledge object archived')
      setShowDeleteModal(false)
      fetchObjects()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRestore = async (obj: KnowledgeObject) => {
    try {
      const { error } = await supabase
        .from('knowledge_objects')
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', obj.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'knowledge_restored',
        details: { object_id: obj.id, title: obj.title },
      })

      toast.success('Knowledge object restored')
      fetchObjects()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    }
  }

  const handleHardDelete = async () => {
    if (!selectedObject) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('knowledge_objects')
        .delete()
        .eq('id', selectedObject.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'knowledge_permanently_deleted',
        details: { object_id: selectedObject.id, title: selectedObject.title },
      })

      toast.success('Knowledge object permanently deleted')
      setShowDeleteModal(false)
      fetchObjects()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedObject) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('knowledge_objects')
        .update({ ...editForm, updated_at: new Date().toISOString() })
        .eq('id', selectedObject.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'knowledge_edited',
        details: { object_id: selectedObject.id, fields: Object.keys(editForm) },
      })

      toast.success('Knowledge object updated')
      setShowEditModal(false)
      fetchObjects()
    } catch (error: any) {
      toast.error('Failed: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const openVersions = async (obj: KnowledgeObject) => {
    setSelectedObject(obj)
    try {
      const { data, error } = await supabase
        .from('knowledge_versions')
        .select('*')
        .eq('knowledge_object_id', obj.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setVersions(data || [])
      setShowVersionModal(true)
    } catch (error: any) {
      toast.error('Failed to load versions')
    }
  }

  const statusBadge = (status: string) => {
    const s = VALIDATION_STATUSES.find(v => v.value === status)
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${s?.color || 'bg-stone-600'} text-white`}>
        {s?.label || status}
      </span>
    )
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Management</h2>
          <p className="text-stone-400 text-sm mt-1">{totalCount} objects {showDeleted ? '(archived)' : ''}</p>
        </div>
        <button
          onClick={() => { setShowDeleted(!showDeleted); setPage(0) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            showDeleted
              ? 'bg-amber-600 text-white'
              : 'bg-stone-800 text-stone-400 hover:text-white'
          }`}
        >
          {showDeleted ? 'View Active' : 'View Archived'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search by title or summary..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
            className="px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Statuses</option>
            {VALIDATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0) }}
            className="px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Categories</option>
            {KNOWLEDGE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={countryFilter}
            onChange={(e) => { setCountryFilter(e.target.value); setPage(0) }}
            className="px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Objects List */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : objects.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-400">No knowledge objects found</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-800">
            {objects.map((obj) => (
              <div key={obj.id} className="p-4 hover:bg-stone-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(obj.validation_status)}
                      {obj.is_restricted && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 font-semibold">RESTRICTED</span>
                      )}
                      <span className="text-[10px] text-stone-500">v{obj.version}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate">{obj.title}</h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">{obj.summary}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                      {obj.indigenous_category && <span>{obj.indigenous_category}</span>}
                      {obj.country && <span>• {obj.country}</span>}
                      <span>• Level {obj.evidence_level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => { setSelectedObject(obj); setShowDetailModal(true) }}
                      className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedObject(obj); setEditForm(obj); setShowEditModal(true) }}
                      className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openVersions(obj)}
                      className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-blue-400 transition-colors"
                      title="Version History"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    {obj.validation_status === 'under_review' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(obj, 'approved')}
                          className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-green-400 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(obj, 'revision_requested')}
                          className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-orange-400 transition-colors"
                          title="Request Revision"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {obj.validation_status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(obj, 'published')}
                        className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-emerald-400 transition-colors"
                        title="Publish"
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                    )}
                    {!obj.is_deleted && (
                      <>
                        <button
                          onClick={() => handleStatusChange(obj, 'archived')}
                          className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-stone-300 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedObject(obj); setShowDeleteModal(true) }}
                          className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {obj.is_deleted && (
                      <button
                        onClick={() => handleRestore(obj)}
                        className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-green-400 transition-colors"
                        title="Restore"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800">
            <p className="text-sm text-stone-500">Page {page + 1} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-stone-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-stone-400">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedObject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Knowledge Object Details</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">{statusBadge(selectedObject.validation_status)}</div>
                  <h4 className="text-xl font-bold text-white">{selectedObject.title}</h4>
                </div>
                <p className="text-sm text-stone-300">{selectedObject.summary}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-800/50 rounded-xl p-3"><p className="text-xs text-stone-500 mb-1">Category</p><p className="text-sm text-white">{selectedObject.indigenous_category || '—'}</p></div>
                  <div className="bg-stone-800/50 rounded-xl p-3"><p className="text-xs text-stone-500 mb-1">Country</p><p className="text-sm text-white">{selectedObject.country || '—'}</p></div>
                  <div className="bg-stone-800/50 rounded-xl p-3"><p className="text-xs text-stone-500 mb-1">Evidence Level</p><p className="text-sm text-white">Level {selectedObject.evidence_level}</p></div>
                  <div className="bg-stone-800/50 rounded-xl p-3"><p className="text-xs text-stone-500 mb-1">Version</p><p className="text-sm text-white">{selectedObject.version}</p></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedObject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Edit Knowledge Object</h3>
                <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-stone-400 mb-1 block">Title</label>
                  <input type="text" value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600" />
                </div>
                <div>
                  <label className="text-xs text-stone-400 mb-1 block">Summary</label>
                  <textarea value={editForm.summary || ''} onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">Status</label>
                    <select value={editForm.validation_status || 'draft'} onChange={(e) => setEditForm({ ...editForm, validation_status: e.target.value })} className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600">
                      {VALIDATION_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 mb-1 block">Evidence Level</label>
                    <select value={editForm.evidence_level || 1} onChange={(e) => setEditForm({ ...editForm, evidence_level: parseInt(e.target.value) })} className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600">
                      {[1,2,3,4,5].map((l) => (<option key={l} value={l}>Level {l}</option>))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-all">Cancel</button>
                  <button onClick={handleSaveEdit} disabled={submitting} className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-all">{submitting ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedObject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
                <h3 className="text-lg font-bold text-white">Delete Knowledge Object</h3>
              </div>
              <p className="text-sm text-stone-400 mb-6">Permanently delete <span className="text-white font-medium">{selectedObject.title}</span>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-all">Cancel</button>
                <button onClick={handleHardDelete} disabled={submitting} className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50 transition-all">{submitting ? 'Deleting...' : 'Delete'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version History Modal */}
      <AnimatePresence>
        {showVersionModal && selectedObject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowVersionModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Version History</h3>
                <button onClick={() => setShowVersionModal(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"><X className="w-5 h-5" /></button>
              </div>
              {versions.length === 0 ? (
                <p className="text-stone-500 text-sm text-center py-8">No version history</p>
              ) : (
                <div className="space-y-3">
                  {versions.map((v, i) => (
                    <div key={v.id} className="bg-stone-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">Version {v.version_number}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${v.change_type === 'major' ? 'bg-amber-900/50 text-amber-400' : 'bg-stone-700 text-stone-400'}`}>{v.change_type}</span>
                      </div>
                      <p className="text-xs text-stone-400">{v.change_summary || 'No summary'}</p>
                      <p className="text-xs text-stone-500 mt-2">{new Date(v.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
