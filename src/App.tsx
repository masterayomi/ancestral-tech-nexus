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

      {/* Main content area with Outlet for routed components */}
      <Outlet />
      
      <Toaster />
    </div>
  );
}

export default AppContent;
