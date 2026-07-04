import React from 'react';
import { 
  Sparkles, Cpu, Network, Scale, FileText, Users, 
  GraduationCap, Lightbulb, Map, Video, Layers, 
  Shield, Activity, Award, Brain, Fingerprint,
  Share2, BookOpen, Microscope, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const RecommendationEngine: React.FC = () => {
  const recommendationScope = [
    { title: 'Articles & Research Papers', icon: FileText, desc: 'Academic and community-published scientific/cultural texts.' },
    { title: 'Experts & Communities', icon: Users, desc: 'Bridging university researchers and indigenous knowledge custodians.' },
    { title: 'Universities & Innovation Projects', icon: GraduationCap, desc: 'Educational institutions and active collaborative research initiatives.' },
    { title: 'Learning Paths & Videos', icon: Map, desc: 'Structured educational journeys and multimedia resources.' }
  ];

  const logicVectors = [
    { 
      title: 'Academic Interest Vector', 
      icon: Brain, 
      desc: 'Derived from research queries, paper downloads, and citations.',
      details: 'Analyzes scientific domain affinity and citation depth.'
    },
    { 
      title: 'Cultural Affinity Vector', 
      icon: Globe, 
      desc: 'Engagement with regional oral histories and community archives.',
      details: 'Respects linguistic preferences and regional knowledge lineages.'
    },
    { 
      title: 'Collaboration Vector', 
      icon: Share2, 
      desc: 'Analysis of past innovation project involvement and expert interactions.',
      details: 'Tracks multi-disciplinary engagement and networking patterns.'
    }
  ];

  const strategies = [
    { category: 'Articles & Research Papers', primary: 'Semantic Similarity', secondary: 'Citation Network', icon: FileText },
    { category: 'Experts', primary: 'Knowledge Contribution Match', secondary: 'Geographic Proximity', icon: Users },
    { category: 'Universities', primary: 'Institutional Research Focus', secondary: 'Active Projects', icon: GraduationCap },
    { category: 'Communities', primary: 'Shared Regional Heritage', secondary: 'Activity Levels', icon: Globe },
    { category: 'Learning Paths', primary: 'Skill Gap Analysis', secondary: 'Completion Velocity', icon: Map },
    { category: 'Videos', primary: 'Content Visual Embeddings', secondary: 'Retention Metadata', icon: Video },
    { category: 'Innovation Projects', primary: 'Multidisciplinary Alignment', secondary: 'Resource Need', icon: Lightbulb }
  ];

  const safeguards = [
    { 
      title: 'Governance Filters', 
      icon: Shield, 
      desc: 'Excludes sensitive community data unless verified access is granted.',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    { 
      title: 'Diversity Re-ranking', 
      icon: Scale, 
      desc: 'Forces a 60/40 mix of Western and Indigenous sources to prevent silos.',
      color: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    { 
      title: 'Attribution Weighting', 
      icon: Award, 
      desc: 'Boosts experts who practice ethical knowledge sharing and attribution.',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF6] pb-32 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Hero Header */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/ai-recommendation-engine-hero-dfdf83a4-1782972463192.webp"
          className="w-full h-full object-cover"
          alt="AI Recommendation Engine"
        />
        <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl"
          >
            <Badge className="bg-amber-500 text-emerald-950 font-bold px-6 py-2 text-sm uppercase tracking-widest">Module 5.0: Recommendation Engine</Badge>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-tight">
              Precision Connections
            </h1>
            <p className="text-emerald-100/90 text-xl md:text-2xl max-w-3xl mx-auto font-light italic leading-relaxed">
              Synthesizing multi-vector user profiles with the Knowledge Graph to bridge academic research and indigenous expertise.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto -mt-20 relative z-10 px-6 space-y-24">
        {/* Scope Section */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendationScope.map((item, i) => (
              <Card key={i} className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 hover:shadow-2xl transition-all hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
                  <item.icon className="w-7 h-7 text-emerald-700 group-hover:text-amber-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-emerald-950 mb-3 leading-tight">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Logic Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif font-bold text-emerald-950">Core Recommendation Logic</h2>
            <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Our engine utilizes a hybrid approach, combining semantic vectors with graph-based relationship analysis.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {logicVectors.map((vector, i) => (
              <div key={i} className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <vector.icon className="w-48 h-48" />
                </div>
                <Badge className="bg-amber-500 text-emerald-950 mb-6 font-bold">Vector 0{i+1}</Badge>
                <h4 className="text-2xl font-serif font-bold mb-4">{vector.title}</h4>
                <p className="text-emerald-100/80 mb-6 text-sm leading-relaxed">{vector.desc}</p>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Technical Detail
                  </p>
                  <p className="text-emerald-50 text-xs leading-relaxed">{vector.details}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-xl border border-stone-100 p-12">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                   <h3 className="text-3xl font-serif font-bold text-emerald-950">Knowledge Graph Traversal</h3>
                   <p className="text-stone-600 leading-relaxed italic">
                     "The engine identifies 'Second-Degree Connections' by mapping shared nodes across domains, uncovering hidden opportunities for collaboration."
                   </p>
                   <div className="space-y-6">
                      <div className="flex gap-4 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                         <div className="shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">A</div>
                         <div>
                            <p className="text-sm font-bold text-emerald-950 mb-1">Functional Overlap Path</p>
                            <p className="text-xs text-stone-500">User ➔ Plant X ➔ Studied by University Y ➔ Recommend University Y</p>
                         </div>
                      </div>
                      <div className="flex gap-4 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                         <div className="shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700">B</div>
                         <div>
                            <p className="text-sm font-bold text-emerald-950 mb-1">Innovation Usage Path</p>
                            <p className="text-xs text-stone-500">User ➔ Read Article Z ➔ Used in Project W ➔ Recommend Project W</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="bg-emerald-950 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col items-center text-center">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#F59E0B_0%,_transparent_40%)] opacity-20" />
                   <Network className="w-24 h-24 text-amber-500 mb-8 animate-pulse" />
                   <h4 className="text-2xl font-serif font-bold mb-4">Hybrid Collaborative Filtering</h4>
                   <p className="text-emerald-100/70 text-sm leading-relaxed mb-8">
                     Matching item metadata like botanical keywords and regional tags to the user's vector while bridging academic papers to traditional experts.
                   </p>
                   <div className="flex gap-3 flex-wrap justify-center">
                      <Badge className="bg-white/10 border-white/20">Content-Based</Badge>
                      <Badge className="bg-white/10 border-white/20">Cross-Domain</Badge>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Strategies Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif font-bold text-emerald-950 tracking-tight">Entity-Specific Strategies</h2>
            <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Custom logic drivers optimized for each category in the Knowledge Bridge ecosystem.
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-950 text-white">
                    <th className="px-8 py-6 text-left font-serif text-lg">Recommendation Category</th>
                    <th className="px-8 py-6 text-left font-serif text-lg">Primary Logic Driver</th>
                    <th className="px-8 py-6 text-left font-serif text-lg">Secondary Driver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {strategies.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                            <row.icon className="w-5 h-5 text-emerald-700" />
                          </div>
                          <span className="font-bold text-emerald-950">{row.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-medium">
                          {row.primary}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-stone-500 text-sm font-medium">{row.secondary}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Ethics Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-serif font-bold text-emerald-950">Ethical Safeguards</h2>
             <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
               Ensuring that algorithmic suggestions respect cultural boundaries and promote intellectual equity.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {safeguards.map((item, i) => (
              <Card key={i} className="border-none shadow-xl bg-white rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:shadow-2xl transition-all">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-inner ${item.color}`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-emerald-950 mb-4">{item.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">{item.desc}</p>
                <div className="mt-auto pt-6 border-t border-stone-100 w-full italic text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                   Knowledge Governance Protocol 5.{i+1}
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-amber-500 rounded-[3rem] p-12 text-emerald-950 shadow-2xl flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1 space-y-6 text-center md:text-left">
                <h4 className="text-4xl font-serif font-bold leading-tight">Diversity by Design</h4>
                <p className="text-emerald-900/80 text-lg leading-relaxed font-medium">
                  "We actively dismantle academic silos by mandating a representational balance in recommendations, ensuring that oral histories and academic papers are presented as equally authoritative pillars of truth."
                </p>
             </div>
             <div className="w-48 h-48 bg-emerald-950/10 rounded-full flex items-center justify-center shrink-0">
                <Fingerprint className="w-24 h-24 text-emerald-950 opacity-30" />
             </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="max-w-7xl mx-auto px-6 mt-24">
         <div className="bg-emerald-950 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Cpu className="w-64 h-64" /></div>
            <div className="flex-1 space-y-6 relative z-10">
               <h4 className="text-4xl font-serif font-bold text-amber-400">The Recommendation Mandate</h4>
               <p className="text-emerald-100/70 text-lg leading-relaxed italic">
                  "Our goal is not just to provide data, but to facilitate meaningful collaboration. By recommending the right experts, projects, and papers at the right time, we accelerate the bridge between ancestral wisdom and future innovation."
               </p>
               <div className="flex gap-4">
                  <Badge variant="outline" className="border-amber-500/50 text-amber-400 py-1 px-4">Contextual</Badge>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 py-1 px-4">Ethical</Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400 py-1 px-4">Silo-Breaking</Badge>
               </div>
            </div>
            <div className="w-48 h-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center relative shrink-0">
               <Sparkles className="w-20 h-20 text-amber-500 relative z-10" />
            </div>
         </div>
      </footer>
    </div>
  );
};

export default RecommendationEngine;
