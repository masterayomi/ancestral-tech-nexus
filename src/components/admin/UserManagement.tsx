import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
  Search, Filter, Users, Shield, Ban, CheckCircle, Trash2,
  Eye, ChevronLeft, ChevronRight, Loader2, X, AlertTriangle,
  UserCheck, UserX, Edit
} from 'lucide-react'
import { ROLES, COUNTRIES } from '@/constants'
import type { UserRole } from '@/constants'

interface UserProfile {
  id: string
  name: string | null
  role: UserRole
  verification_status: string
  is_suspended: boolean
  suspended_at: string | null
  suspension_reason: string | null
  country: string | null
  community: string | null
  institution: string | null
  indigenous_language: string | null
  created_at?: string
  updated_at: string | null
}

export default function UserManagement() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [countryFilter, setCountryFilter] = useState<string>('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newRole, setNewRole] = useState<UserRole>('Student')
  const [suspensionReason, setSuspensionReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const PAGE_SIZE = 20

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (roleFilter) query = query.eq('role', roleFilter)
      if (statusFilter === 'suspended') query = query.eq('is_suspended', true)
      if (statusFilter === 'active') query = query.eq('is_suspended', false)
      if (countryFilter) query = query.eq('country', countryFilter)
      if (search) {
        query = query.or(`name.ilike.%${search}%,id.eq.${search}`)
      }

      const { data, error, count } = await query
      if (error) throw error
      setUsers(data || [])
      setTotalCount(count || 0)
    } catch (error: any) {
      toast.error('Failed to load users: ' + error.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter, statusFilter, countryFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleChangeRole = async () => {
    if (!selectedUser) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', selectedUser.id)
      if (error) throw error

      // Also update user_roles
      await supabase.from('user_roles').update({ role: newRole }).eq('user_id', selectedUser.id)

      // Log audit
      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'role_change',
        details: { target_user: selectedUser.id, old_role: selectedUser.role, new_role: newRole },
      })

      toast.success(`Role updated to ${newRole}`)
      setShowRoleModal(false)
      fetchUsers()
    } catch (error: any) {
      toast.error('Failed to change role: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSuspend = async () => {
    if (!selectedUser) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_at: new Date().toISOString(),
          suspended_by: currentUser?.id,
          suspension_reason: suspensionReason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'user_suspended',
        details: { target_user: selectedUser.id, reason: suspensionReason },
      })

      toast.success('User suspended')
      setShowSuspendModal(false)
      setSuspensionReason('')
      fetchUsers()
    } catch (error: any) {
      toast.error('Failed to suspend user: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReactivate = async (user: UserProfile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: false,
          suspended_at: null,
          suspended_by: null,
          suspension_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'user_reactivated',
        details: { target_user: user.id },
      })

      toast.success('User reactivated')
      fetchUsers()
    } catch (error: any) {
      toast.error('Failed to reactivate user: ' + error.message)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setSubmitting(true)
    try {
      // Soft delete - mark as suspended with reason
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_at: new Date().toISOString(),
          suspended_by: currentUser?.id,
          suspension_reason: 'Account deleted by administrator',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id)
      if (error) throw error

      await supabase.from('audit_logs').insert({
        user_id: currentUser?.id,
        action: 'user_deleted',
        details: { target_user: selectedUser.id },
      })

      toast.success('User account deleted')
      setShowDeleteModal(false)
      fetchUsers()
    } catch (error: any) {
      toast.error('Failed to delete user: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-stone-400 text-sm mt-1">{totalCount} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0) }}
            className="px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Roles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
            className="px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Country Filter */}
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

      {/* Users Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Country</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {users.map((u) => (
                  <tr key={u.id} className={`hover:bg-stone-800/50 ${u.is_suspended ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.name?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{u.name || 'Unnamed'}</p>
                          <p className="text-xs text-stone-500 truncate">{u.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-stone-800 text-stone-300">
                        <Shield className="w-3 h-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.is_suspended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-900/50 text-red-400">
                          <UserX className="w-3 h-3" />
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-900/50 text-green-400">
                          <UserCheck className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-400">{u.country || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedUser(u); setShowProfileModal(true) }}
                          className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(u); setNewRole(u.role); setShowRoleModal(true) }}
                          className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-colors"
                          title="Change Role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {u.is_suspended ? (
                          <button
                            onClick={() => handleReactivate(u)}
                            className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-green-400 transition-colors"
                            title="Reactivate"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => { setSelectedUser(u); setShowSuspendModal(true) }}
                            className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-colors"
                            title="Suspend"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedUser(u); setShowDeleteModal(true) }}
                          className="p-2 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800">
            <p className="text-sm text-stone-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-stone-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-stone-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">User Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedUser.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{selectedUser.name || 'Unnamed'}</p>
                    <p className="text-sm text-stone-400">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-stone-800/50 rounded-xl p-3">
                    <p className="text-xs text-stone-500 mb-1">Country</p>
                    <p className="text-sm text-white">{selectedUser.country || '—'}</p>
                  </div>
                  <div className="bg-stone-800/50 rounded-xl p-3">
                    <p className="text-xs text-stone-500 mb-1">Community</p>
                    <p className="text-sm text-white">{selectedUser.community || '—'}</p>
                  </div>
                  <div className="bg-stone-800/50 rounded-xl p-3">
                    <p className="text-xs text-stone-500 mb-1">Institution</p>
                    <p className="text-sm text-white">{selectedUser.institution || '—'}</p>
                  </div>
                  <div className="bg-stone-800/50 rounded-xl p-3">
                    <p className="text-xs text-stone-500 mb-1">Language</p>
                    <p className="text-sm text-white">{selectedUser.indigenous_language || '—'}</p>
                  </div>
                </div>
                <div className="bg-stone-800/50 rounded-xl p-3">
                  <p className="text-xs text-stone-500 mb-1">User ID</p>
                  <p className="text-xs text-stone-300 font-mono break-all">{selectedUser.id}</p>
                </div>
                {selectedUser.is_suspended && (
                  <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-3">
                    <p className="text-xs text-red-400 font-semibold mb-1">Suspended</p>
                    <p className="text-xs text-stone-400">{selectedUser.suspension_reason || 'No reason provided'}</p>
                    {selectedUser.suspended_at && (
                      <p className="text-xs text-stone-500 mt-1">Since {new Date(selectedUser.suspended_at).toLocaleString()}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Change Modal */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Change Role</h3>
              <p className="text-sm text-stone-400 mb-4">
                Change role for <span className="text-white font-medium">{selectedUser.name}</span>
              </p>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white mb-4 focus:outline-none focus:border-emerald-600"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeRole}
                  disabled={submitting || newRole === selectedUser.role}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Saving...' : 'Update Role'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspend Modal */}
      <AnimatePresence>
        {showSuspendModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuspendModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Suspend User</h3>
              </div>
              <p className="text-sm text-stone-400 mb-4">
                Suspend <span className="text-white font-medium">{selectedUser.name}</span>'s account.
              </p>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Reason for suspension..."
                className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white placeholder:text-stone-500 mb-4 focus:outline-none focus:border-amber-600 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowSuspendModal(false); setSuspensionReason('') }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspend}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-amber-600 hover:bg-amber-500 text-white font-medium disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Suspending...' : 'Suspend User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Delete User</h3>
              </div>
              <p className="text-sm text-stone-400 mb-6">
                Are you sure you want to delete <span className="text-white font-medium">{selectedUser.name}</span>'s account?
                This will suspend the account permanently.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
