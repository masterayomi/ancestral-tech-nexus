import { useState } from "react";
import StrategyDoc from "./components/StrategyDoc";
import InformationArchitecture from "./components/InformationArchitecture";
import SecurityArchitecture from "./components/SecurityArchitecture";
import EcosystemBlueprint from "./components/EcosystemBlueprint";
import MasterDocumentation from "./components/MasterDocumentation";
import KnowledgeModel from "./components/KnowledgeModel";
import KnowledgeTypeSystem from "./components/KnowledgeTypeSystem";
import KnowledgeRelationshipModel from "./components/KnowledgeRelationshipModel";
import KnowledgeGovernance from "./components/KnowledgeGovernance";
import RecommendationEngine from "./components/RecommendationEngine";
import ScalabilityStrategy from "./components/ScalabilityStrategy";
import AdminModule from "./components/admin/AdminModule";
import AuthManagement from "./components/AuthManagement";
import KnowledgeRepository from "./components/KnowledgeRepository";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { Shield, LogIn, BookOpen } from "lucide-react";

type AppView = "strategy" | "ia" | "security" | "ecosystem" | "master" | "model" | "types" | "graph" | "governance" | "recommendations" | "scalability" | "admin" | "auth" | "repository";

function AppContent() {
  const [view, setView] = useState<AppView>("scalability");
  const { user, profile } = useAuth();

  const isAdmin = profile?.role === 'Administrator' ||
    profile?.role === 'Super Administrator' ||
    profile?.role === 'National Administrator' ||
    profile?.role === 'Moderator' ||
    profile?.role === 'Reviewer';

  // If admin view is selected and user is admin, show admin module
  if (view === "admin" && isAdmin) {
    return (
      <>
        <AdminModule />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Navigation */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {user && (
          <button
            onClick={() => setView("repository")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              view === "repository"
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
            onClick={() => setView("auth")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              view === "auth"
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
            onClick={() => setView("admin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              view === "admin"
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
            onClick={() => setView("auth")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>

      {/* Phase Switcher Overlay */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-800 p-1.5 rounded-full shadow-2xl flex items-center gap-1 overflow-x-auto max-w-[90vw]">
          {[
            { id: "strategy", label: "Strategy" },
            { id: "ia", label: "Architecture" },
            { id: "security", label: "Security" },
            { id: "ecosystem", label: "Ecosystem" },
            { id: "model", label: "Model" },
            { id: "types", label: "Types" },
            { id: "graph", label: "Graph" },
            { id: "recommendations", label: "Recommendations" },
            { id: "scalability", label: "Scalability" },
            { id: "governance", label: "Governance" },
            { id: "master", label: "Reference" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                view === item.id 
                  ? "bg-amber-500 text-emerald-950 shadow-inner" 
                  : item.id === "master" 
                    ? "text-amber-400 hover:text-white"
                    : "text-emerald-200 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {view === "strategy" && <StrategyDoc />}
      {view === "ia" && <InformationArchitecture />}
      {view === "security" && <SecurityArchitecture />}
      {view === "ecosystem" && <EcosystemBlueprint />}
      {view === "model" && <KnowledgeModel />}
      {view === "types" && <KnowledgeTypeSystem />}
      {view === "graph" && <KnowledgeRelationshipModel />}
      {view === "governance" && <KnowledgeGovernance />}
      {view === "recommendations" && <RecommendationEngine />}
      {view === "scalability" && <ScalabilityStrategy />}
      {view === "master" && <MasterDocumentation />}
      {view === "auth" && <AuthManagement />}
      {view === "repository" && user && <KnowledgeRepository />}
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
