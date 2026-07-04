import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { usePermission } from '@/hooks/usePermission'
import { toast } from 'sonner'
import {
  Search, Filter, Plus, Pencil, Trash2, Archive, Eye, Check, X,
  Star, Globe, MapPin, User, Calendar, Clock, ArrowLeft,
  MoreHorizontal, LayoutGrid, List, BookOpen, Send, ChevronDown,
  BookMarked, Layers, Tag, ShieldCheck, BadgeCheck, AlertCircle,
  FileText, ChevronLeft, ChevronRight, RotateCcw, XCircle
} from 'lucide-react'
import {
  APP_NAME,
  KNOWLEDGE_CATEGORIES,
  SCIENTIFIC_DISCIPLINES,
  EVIDENCE_LEVELS,
  VALIDATION_STATUSES,
  COUNTRIES,
  AFRICAN_REGIONS,
  KNOWLEDGE_REPO_CONSTANTS
} from '@/constants'

// Types
interface KnowledgeObject {
  id: string
  title: string
  subtitle: string | null
  summary: string
  full_content: string | null
  indigenous_knowledge: string | null
  scientific_explanation: string | null
  practical_applications: any
  indigenous_category: string | null
  scientific_discipline: string | null
  evidence_level: number
  validation_status: string
  country: string | null
  region: string | null
  ethnic_community: string | null
  indigenous_language: string | null
  english_translation: string | null
  keywords: string[] | null
  local_names: string[] | null
  scientific_names: string[] | null
  contributor: string | null
  contributors: string[] | null
  reviewer: string | null
  institution: string | null
  reference_links: any
  geographic_location: any
  traditional_application: string | null
  licensing: string | null
  cultural_permissions: string | null
  community_ownership: string | null
  version: string
  is_deleted: boolean
  is_restricted: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  published_at: string | null
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

interface KnowledgeRelationship {
  id: string
  source_object_id: string
  target_object_id: string
  relationship_type: string
  confidence: number | null
  evidence_type: string | null
  created_by: string | null
  created_at: string
}

type ViewMode = 'hub' | 'detail' | 'editor'

interface Filters {
  category: string
  country: string
  language: string
  evidenceLevel: number | null
  status: string
  discipline: string
  region: string
  search: string
}

const emptyFilters: Filters = {
  category: '',
  country: '',
  language: '',
  evidenceLevel: null,
  status: '',
  discipline: '',
  region: '',
  search: '',
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function KnowledgeRepository() {
  const { user, profile } = useAuth()
  const { hasRole } = usePermission()
  const [viewMode, setViewMode] = useState<ViewMode>('hub')
  const [objects, setObjects] = useState<KnowledgeObject[]>([])
  const [selectedObject, setSelectedObject] = useState<KnowledgeObject | null>(null)
  const [versions, setVersions] = useState<KnowledgeVersion[]>([])
  const [relationships, setRelationships] = useState<KnowledgeRelationship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [detailTab, setDetailTab] = useState<'details' | 'versions' | 'relationships'>('details')
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showHardDeleteConfirm, setShowHardDeleteConfirm] = useState(false)

  const PAGE_SIZE = 12
  const isAdmin = hasRole('Moderator')
  const canCreate = user !== null

  // Editor form state
  const [editForm, setEditForm] = useState<Partial<KnowledgeObject>>({})
  const [isEditing, setIsEditing] = useState(false)

  const fetchObjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('knowledge_objects')
        .select('*', { count: 'exact' })
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (filters.category) query = query.eq('indigenous_category', filters.category)
      if (filters.country) query = query.eq('country', filters.country)
      if (filters.language) query = query.eq('indigenous_language', filters.language)
      if (filters.evidenceLevel) query = query.eq('evidence_level', filters.evidenceLevel)
      if (filters.status) query = query.eq('validation_status', filters.status)
      if (filters.discipline) query = query.eq('scientific_discipline', filters.discipline)
      if (filters.region) query = query.eq('region', filters.region)
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`)
      }

      const { data, error: err, count } = await query
      if (err) throw err
      setObjects(data || [])
      setTotalCount(count || 0)
    } catch (e: any) {
      setError(e.message || KNOWLEDGE_REPO_CONSTANTS.ERROR_LOADING)
      toast.error(e.message || KNOWLEDGE_REPO_CONSTANTS.ERROR_LOADING)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchObjects()
  }, [fetchObjects])

  const openDetail = async (obj: KnowledgeObject) => {
    setSelectedObject(obj)
    setViewMode('detail')
    setDetailTab('details')
    try {
      const [{ data: vers }, { data: rels }] = await Promise.all([
        supabase.from('knowledge_versions').select('*').eq('knowledge_object_id', obj.id).order('created_at', { ascending: false }),
        supabase.from('knowledge_relationships').select('*').or(`source_object_id.eq.${obj.id},target_object_id.eq.${obj.id}`)
      ])
      setVersions(vers || [])
      setRelationships(rels || [])
    } catch (e: any) {
      toast.error('Failed to load versions and relationships')
    }
  }

  const openEditor = (obj?: KnowledgeObject) => {
    if (obj) {
      setEditForm({ ...obj })
      setIsEditing(true)
    } else {
      setEditForm({
        title: '',
        summary: '',
        evidence_level: 1,
        validation_status: 'draft',
        version: '1.0.0',
        licensing: 'CC BY-NC-SA 4.0',
      })
      setIsEditing(false)
    }
    setViewMode('editor')
  }

  const handleSave = async (status: string = 'draft') => {
    if (!user) {
      toast.error('You must be signed in to contribute.')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        ...editForm,
        validation_status: status,
        created_by: isEditing ? editForm.created_by : user.id,
        updated_at: new Date().toISOString(),
      }

      if (isEditing && editForm.id) {
        const { error: err } = await supabase
          .from('knowledge_objects')
          .update(payload)
          .eq('id', editForm.id)
        if (err) throw err
        toast.success('Knowledge object updated.')
      } else {
        const { error: err } = await supabase
          .from('knowledge_objects')
          .insert({ ...payload, created_by: user.id, created_at: new Date().toISOString() })
        if (err) throw err
        toast.success('Knowledge object created.')
      }
      setViewMode('hub')
      fetchObjects()
    } catch (e: any) {
      toast.error(e.message || 'Failed to save knowledge object.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSoftDelete = async () => {
    if (!selectedObject) return
    try {
      const { error: err } = await supabase
        .from('knowledge_objects')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', selectedObject.id)
      if (err) throw err
      toast.success('Knowledge object archived.')
      setShowDeleteConfirm(false)
      setViewMode('hub')
      fetchObjects()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete.')
    }
  }

  const handleHardDelete = async () => {
    if (!selectedObject || !isAdmin) return
    try {
      const { error: err } = await supabase
        .from('knowledge_objects')
        .delete()
        .eq('id', selectedObject.id)
      if (err) throw err
      toast.success('Knowledge object permanently deleted.')
      setShowHardDeleteConfirm(false)
      setViewMode('hub')
      fetchObjects()
    } catch (e: any) {
      toast.error(e.message || 'Failed to permanently delete.')
    }
  }

  const handleRestore = async (obj: KnowledgeObject) => {
    try {
      const { error: err } = await supabase
        .from('knowledge_objects')
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', obj.id)
      if (err) throw err
      toast.success('Knowledge object restored.')
      fetchObjects()
    } catch (e: any) {
      toast.error(e.message || 'Failed to restore.')
    }
  }

  const handleRestoreVersion = async (version: KnowledgeVersion) => {
    if (!selectedObject || !user) return
    try {
      const snapshot = version.diff_snapshot
      const { error: err } = await supabase
        .from('knowledge_objects')
        .update({
          title: snapshot.title,
          summary: snapshot.summary,
          full_content: snapshot.full_content,
          indigenous_knowledge: snapshot.indigenous_knowledge,
          scientific_explanation: snapshot.scientific_explanation,
          evidence_level: snapshot.evidence_level,
          indigenous_category: snapshot.indigenous_category,
          scientific_discipline: snapshot.scientific_discipline,
          country: snapshot.country,
          ethnic_community: snapshot.ethnic_community,
          indigenous_language: snapshot.indigenous_language,
          keywords: snapshot.keywords,
          version: selectedObject.version,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedObject.id)
      if (err) throw err
      toast.success(`Restored to version ${version.version_number}.`)
      openDetail(selectedObject)
    } catch (e: any) {
      toast.error(e.message || 'Failed to restore version.')
    }
  }

  const clearFilters = () => {
    setFilters(emptyFilters)
    setPage(0)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const statusBadge = (status: string) => {
    const s = VALIDATION_STATUSES.find(v => v.value === status)
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${s?.color || 'bg-slate-500'} text-white`}>
        {s?.label || status}
      </span>
    )
  }

  const evidenceStars = (level: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= level ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`}
        />
      ))}
    </div>
  )

  // Render Hub
  if (viewMode === 'hub') {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
        {/* Hero Bento */}
        <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-5 gap-4"
          >
            <motion.div variants={fadeUp} className="lg:col-span-3 bg-gradient-to-br from-emerald-950 to-emerald-900 border border-emerald-800 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <p className="text-amber-400 text-[11px] uppercase tracking-[0.18em] font-semibold mb-3">Knowledge Repository</p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight text-white">
                  {KNOWLEDGE_REPO_CONSTANTS.PAGE_TITLE}
                </h1>
                <p className="text-emerald-200/80 mt-4 max-w-xl text-sm md:text-base leading-relaxed">
                  {KNOWLEDGE_REPO_CONSTANTS.PAGE_SUBTITLE}
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                {canCreate && (
                  <button
                    onClick={() => openEditor()}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-5 py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    {KNOWLEDGE_REPO_CONSTANTS.CREATE_NEW}
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-stone-400">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span className="text-xs uppercase tracking-widest font-semibold">Repository Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-800/50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white font-serif">{totalCount}</p>
                  <p className="text-xs text-stone-400 mt-1">Total Objects</p>
                </div>
                <div className="bg-stone-800/50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-emerald-400 font-serif">{objects.filter(o => o.validation_status === 'published').length}</p>
                  <p className="text-xs text-stone-400 mt-1">Published</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Search & Filters Bar */}
        <section className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                placeholder={KNOWLEDGE_REPO_CONSTANTS.SEARCH_PLACEHOLDER}
                value={filters.search}
                onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(0) }}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showFilters ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-stone-900 text-stone-300 border border-stone-700 hover:border-stone-600'}`}
            >
              <Filter className="w-4 h-4" />
              {KNOWLEDGE_REPO_CONSTANTS.FILTERS_LABEL}
              {Object.values(filters).some(v => v !== '' && v !== null) && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-stone-800"
              >
                <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <select
                    value={filters.category}
                    onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(0) }}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="">{KNOWLEDGE_REPO_CONSTANTS.CATEGORY_LABEL}</option>
                    {KNOWLEDGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={filters.country}
                    onChange={e => { setFilters(f => ({ ...f, country: e.target.value })); setPage(0) }}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="">{KNOWLEDGE_REPO_CONSTANTS.COUNTRY_LABEL}</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={filters.region}
                    onChange={e => { setFilters(f => ({ ...f, region: e.target.value })); setPage(0) }}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="">{KNOWLEDGE_REPO_CONSTANTS.REGION_LABEL}</option>
                    {AFRICAN_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select
                    value={filters.evidenceLevel || ''}
                    onChange={e => { setFilters(f => ({ ...f, evidenceLevel: e.target.value ? Number(e.target.value) : null })); setPage(0) }}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="">{KNOWLEDGE_REPO_CONSTANTS.EVIDENCE_LABEL}</option>
                    {EVIDENCE_LEVELS.map(el => <option key={el.level} value={el.level}>Level {el.level} - {el.label}</option>)}
                  </select>
                  <select
                    value={filters.status}
                    onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(0) }}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="">{KNOWLEDGE_REPO_CONSTANTS.STATUS_LABEL}</option>
                    {VALIDATION_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button
                    onClick={clearFilters}
                    className="bg-stone-800 text-stone-400 hover:text-white rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                  >
                    {KNOWLEDGE_REPO_CONSTANTS.CLEAR_FILTERS}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Card Grid */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-stone-800 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-stone-800 rounded w-full mb-2" />
                  <div className="h-3 bg-stone-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-stone-400">{error}</p>
              <button onClick={fetchObjects} className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium">Try again</button>
            </div>
          ) : objects.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-stone-600 mx-auto mb-4" />
              <p className="text-stone-400 font-serif text-lg">{KNOWLEDGE_REPO_CONSTANTS.NO_RESULTS}</p>
              <p className="text-stone-500 text-sm mt-2">{KNOWLEDGE_REPO_CONSTANTS.NO_RESULTS_HINT}</p>
              {canCreate && (
                <button onClick={() => openEditor()} className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]">
                  <Plus className="w-4 h-4" />
                  {KNOWLEDGE_REPO_CONSTANTS.CREATE_NEW}
                </button>
              )}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {objects.map((obj, i) => (
                <motion.div
                  key={obj.id}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  onClick={() => openDetail(obj)}
                  className="group cursor-pointer bg-stone-900 border border-stone-800 hover:border-emerald-800 rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {statusBadge(obj.validation_status)}
                      {obj.is_restricted && <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    {evidenceStars(obj.evidence_level)}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2">
                    {obj.title}
                  </h3>
                  <p className="text-stone-400 text-sm line-clamp-3 leading-relaxed">{obj.summary}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-800">
                    {obj.country && (
                      <span className="flex items-center gap-1 text-[10px] text-stone-500">
                        <MapPin className="w-3 h-3" />
                        {obj.country}
                      </span>
                    )}
                    {obj.indigenous_language && (
                      <span className="flex items-center gap-1 text-[10px] text-stone-500">
                        <Globe className="w-3 h-3" />
                        {obj.indigenous_language}
                      </span>
                    )}
                    {obj.contributor && (
                      <span className="flex items-center gap-1 text-[10px] text-stone-500">
                        <User className="w-3 h-3" />
                        {obj.contributor}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-stone-500 px-3">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    )
  }

  // Render Detail
  if (viewMode === 'detail' && selectedObject) {
    const obj = selectedObject
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
        {/* Back nav */}
        <div className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={() => setViewMode('hub')} className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              {KNOWLEDGE_REPO_CONSTANTS.BACK_TO_REPOSITORY}
            </button>
            <div className="flex items-center gap-2">
              {(user && obj.created_by === user.id) && (
                <button onClick={() => openEditor(obj)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
              {(user && (obj.created_by === user.id || isAdmin)) && (
                <>
                  <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                    Archive
                  </button>
                  {isAdmin && (
                    <button onClick={() => setShowHardDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950 text-red-400 hover:text-red-300 text-xs font-medium transition-colors border border-red-900">
                      <XCircle className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Split Screen Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Indigenous Wisdom */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BookMarked className="w-5 h-5 text-amber-500" />
                <h2 className="font-serif text-xl font-bold text-amber-400">{KNOWLEDGE_REPO_CONSTANTS.INDIGENOUS_WISDOM}</h2>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">{obj.title}</h1>
              {obj.subtitle && <p className="text-stone-400 italic mb-4">{obj.subtitle}</p>}
              <div className="flex flex-wrap gap-2 mb-4">{statusBadge(obj.validation_status)}{evidenceStars(obj.evidence_level)}</div>
              <div className="prose prose-invert prose-stone max-w-none">
                {obj.indigenous_knowledge ? (
                  <div className="text-stone-300 leading-relaxed whitespace-pre-wrap">{obj.indigenous_knowledge}</div>
                ) : (
                  <p className="text-stone-500 italic">No indigenous knowledge entry recorded yet.</p>
                )}
              </div>
              {obj.traditional_application && (
                <div className="mt-6 p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-1">Traditional Application</p>
                  <p className="text-stone-300 text-sm">{obj.traditional_application}</p>
                </div>
              )}
              {obj.cultural_permissions && (
                <div className="mt-3 p-4 bg-stone-800/50 rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-1">Cultural Permissions</p>
                  <p className="text-stone-400 text-sm">{obj.cultural_permissions}</p>
                </div>
              )}
            </motion.div>

            {/* Right: Scientific Context */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BadgeCheck className="w-5 h-5 text-emerald-500" />
                <h2 className="font-serif text-xl font-bold text-emerald-400">{KNOWLEDGE_REPO_CONSTANTS.SCIENTIFIC_CONTEXT}</h2>
              </div>
              {obj.scientific_explanation ? (
                <div className="text-stone-300 leading-relaxed whitespace-pre-wrap">{obj.scientific_explanation}</div>
              ) : (
                <p className="text-stone-500 italic">No scientific context recorded yet.</p>
              )}
              <div className="mt-6 space-y-3">
                {obj.indigenous_category && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-400">Category:</span>
                    <span className="text-white">{obj.indigenous_category}</span>
                  </div>
                )}
                {obj.scientific_discipline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-400">Discipline:</span>
                    <span className="text-white">{obj.scientific_discipline}</span>
                  </div>
                )}
                {obj.country && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-400">Country:</span>
                    <span className="text-white">{obj.country}</span>
                  </div>
                )}
                {obj.ethnic_community && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-400">Community:</span>
                    <span className="text-white">{obj.ethnic_community}</span>
                  </div>
                )}
                {obj.indigenous_language && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-400">Language:</span>
                    <span className="text-white">{obj.indigenous_language}</span>
                  </div>
                )}
                {obj.licensing && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-400">License:</span>
                    <span className="text-white">{obj.licensing}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-400">Version:</span>
                  <span className="text-white">{obj.version}</span>
                </div>
              </div>
              {obj.full_content && (
                <div className="mt-6 p-4 bg-stone-800/50 rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-2">Full Content</p>
                  <div className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">{obj.full_content}</div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Tabs: Versions & Relationships */}
          <div className="mt-8">
            <div className="flex gap-1 border-b border-stone-800 pb-0">
              {(['details', 'versions', 'relationships'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${detailTab === tab ? 'bg-stone-900 text-white border border-stone-800 border-b-stone-900 -mb-px' : 'text-stone-500 hover:text-stone-300'}`}
                >
                  {tab === 'details' && KNOWLEDGE_REPO_CONSTANTS.DETAILS_TAB}
                  {tab === 'versions' && KNOWLEDGE_REPO_CONSTANTS.VERSIONS_TAB}
                  {tab === 'relationships' && KNOWLEDGE_REPO_CONSTANTS.RELATIONSHIPS_TAB}
                </button>
              ))}
            </div>

            <div className="bg-stone-900 border border-t-0 border-stone-800 rounded-b-2xl p-6">
              {detailTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-1">Contributor</p>
                      <p className="text-white text-sm">{obj.contributor || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-1">Institution</p>
                      <p className="text-white text-sm">{obj.institution || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-1">Created</p>
                      <p className="text-white text-sm">{new Date(obj.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-1">Updated</p>
                      <p className="text-white text-sm">{new Date(obj.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  {obj.keywords && obj.keywords.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {obj.keywords.map(kw => (
                          <span key={kw} className="px-2 py-1 bg-stone-800 rounded-md text-xs text-stone-300">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {detailTab === 'versions' && (
                <div className="space-y-3">
                  {versions.length === 0 ? (
                    <p className="text-stone-500 text-sm">No version history available.</p>
                  ) : (
                    versions.map((v, i) => (
                      <div key={v.id} className="flex items-center justify-between p-3 bg-stone-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-stone-400">v{v.version_number}</span>
                          <span className="text-[10px] uppercase tracking-widest text-stone-500">{v.change_type}</span>
                          <span className="text-xs text-stone-400">{new Date(v.created_at).toLocaleDateString()}</span>
                          {i === 0 && <span className="text-[10px] text-emerald-500 font-semibold">{KNOWLEDGE_REPO_CONSTANTS.VERSION_CURRENT}</span>}
                        </div>
                        {i > 0 && user && (
                          <button
                            onClick={() => handleRestoreVersion(v)}
                            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {KNOWLEDGE_REPO_CONSTANTS.VERSION_RESTORE}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailTab === 'relationships' && (
                <div className="space-y-3">
                  {relationships.length === 0 ? (
                    <p className="text-stone-500 text-sm">No relationships mapped yet.</p>
                  ) : (
                    relationships.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 bg-stone-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full font-semibold">
                            {r.relationship_type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-stone-400">
                            {r.source_object_id === obj.id ? 'This object' : objects.find(o => o.id === r.source_object_id)?.title || r.source_object_id.slice(0, 8)}
                            {' -> '}
                            {r.target_object_id === obj.id ? 'This object' : objects.find(o => o.id === r.target_object_id)?.title || r.target_object_id.slice(0, 8)}
                          </span>
                        </div>
                        {r.confidence && (
                          <span className="text-xs text-stone-500">{(r.confidence * 100).toFixed(0)}% confidence</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modals */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-sm w-full">
                <h3 className="font-serif text-lg font-bold text-white mb-2">{KNOWLEDGE_REPO_CONSTANTS.CONFIRM_DELETE_TITLE}</h3>
                <p className="text-stone-400 text-sm mb-6">{KNOWLEDGE_REPO_CONSTANTS.CONFIRM_DELETE_DESC}</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-xl text-sm text-stone-400 hover:text-white transition-colors">{KNOWLEDGE_REPO_CONSTANTS.CANCEL}</button>
                  <button onClick={handleSoftDelete} className="px-4 py-2 rounded-xl text-sm bg-red-600 hover:bg-red-500 text-white font-medium transition-colors">{KNOWLEDGE_REPO_CONSTANTS.CONFIRM}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {showHardDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-stone-900 border border-red-900 rounded-2xl p-6 max-w-sm w-full">
                <h3 className="font-serif text-lg font-bold text-red-400 mb-2">{KNOWLEDGE_REPO_CONSTANTS.CONFIRM_HARD_DELETE_TITLE}</h3>
                <p className="text-stone-400 text-sm mb-6">{KNOWLEDGE_REPO_CONSTANTS.CONFIRM_HARD_DELETE_DESC}</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowHardDeleteConfirm(false)} className="px-4 py-2 rounded-xl text-sm text-stone-400 hover:text-white transition-colors">{KNOWLEDGE_REPO_CONSTANTS.CANCEL}</button>
                  <button onClick={handleHardDelete} className="px-4 py-2 rounded-xl text-sm bg-red-600 hover:bg-red-500 text-white font-medium transition-colors">{KNOWLEDGE_REPO_CONSTANTS.CONFIRM}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Render Editor
  if (viewMode === 'editor') {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
        <div className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={() => setViewMode('hub')} className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              {KNOWLEDGE_REPO_CONSTANTS.BACK_TO_REPOSITORY}
            </button>
            <h2 className="font-serif text-lg font-bold text-white">{isEditing ? KNOWLEDGE_REPO_CONSTANTS.EDIT_OBJECT : KNOWLEDGE_REPO_CONSTANTS.NEW_OBJECT}</h2>
            <div className="w-20" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white text-lg font-serif placeholder-stone-600 focus:outline-none focus:border-emerald-600 transition-colors"
                placeholder="Enter knowledge object title..."
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Subtitle</label>
              <input
                type="text"
                value={editForm.subtitle || ''}
                onChange={e => setEditForm(f => ({ ...f, subtitle: e.target.value }))}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600 transition-colors"
                placeholder="Optional subtitle..."
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Summary</label>
              <textarea
                value={editForm.summary || ''}
                onChange={e => setEditForm(f => ({ ...f, summary: e.target.value }))}
                rows={3}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                placeholder="Brief summary for search and preview..."
              />
            </div>

            {/* Split: Indigenous Knowledge / Scientific Explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2">
                  <BookMarked className="w-3.5 h-3.5" />
                  Indigenous Knowledge
                </label>
                <textarea
                  value={editForm.indigenous_knowledge || ''}
                  onChange={e => setEditForm(f => ({ ...f, indigenous_knowledge: e.target.value }))}
                  rows={8}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-amber-600 transition-colors resize-none text-sm"
                  placeholder="Traditional wisdom, oral accounts, cultural context..."
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-500 font-semibold mb-2">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Scientific Explanation
                </label>
                <textarea
                  value={editForm.scientific_explanation || ''}
                  onChange={e => setEditForm(f => ({ ...f, scientific_explanation: e.target.value }))}
                  rows={8}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600 transition-colors resize-none text-sm"
                  placeholder="Scientific context, research findings, validation..."
                />
              </div>
            </div>

            {/* Full Content (Markdown / LaTeX) */}
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">
                <FileText className="w-3.5 h-3.5" />
                Full Content (Markdown + LaTeX supported)
              </label>
              <textarea
                value={editForm.full_content || ''}
                onChange={e => setEditForm(f => ({ ...f, full_content: e.target.value }))}
                rows={10}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600 transition-colors resize-none font-mono text-sm"
                placeholder="Write markdown here. Use $$ for LaTeX equations..."
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Category</label>
                <select
                  value={editForm.indigenous_category || ''}
                  onChange={e => setEditForm(f => ({ ...f, indigenous_category: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600"
                >
                  <option value="">Select category...</option>
                  {KNOWLEDGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Scientific Discipline</label>
                <select
                  value={editForm.scientific_discipline || ''}
                  onChange={e => setEditForm(f => ({ ...f, scientific_discipline: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600"
                >
                  <option value="">Select discipline...</option>
                  {SCIENTIFIC_DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Evidence Level</label>
                <select
                  value={editForm.evidence_level || 1}
                  onChange={e => setEditForm(f => ({ ...f, evidence_level: Number(e.target.value) }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600"
                >
                  {EVIDENCE_LEVELS.map(el => <option key={el.level} value={el.level}>Level {el.level} - {el.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Country</label>
                <select
                  value={editForm.country || ''}
                  onChange={e => setEditForm(f => ({ ...f, country: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Indigenous Language</label>
                <input
                  type="text"
                  value={editForm.indigenous_language || ''}
                  onChange={e => setEditForm(f => ({ ...f, indigenous_language: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Amharic, Yoruba, Zulu..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Ethnic Community</label>
                <input
                  type="text"
                  value={editForm.ethnic_community || ''}
                  onChange={e => setEditForm(f => ({ ...f, ethnic_community: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600"
                  placeholder="Name of the community..."
                />
              </div>
            </div>

            {/* Contributor + Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Contributor Name</label>
                <input
                  type="text"
                  value={editForm.contributor || ''}
                  onChange={e => setEditForm(f => ({ ...f, contributor: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600"
                  placeholder="Primary contributor..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Institution</label>
                <input
                  type="text"
                  value={editForm.institution || ''}
                  onChange={e => setEditForm(f => ({ ...f, institution: e.target.value }))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600"
                  placeholder="Affiliated institution..."
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Keywords (comma-separated)</label>
              <input
                type="text"
                value={(editForm.keywords || []).join(', ')}
                onChange={e => setEditForm(f => ({ ...f, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) }))}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600"
                placeholder="agriculture, medicinal, drought-resistant..."
              />
            </div>

            {/* Traditional Application */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Traditional Application</label>
              <textarea
                value={editForm.traditional_application || ''}
                onChange={e => setEditForm(f => ({ ...f, traditional_application: e.target.value }))}
                rows={3}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600 transition-colors resize-none text-sm"
                placeholder="How is this knowledge traditionally applied?"
              />
            </div>

            {/* Cultural Permissions */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">Cultural Permissions</label>
              <textarea
                value={editForm.cultural_permissions || ''}
                onChange={e => setEditForm(f => ({ ...f, cultural_permissions: e.target.value }))}
                rows={2}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-600 transition-colors resize-none text-sm"
                placeholder="Any cultural restrictions on sharing or use..."
              />
            </div>

            {/* Publishing Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-800">
              <button
                onClick={() => handleSave('draft')}
                disabled={submitting || !editForm.title}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {KNOWLEDGE_REPO_CONSTANTS.SAVE_DRAFT}
              </button>
              <button
                onClick={() => handleSave('under_review')}
                disabled={submitting || !editForm.title || !editForm.summary}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {KNOWLEDGE_REPO_CONSTANTS.SUBMIT_REVIEW}
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={submitting || !editForm.title || !editForm.summary}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Globe className="w-4 h-4" />
                {KNOWLEDGE_REPO_CONSTANTS.PUBLISH}
              </button>
              <button
                onClick={() => setViewMode('hub')}
                className="flex items-center gap-2 px-5 py-2.5 text-stone-400 hover:text-white rounded-xl text-sm transition-colors ml-auto"
              >
                {KNOWLEDGE_REPO_CONSTANTS.CANCEL}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
