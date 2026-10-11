import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export type CapabilityStatus = 'available' | 'missing' | 'unknown'

export interface BackendCapabilities {
  lifecycleRpc: CapabilityStatus
  roleChangeRpc: CapabilityStatus
  platformSettings: CapabilityStatus
  notifications: CapabilityStatus
}

const ZERO_UUID = '00000000-0000-0000-0000-000000000000'

let cached: Promise<BackendCapabilities> | null = null

async function probeRpc(name: string, args: Record<string, unknown>): Promise<CapabilityStatus> {
  const { error } = await supabase.rpc(name, args)
  if (!error) return 'available'
  // PGRST202 = function not found in the schema cache (not deployed)
  if (error.code === 'PGRST202') return 'missing'
  return 'available'
}

async function probeTable(name: string): Promise<CapabilityStatus> {
  const { error } = await supabase.from(name).select('id').limit(1)
  if (!error) return 'available'
  // PGRST205 = table not found in the schema cache; 42P01 = undefined table
  if (error.code === 'PGRST205' || error.code === '42P01') return 'missing'
  return 'unknown'
}

export function getCapabilities(): Promise<BackendCapabilities> {
  if (!cached) {
    cached = Promise.all([
      probeRpc('approve_knowledge', { p_object_id: ZERO_UUID }),
      probeRpc('admin_set_user_role', { p_user_id: ZERO_UUID, p_role: 'Student' }),
      probeTable('platform_settings'),
      probeTable('notifications'),
    ]).then(([lifecycleRpc, roleChangeRpc, platformSettings, notifications]) => ({
      lifecycleRpc,
      roleChangeRpc,
      platformSettings,
      notifications,
    }))
  }
  return cached
}

export function useCapabilities(): BackendCapabilities | null {
  const [caps, setCaps] = useState<BackendCapabilities | null>(null)

  useEffect(() => {
    let mounted = true
    getCapabilities().then((result) => {
      if (mounted) setCaps(result)
    })
    return () => { mounted = false }
  }, [])

  return caps
}