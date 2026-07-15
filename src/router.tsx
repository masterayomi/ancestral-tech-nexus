import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Layout component
import AppContent from './App'

// Lazy load all major page components
const StrategyDoc = lazy(() => import('./components/StrategyDoc'))
const InformationArchitecture = lazy(() => import('./components/InformationArchitecture'))
const SecurityArchitecture = lazy(() => import('./components/SecurityArchitecture'))
const EcosystemBlueprint = lazy(() => import('./components/EcosystemBlueprint'))
const MasterDocumentation = lazy(() => import('./components/MasterDocumentation'))
const KnowledgeModel = lazy(() => import('./components/KnowledgeModel'))
const KnowledgeTypeSystem = lazy(() => import('./components/KnowledgeTypeSystem'))
const KnowledgeRelationshipModel = lazy(() => import('./components/KnowledgeRelationshipModel'))
const KnowledgeGovernance = lazy(() => import('./components/KnowledgeGovernance'))
const RecommendationEngine = lazy(() => import('./components/RecommendationEngine'))
const ScalabilityStrategy = lazy(() => import('./components/ScalabilityStrategy'))
const AdminModule = lazy(() => import('./components/admin/AdminModule'))
const AuthManagement = lazy(() => import('./components/AuthManagement'))
const KnowledgeRepository = lazy(() => import('./components/KnowledgeRepository'))
const ProfileEditor = lazy(() => import('./components/ProfileEditor'))

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-emerald-200">Loading page...</p>
      </div>
    </div>
  )
}

// Wrapper component for lazy-loaded routes with Suspense
function RouteWrapper({ Component }: { Component: React.ComponentType<any> }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  )
}

// Root layout component that wraps all routes with AuthProvider
function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

// Simple auth guard for routes that require authentication
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingFallback />
  if (!user) return <Navigate to="/profile" replace />
  return <>{children}</>
}

function ProfileRoute() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingFallback />
  return user ? <RouteWrapper Component={ProfileEditor} /> : <RouteWrapper Component={AuthManagement} />
}

// Route definitions
const routes: RouteObject[] = [ 
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        // Default landing is Dashboard; Auth post-login should send users here
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <RouteWrapper Component={lazy(() => import('./components/Dashboard'))} />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <RouteWrapper Component={ScalabilityStrategy} />,
          },
          {
            path: 'repository',
            element: <RouteWrapper Component={KnowledgeRepository} />,
          },
        ],
      },

      {
        path: 'strategy',
        element: <RouteWrapper Component={StrategyDoc} />,
      },
      {
        path: 'architecture',
        element: <RouteWrapper Component={InformationArchitecture} />,
      },
      {
        path: 'security',
        element: <RouteWrapper Component={SecurityArchitecture} />,
      },
      {
        path: 'ecosystem',
        element: <RouteWrapper Component={EcosystemBlueprint} />,
      },
      {
        path: 'model',
        element: <RouteWrapper Component={KnowledgeModel} />,
      },
      {
        path: 'types',
        element: <RouteWrapper Component={KnowledgeTypeSystem} />,
      },
      {
        path: 'graph',
        element: <RouteWrapper Component={KnowledgeRelationshipModel} />,
      },
      {
        path: 'governance',
        element: <RouteWrapper Component={KnowledgeGovernance} />,
      },
      {
        path: 'recommendations',
        element: <RouteWrapper Component={RecommendationEngine} />,
      },
      {
        path: 'scalability',
        element: <RouteWrapper Component={ScalabilityStrategy} />,
      },
      {
        path: 'reference',
        element: <RouteWrapper Component={MasterDocumentation} />,
      },
      {
        path: 'admin',
        element: (
          <RequireAuth>
            <RouteWrapper Component={AdminModule} />
          </RequireAuth>
        ),
      },
      {
        path: 'profile',
        element: <ProfileRoute />,
      },
      // Keep repository top-level for backward compat, but prefer /dashboard/repository
      {
        path: 'repository',
        element: (
          <RequireAuth>
            <RouteWrapper Component={KnowledgeRepository} />
          </RequireAuth>
        ),
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
