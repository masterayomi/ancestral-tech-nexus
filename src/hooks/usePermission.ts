import { useAuth, type Profile } from '@/contexts/AuthContext'
import type { UserRole } from '@/constants'

type PermissionAction = 'view_verification_queue' | 'approve_verification' | 'view_all_audit_logs' | 'manage_roles'

const roleHierarchy: Record<UserRole, number> = {
  'Visitor': 0,
  'Student': 1,
  'Administrator': 2,
  'Researcher': 3,
  'Indigenous Knowledge Holder': 4,
  'Translator': 5,
  'Reviewer': 6,
  'Moderator': 7,
  'Institution Administrator': 8,
  'National Administrator': 9,
  'Super Administrator': 10,
}

const adminRoles: UserRole[] = ['Administrator', 'Super Administrator', 'National Administrator', 'Moderator', 'Reviewer']

const permissionMap: Record<PermissionAction, (profile: Profile | null) => boolean> = {
  view_verification_queue: (p) => p !== null && adminRoles.includes(p.role),
  approve_verification: (p) => p !== null && adminRoles.includes(p.role),
  view_all_audit_logs: (p) => p !== null && adminRoles.includes(p.role),
  manage_roles: (p) => p !== null && ['Administrator', 'Super Administrator', 'National Administrator'].includes(p.role),
}

export function usePermission() {
  const { profile } = useAuth()

  const can = (action: PermissionAction): boolean => {
    const checker = permissionMap[action]
    return checker ? checker(profile) : false
  }

  const hasRole = (role: UserRole): boolean => {
    if (!profile) return false
    return roleHierarchy[profile.role] >= roleHierarchy[role]
  }

  return { can, hasRole, profile, isAdmin: profile !== null && adminRoles.includes(profile.role) }
}
