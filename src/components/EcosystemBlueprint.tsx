import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Database,
  Search,
  BookOpen,
  Mic,
  Lightbulb,
  ShieldCheck,
  Languages,
  GraduationCap,
  Bell,
  UserCircle,
  LayoutDashboard,
  BarChart3,
  ArrowRight,
  Zap,
  Repeat,
  Layers,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

const modules = [
  {
    id: 'ai-bridge',
    name: 'AI Knowledge Bridge',
    icon: Network,
    purpose: 'Orchestrates indigenous & scientific synthesis.',
    inputs: 'User Queries, Archive Data, Research Papers',
    outputs: 'Synthesis Reports, Comparative Insights',
    connections: ['Knowledge Library', 'Indigenous Archive', 'Evidence Engine']
  },
  {
    id: 'library',
    name: 'Knowledge Library',
    icon: BookOpen,
    purpose: 'Primary repository for all validated articles.',
    inputs: 'Verified Submissions, Research Assistant',
    outputs: 'Public Articles, Citations, Meta-data',
    connections: ['AI Knowledge Bridge', 'Translation Center']
  },
  {
    id: 'archive',
    name: 'Indigenous Archive',
    icon: Mic,
    purpose: 'Vault for oral traditions & indigenous wisdom.',
    inputs: 'Audio/Video/Text from Elders & Contributors',
    outputs: 'Watermarked Digital Heritage, Dialect Maps',
    connections: ['AI Knowledge Bridge', 'Evidence Engine']
  },
  {
    id: 'innovation',
    name: 'Innovation Hub',
    icon: Lightbulb,
    purpose: 'Translates synthesized knowledge into R&D.',
    inputs: 'Synthesis Reports, University Admin input',
    outputs: 'Project Proposals, Grant Opportunities',
    connections: ['AI Knowledge Bridge', 'Analytics']
  },
  {
    id: 'evidence',
    name: 'Evidence Engine',
    icon: ShieldCheck,
    purpose: 'Scores and validates claims via peer/elder review.',
    inputs: 'New Submissions, Reviewer Feedback',
    outputs: 'Confidence Scores, Trust Badges',
    connections: ['AI Knowledge Bridge', 'Knowledge Library']
  },
  {
    id: 'translation',
    name: 'Translation Center',
    icon: Languages,
    purpose: 'Manages cross-lingual access across African dialects.',
    inputs: 'Base Content, Translator Input',
    outputs: 'Multi-dialect Articles, Audio Overlays',
    connections: ['Knowledge Library', 'AI Knowledge Bridge']
  },
  {
    id: 'tutor',
    name: 'AI Tutor',
    icon: GraduationCap,
    purpose: 'Personalized learning paths for students/teachers.',
    inputs: 'User Profile, Learning History',
    outputs: 'Quizzes, Curriculum, Progress Reports',
    connections: ['AI Knowledge Bridge', 'Learning Center']
  },
  {
    id: 'search',
    name: 'Universal Search',
    icon: Search,
    purpose: 'Multi-modal search across all knowledge types.',
    inputs: 'User Keyword/Voice/Image',
    outputs: 'Ranked Results, Semantic Connections',
    connections: ['Knowledge Library', 'Indigenous Archive']
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    icon: Zap,
    purpose: 'Helps researchers draft papers and find datasets.',
    inputs: 'Draft Text, Data Parameters',
    outputs: 'Formatted Citations, Related Datasets',
    connections: ['Knowledge Library', 'Innovation Hub']
  },
  {
    id: 'community',
    name: 'Community Hub',
    icon: UserCircle,
    purpose: 'Collaboration space for elders, scientists, and students.',
    inputs: 'Forum Posts, Event RSVPs',
    outputs: 'Group Insights, Partnership Requests',
    connections: ['Indigenous Archive', 'Learning Center']
  },
  {
    id: 'notifications',
    name: 'Global Notifications',
    icon: Bell,
    purpose: 'Alerts users to evidence updates and new research.',
    inputs: 'System Events, User Preferences',
    outputs: 'Push/Email/In-app Alerts',
    connections: ['User Profiles', 'Knowledge Library']
  },
  {
    id: 'admin',
    name: 'Admin Dashboard',
    icon: LayoutDashboard,
    purpose: 'Platform configuration and high-level management.',
    inputs: 'System Logs, Moderation Queue',
    outputs: 'Config Settings, User Permissions',
    connections: ['Analytics', 'Evidence Engine']
  },
  {
    id: 'analytics',
    name: 'Platform Analytics',
    icon: BarChart3,
    purpose: 'Tracks knowledge gaps and language demand.',
    inputs: 'Search Behavior, User Engagement',
    outputs: 'Regional Trend Reports, Accuracy Metrics',
    connections: ['Innovation Hub', 'Admin Dashboard']
  }
];

const lifecycleSteps = [
  { title: 'Submission', desc: 'Contributor or Researcher uploads content.', icon: Zap },
  { title: 'Initial Filter', desc: 'AI scans for spam or harmful content.', icon: Layers },
  { title: 'Verification', desc: 'Evidence Engine routes to Scientist or Elder.', icon: ShieldCheck },
  { title: 'Scoring', desc: 'Confidence score calculated via verification depth.', icon: BarChart3 },
  { title: 'Translation', desc: 'Content mapped to regional African languages.', icon: Languages },
  { title: 'Publication', desc: 'Article enters Library with "Bridge" template.', icon: BookOpen },
  { title: 'Indexing', desc: 'AI Knowledge Bridge vectorizes content for RAG.', icon: Cpu },
  { title: 'Feedback', desc: 'Community engagement influences Reputation Score.', icon: UserCircle },
  { title: 'Evolution', desc: 'Periodic review for new scientific/elder insights.', icon: Repeat }
];

const EcosystemBlueprint: React.FC = () => {
  const [activeModule, setActiveModule] = useState(modules[0]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-amber-100 selection:text-amber-900 pb-24">
      {/* Header */}
      <header className="bg-emerald-950 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Network className="text-emerald-950 w-7 h-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Feature Ecosystem Blueprint</h1>
          </div>
          <p className="text-emerald-100/70 max-w-2xl text-lg leading-relaxed border-l-2 border-amber-500/50 pl-6 italic">
            "A unified map of how information, users, AI, and knowledge lifecycle interact to create a single intelligent platform."
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="explorer" className="space-y-12">
          <div className="flex justify-center sticky top-4 z-40">
            <TabsList className="bg-emerald-900/90 backdrop-blur-md border border-emerald-800 p-1.5 rounded-full h-auto shadow-2xl">
              <TabsTrigger value="explorer" className="rounded-full px-4 py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-emerald-950 text-emerald-100 font-bold text-xs md:text-sm">
                <Layers className="w-4 h-4 mr-2" /> Module Explorer
              </TabsTrigger>
              <TabsTrigger value="lifecycle" className="rounded-full px-4 py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-emerald-950 text-emerald-100 font-bold text-xs md:text-sm">
                <Repeat className="w-4 h-4 mr-2" /> Knowledge Lifecycle
              </TabsTrigger>
              <TabsTrigger value="interaction" className="rounded-full px-4 py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-emerald-950 text-emerald-100 font-bold text-xs md:text-sm">
                <Network className="w-4 h-4 mr-2" /> Interaction Flows
              </TabsTrigger>
            </TabsList>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TabsContent value="explorer">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Module List */}
                <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  <h3 className="text-stone-400 uppercase text-xs font-bold tracking-widest px-4 mb-4">Core Modules</h3>
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModule(mod)}
                      className={`w-full text-left p-3 rounded-xl transition-all border-2 flex items-center gap-3 group ${
                        activeModule.id === mod.id
                          ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/20'
                          : 'bg-stone-100/50 border-transparent hover:bg-white hover:border-stone-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        activeModule.id === mod.id ? 'bg-emerald-900 text-white' : 'bg-stone-200 text-stone-500'
                      }`}>
                        <mod.icon className="w-4 h-4" />
                      </div>
                      <span className={`font-bold text-sm transition-colors ${
                        activeModule.id === mod.id ? 'text-emerald-950' : 'text-stone-600'
                      }`}>
                        {mod.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Module Detail */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeModule.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                        <div className="h-32 bg-emerald-900 flex items-end p-8 relative">
                          <div className="absolute top-0 right-0 p-8 opacity-10">
                            <activeModule.icon className="w-32 h-32 text-white" />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg translate-y-8 border-4 border-white">
                              <activeModule.icon className="w-8 h-8 text-emerald-950" />
                            </div>
                            <div className="pb-2">
                              <h2 className="text-white text-3xl font-serif font-bold">{activeModule.name}</h2>
                              <Badge className="bg-emerald-800 text-emerald-100 border-none">Active Module</Badge>
                            </div>
                          </div>
                        </div>
                        <CardContent className="pt-16 p-8 space-y-8">
                          <div>
                            <h4 className="text-stone-400 uppercase text-xs font-bold tracking-widest mb-2">Purpose</h4>
                            <p className="text-xl text-stone-700 font-serif leading-relaxed italic">
                              "{activeModule.purpose}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                              <h4 className="text-emerald-900 font-bold mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Key Inputs
                              </h4>
                              <p className="text-stone-600 text-sm leading-relaxed">{activeModule.inputs}</p>
                            </div>
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                              <h4 className="text-amber-700 font-bold mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> Key Outputs
                              </h4>
                              <p className="text-stone-600 text-sm leading-relaxed">{activeModule.outputs}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-stone-400 uppercase text-xs font-bold tracking-widest mb-4">Ecosystem Connections</h4>
                            <div className="flex flex-wrap gap-3">
                              {activeModule.connections.map(conn => (
                                <Badge key={conn} variant="outline" className="px-4 py-1.5 rounded-full border-stone-200 text-stone-600 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 cursor-default transition-colors">
                                  {conn}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifecycle">
              <div className="space-y-12 bg-white p-12 rounded-[3rem] shadow-xl border border-stone-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-900 via-amber-500 to-emerald-900" />
                <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
                  <h2 className="text-4xl font-serif font-bold text-emerald-950">Knowledge Journey</h2>
                  <p className="text-stone-500">The path from raw submission to cross-domain intelligent synthesis.</p>
                </div>

                <div className="relative">
                  {/* Vertical line for mobile, horizontal for desktop */}
                  <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-stone-100 md:-translate-x-1/2" />
                  
                  <div className="space-y-16 relative">
                    {lifecycleSteps.map((step, index) => (
                      <motion.div
                        key={step.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex flex-col md:flex-row items-center gap-8 ${
                          index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}
                      >
                        <div className={`flex-1 w-full text-center md:text-right ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                          <h4 className="text-xl font-bold text-emerald-950 mb-2">{step.title}</h4>
                          <p className="text-stone-500 text-sm max-w-sm mx-auto md:ml-auto md:mr-0">{step.desc}</p>
                        </div>
                        
                        <div className="relative z-10 w-16 h-16 rounded-full bg-emerald-900 flex items-center justify-center border-4 border-white shadow-xl">
                          <step.icon className="w-7 h-7 text-amber-500" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-emerald-950 text-[10px] font-bold flex items-center justify-center border-2 border-white">
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-1 hidden md:block" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interaction">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8">
                   <div className="bg-emerald-950 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-colors" />
                     <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                       <Zap className="text-amber-500" /> Interaction Logic
                     </h3>
                     <div className="space-y-6 relative">
                       {[
                         { step: '1. User Asks AI', module: 'AI Knowledge Bridge' },
                         { step: '2. Intent Detected', module: 'RAG Orchestrator' },
                         { step: '3. Data Retrieval', module: 'Archive + Science Library' },
                         { step: '4. Validation', module: 'Evidence Engine' },
                         { step: '5. Localization', module: 'Translation Center' },
                         { step: '6. Output', module: 'Synthesized Response' }
                       ].map((item, i) => (
                         <div key={item.step} className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-xs font-bold border border-emerald-700">
                             {i + 1}
                           </div>
                           <div>
                             <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">{item.step}</p>
                             <p className="text-lg font-medium">{item.module}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <Card className="border-2 border-dashed border-stone-200 bg-stone-50 rounded-3xl p-8">
                     <CardHeader className="p-0 mb-4">
                       <CardTitle className="text-emerald-950 text-xl font-serif">Modular Plug-in Architecture</CardTitle>
                       <CardDescription>Designed for long-term scalability and 3rd party integration.</CardDescription>
                     </CardHeader>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center gap-3">
                         <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg"><Network className="w-4 h-4"/></div>
                         <span className="text-sm font-bold text-stone-700">Public API</span>
                       </div>
                       <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center gap-3">
                         <div className="p-2 bg-amber-50 text-amber-700 rounded-lg"><Cpu className="w-4 h-4"/></div>
                         <span className="text-sm font-bold text-stone-700">Edge Offline AI</span>
                       </div>
                       <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center gap-3">
                         <div className="p-2 bg-blue-50 text-blue-700 rounded-lg"><Layers className="w-4 h-4"/></div>
                         <span className="text-sm font-bold text-stone-700">AR Modules</span>
                       </div>
                       <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center gap-3">
                         <div className="p-2 bg-purple-50 text-purple-700 rounded-lg"><Database className="w-4 h-4"/></div>
                         <span className="text-sm font-bold text-stone-700">Gov Portals</span>
                       </div>
                     </div>
                   </Card>
                 </div>

                 <div className="relative aspect-square">
                    {/* Visual connection representation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-48 h-48 rounded-full bg-amber-500/10 border-2 border-amber-500/20 animate-pulse" />
                       <div className="absolute w-72 h-72 rounded-full bg-emerald-900/5 border border-emerald-900/10 animate-reverse-spin" style={{ animationDuration: '20s' }} />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="relative w-full h-full">
                          {modules.map((mod, i) => {
                            const angle = (i * 360) / modules.length;
                            const radius = 160;
                            const x = Math.cos((angle * Math.PI) / 180) * radius;
                            const y = Math.sin((angle * Math.PI) / 180) * radius;

                            return (
                              <motion.div
                                key={mod.id}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                style={{ x, y }}
                                whileHover={{ scale: 1.2, zIndex: 50 }}
                              >
                                <div className="group relative">
                                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xl border border-stone-100 flex items-center justify-center text-emerald-900 group-hover:bg-emerald-900 group-hover:text-white transition-all cursor-help">
                                    <mod.icon className="w-6 h-6" />
                                  </div>
                                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-stone-800 text-white text-[10px] px-2 py-1 rounded pointer-events-none uppercase tracking-tighter">
                                    {mod.name}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-950 rounded-[2rem] shadow-2xl flex items-center justify-center border-4 border-amber-500 z-10">
                            <Cpu className="w-10 h-10 text-amber-500 animate-pulse" />
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  );
};

export default EcosystemBlueprint;
