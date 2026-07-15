import React, { useEffect, useState } from 'react'
import { useAuth, type Profile } from '@/contexts/AuthContext'
import { usePermission } from '@/hooks/usePermission'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ROLES, COUNTRIES } from '@/constants'
import type { UserRole } from '@/constants'

export default function ProfileEditorPage() {
  const { profile, updateProfile } = useAuth()
  const { can } = usePermission()
  const canManageRoles = can('manage_roles')

  const [name, setName] = useState(profile?.name || '')
  const [biography, setBiography] = useState(profile?.biography || '')
  const [institution, setInstitution] = useState(profile?.institution || '')
  const [country, setCountry] = useState(profile?.country || '')
  const [community, setCommunity] = useState(profile?.community || '')
  const [indigenousLanguage, setIndigenousLanguage] = useState(profile?.indigenous_language || '')
  const [role, setRole] = useState<UserRole>(profile?.role || 'Student')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setBiography(profile.biography || '')
      setInstitution(profile.institution || '')
      setCountry(profile.country || '')
      setCommunity(profile.community || '')
      setIndigenousLanguage(profile.indigenous_language || '')
      setRole(profile.role)
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    const updates: Partial<Profile> = {
      name, biography, institution, country, community,
      indigenous_language: indigenousLanguage,
    }
    if (canManageRoles) (updates as Record<string, unknown>).role = role
    const { error } = await updateProfile(updates)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Profile updated')
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="border-emerald-800 bg-emerald-950/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white text-lg">Profile Information</CardTitle>
          <CardDescription className="text-emerald-200/60">Update your public profile details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-emerald-100">Full Name</Label>
              <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-country" className="text-emerald-100">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-emerald-900/40 border-emerald-700 text-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-emerald-950 border-emerald-700 max-h-60">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-white focus:bg-emerald-800">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-institution" className="text-emerald-100">Institution</Label>
              <Input id="profile-institution" value={institution} onChange={(e) => setInstitution(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="University or organization" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-community" className="text-emerald-100">Community</Label>
              <Input id="profile-community" value={community} onChange={(e) => setCommunity(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="Your community" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-language" className="text-emerald-100">Indigenous Language</Label>
              <Input id="profile-language" value={indigenousLanguage} onChange={(e) => setIndigenousLanguage(e.target.value)} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="e.g. Yoruba, Swahili" />
            </div>
            {canManageRoles && (
              <div className="space-y-2">
                <Label htmlFor="profile-role" className="text-emerald-100">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="bg-emerald-900/40 border-emerald-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-emerald-950 border-emerald-700">
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="text-white focus:bg-emerald-800">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-bio" className="text-emerald-100">Biography</Label>
            <Textarea id="profile-bio" value={biography} onChange={(e) => setBiography(e.target.value)} rows={4} className="bg-emerald-900/40 border-emerald-700 text-white" placeholder="Tell us about yourself..." />
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
