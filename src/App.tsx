import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { Shield, LogIn, BookOpen } from "lucide-react";

type RouteId = "strategy" | "architecture" | "security" | "ecosystem" | "model" | "types" | "graph" | "governance" | "recommendations" | "scalability" | "reference" | "admin" | "profile" | "repository";

const routeMap: Record<RouteId, string> = {
  strategy: "/strategy",
  architecture: "/architecture",
  security: "/security",
  ecosystem: "/ecosystem",
  model: "/model",
  types: "/types",
  graph: "/graph",
  governance: "/governance",
  recommendations: "/recommendations",
  scalability: "/scalability",
  reference: "/reference",
  admin: "/admin",
  profile: "/profile",
  // Move repository under dashboard route
  repository: "/dashboard/repository",
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  const isAdmin = profile?.role === 'Administrator' ||
    profile?.role === 'Super Administrator' ||
    profile?.role === 'National Administrator' ||
    profile?.role === 'Moderator' ||
    profile?.role === 'Reviewer';

  const handleNavigate = (routeId: RouteId) => {
    navigate(routeMap[routeId]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Navigation */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {user && (
          <button
            onClick={() => handleNavigate("repository")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              location.pathname === "/repository"
                ? "bg-emerald-600 text-white"
                : "bg-stone-800/80 text-stone-300 hover:text-white backdrop-blur-md border border-stone-700"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Repository
          </button>
        )}
        {user && (
          <button
            onClick={() => handleNavigate("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              location.pathname === "/profile"
                ? "bg-emerald-600 text-white"
                : "bg-stone-800/80 text-stone-300 hover:text-white backdrop-blur-md border border-stone-700"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Profile
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => handleNavigate("admin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              location.pathname === "/admin"
                ? "bg-amber-500 text-emerald-950"
                : "bg-amber-900/80 text-amber-300 hover:text-white backdrop-blur-md border border-amber-700"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
        )}
        {!user && (
          <button
            onClick={() => handleNavigate("profile")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>

      {/* Main content area with Outlet for routed components */}
      <Outlet />
      
      <Toaster />
    </div>
  );
}

export default AppContent;
