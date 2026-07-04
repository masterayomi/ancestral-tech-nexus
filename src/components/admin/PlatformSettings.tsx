import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { Settings, Save, Loader2, Shield, Globe, Upload, Mail, UserPlus } from 'lucide-react'

interface PlatformSetting {
  id: string
  key: string
  value: any
  description: string | null
}

export default function PlatformSettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<PlatformSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .order('key')
      if (error) throw error
      setSettings(data || [])
      const values: Record<string, string> = {}
      ;(data || []).forEach((s: PlatformSetting) => {
        values[s.key] = typeof s.value === 'string' ? s.value : JSON.stringify(s.value)
      })
      setEditValues(values)
    } catch (error: any) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const setting of settings) {
        let parsedValue: any = editValues[setting.key]
        // Try to parse as JSON, otherwise keep as string
        try {
          parsedValue = JSON.parse(parsedValue)
        } catch {
          // Keep as string
        }

        const { error } = await supabase
          .from('platform_settings')
          .update({ value: parsedValue, updated_by: user?.id, updated_at: new Date().toISOString() })
          .eq('id', setting.id)
        if (error) throw error
      }

      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'settings_updated',
        details: { keys: settings.map(s => s.key) },
      })

      toast.success('Settings saved successfully')
    } catch (error: any) {
      toast.error('Failed to save settings: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const getSettingIcon = (key: string) => {
    switch (key) {
      case 'platform_name': return Globe
      case 'require_email_verification': return Mail
      case 'allow_public_browsing': return Globe
      case 'default_role': return UserPlus
      case 'max_upload_size_mb': return Upload
      case 'maintenance_mode': return Shield
      default: return Settings
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
          <p className="text-stone-400 text-sm mt-1">Configure platform-wide settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {settings.map((setting) => {
          const Icon = getSettingIcon(setting.key)
          const isBoolean = setting.value === true || setting.value === false ||
            editValues[setting.key] === 'true' || editValues[setting.key] === 'false'

          return (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  {setting.description && (
                    <p className="text-xs text-stone-500 mt-0.5">{setting.description}</p>
                  )}
                </div>
              </div>

              {isBoolean ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const current = editValues[setting.key]
                      setEditValues({
                        ...editValues,
                        [setting.key]: current === 'true' ? 'false' : 'true',
                      })
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      editValues[setting.key] === 'true' ? 'bg-emerald-600' : 'bg-stone-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      editValues[setting.key] === 'true' ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-sm text-stone-400">
                    {editValues[setting.key] === 'true' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  value={editValues[setting.key] || ''}
                  onChange={(e) => setEditValues({ ...editValues, [setting.key]: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-600"
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
