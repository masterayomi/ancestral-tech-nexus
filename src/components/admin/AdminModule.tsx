import { useState } from 'react'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'
import UserManagement from './UserManagement'
import KnowledgeManagement from './KnowledgeManagement'
import Governance from './Governance'
import PlatformSettingsPage from './PlatformSettings'

type AdminView = 'dashboard' | 'users' | 'knowledge' | 'governance' | 'settings'

export default function AdminModule() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />
      case 'users':
        return <UserManagement />
      case 'knowledge':
        return <KnowledgeManagement />
      case 'governance':
        return <Governance />
      case 'settings':
        return <PlatformSettingsPage />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <AdminLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </AdminLayout>
  )
}
