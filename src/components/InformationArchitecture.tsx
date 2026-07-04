import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Map as MapIcon, 
  Database, 
  Search, 
  FileText, 
  Users, 
  ChevronRight, 
  ChevronDown,
  Globe,
  Link2,
  Zap,
  BookOpen,
  Layout,
  Share2,
  Shield,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';

const IAHeader = () => (
  <header className="bg-emerald-950 text-white py-12 px-6 border-b border-emerald-800">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="space-y-4">
        <Badge className="bg-amber-500 hover:bg-amber-600 text-emerald-950 border-none px-4 py-1 text-xs uppercase tracking-widest font-bold">
          System Information Architecture
        </Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
          Knowledge Bridge Africa <span className="text-emerald-400 font-light">| IA V1.0</span>
        </h1>
        <p className="text-emerald-200/80 max-w-2xl text-lg leading-relaxed">
          Design for a scalable, high-fidelity knowledge ecosystem connecting indigenous wisdom with modern scientific synthesis.
        </p>
      </div>
      <div className="hidden lg:block w-48 h-48 relative opacity-20">
        <Network className="w-full h-full text-emerald-400 animate-pulse" />
      </div>
    </div>
  </header>
);

const SiteMapNode = ({ name, children, depth = 0 }: { name: string; children?: any; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = children && children.length > 0;

  return (
    <div className="ml-4 md:ml-8 mt-2">
      <div 
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
          hasChildren ? 'bg-white border-stone-200' : 'bg-stone-50 border-transparent text-stone-600'
        } hover:shadow-sm`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasChildren && (
          isOpen ? <ChevronDown className="w-4 h-4 text-emerald-600" /> : <ChevronRight className="w-4 h-4 text-emerald-600" />
        )}
        {!hasChildren && <div className="w-4" />}
        <span className={`${hasChildren ? 'font-bold text-stone-900' : 'font-medium'}`}>
          {name}
        </span>
      </div>
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-l-2 border-emerald-100/50 ml-4"
          >
            {children.map((child: any, idx: number) => (
              <SiteMapNode key={idx} {...child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ArticleStructurePreview = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-w-4xl mx-auto my-12">
    <div className="bg-stone-50 border-b border-stone-200 p-6 flex justify-between items-center">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-emerald-400" />
      </div>
      <div className="text-xs font-mono text-stone-400 tracking-widest uppercase">Article Component Model</div>
      <div className="w-12" />
    </div>
    <div className="p-8 md:p-12 space-y-12">
      {/* Header Area */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 border-none">Level 4: Validated</Badge>
          <Badge className="bg-amber-100 text-amber-700 border-none">Topic: Healthcare</Badge>
          <Badge className="bg-stone-100 text-stone-600 border-none">Origin: West Africa (Yoruba)</Badge>
        </div>
        <h2 className="text-4xl font-serif font-bold text-stone-900">Artemisia annua: Indigenous Anti-Malarial Synthesis</h2>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-stone-100 py-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-amber-600">
            <BookOpen className="w-6 h-6" />
            <h3 className="font-serif font-bold text-xl uppercase tracking-wider">The Wisdom</h3>
          </div>
          <p className="text-stone-600 leading-relaxed italic">
            Knowledge regarding the preparation of tea from dried leaves of the 'To-bal' plant, passed through oral tradition for seasonal fever management...
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-600">
            <Layers className="w-6 h-6" />
            <h3 className="font-serif font-bold text-xl uppercase tracking-wider">The Science</h3>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Identification of Artemisinin—a potent sesquiterpene lactone that clears parasites from the bloodstream. Clinical studies show 95% efficacy...
          </p>
        </div>
      </div>

      {/* Synthesis Section */}
      <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
        <div className="flex items-center gap-3 text-emerald-900 mb-6">
          <Zap className="w-6 h-6" />
          <h3 className="font-serif font-bold text-2xl">The Synthesis Bridge</h3>
        </div>
        <p className="text-emerald-800 leading-relaxed mb-6">
          Verification confirms that the traditional cold-water extraction method preserves the heat-sensitive compounds better than modern thermal processing...
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Evidence Level</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-2 rounded-full bg-emerald-600" />)}
              <div className="w-6 h-2 rounded-full bg-emerald-200" />
            </div>
          </div>
          <div>
            <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">IP Status</div>
            <div className="text-emerald-900 font-bold">Community-Owned (Fair Share Model)</div>
          </div>
        </div>
      </div>

      {/* Footer Nodes */}
      <div className="pt-8 flex flex-wrap gap-8 items-center border-t border-stone-100">
        <div className="flex items-center gap-2 text-stone-500">
          <Link2 className="w-4 h-4" />
          <span className="text-sm font-medium">Linked to: 14 Research Papers</span>
        </div>
        <div className="flex items-center gap-2 text-stone-500">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Contributors: 3 Elders, 2 PhDs</span>
        </div>
        <div className="flex items-center gap-2 text-stone-500">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">Languages: Swahili, Yoruba, English</span>
        </div>
      </div>
    </div>
  </div>
);

const InformationArchitecture: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50/50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <IAHeader />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="sitemap" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white border border-stone-200 p-1 rounded-full h-auto flex-wrap justify-center md:flex-nowrap">
              <TabsTrigger value="navigation" className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <Layout className="w-4 h-4 mr-2" /> Global Nav
              </TabsTrigger>
              <TabsTrigger value="sitemap" className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <MapIcon className="w-4 h-4 mr-2" /> Site Map
              </TabsTrigger>
              <TabsTrigger value="taxonomy" className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <Database className="w-4 h-4 mr-2" /> Taxonomy
              </TabsTrigger>
              <TabsTrigger value="search" className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <Search className="w-4 h-4 mr-2" /> Search & Graph
              </TabsTrigger>
              <TabsTrigger value="template" className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" /> Content Model
              </TabsTrigger>
              <TabsTrigger value="journeys" className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" /> User Journeys
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="navigation">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  { name: 'Home', desc: 'Personalized dashboard, global impact stats, and quick-entry portals.', icon: Globe },
                  { name: 'Knowledge Bridge', desc: 'AI-first interaction layer for synthesis and real-time translation.', icon: Zap },
                  { name: 'Knowledge Library', desc: 'Structured repository mapped to the knowledge taxonomy.', icon: BookOpen },
                  { name: 'Research', desc: 'Academic peer-review portal and datasets.', icon: Layers },
                  { name: 'Innovation Hub', desc: 'Commercialization, patent tracking, and grant applications.', icon: Share2 },
                  { name: 'Community', desc: 'Regional hubs and elder verification circles.', icon: Users },
                  { name: 'Languages', desc: 'Linguistic preservation and translation tooling.', icon: Shield },
                  { name: 'Learning', desc: 'Modular education and contributor certification paths.', icon: BookOpen },
                  { name: 'Profile', desc: 'Contribution history, IP management, and bookmarks.', icon: Users }
                ].map((nav, i) => (
                  <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <nav.icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg font-serif">{nav.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 text-sm leading-relaxed">{nav.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="sitemap">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200 shadow-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
                <div className="relative z-10 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-serif font-bold mb-8 text-center text-stone-900 underline decoration-amber-500 decoration-4 underline-offset-8">
                    Knowledge Bridge Ecosystem Hierarchy
                  </h3>
                  <div className="space-y-4">
                    <SiteMapNode name="Knowledge Bridge Africa (Root)">
                      {[
                        { name: 'Home' },
                        { name: 'Knowledge Bridge (AI Engine)', children: [{ name: 'Chat Interface' }, { name: 'Synthesis Visualizer' }, { name: 'Translation Sandbox' }] },
                        { name: 'Knowledge Library', children: [
                          { name: 'Agriculture', children: [{ name: 'Crop Science' }, { name: 'Soil Management' }, { name: 'Traditional Farming' }] },
                          { name: 'Healthcare', children: [{ name: 'Medicinal Plants' }, { name: 'Public Health' }, { name: 'Maternal Care' }] },
                          { name: 'Applied Sciences', children: [{ name: 'Sustainable Architecture' }, { name: 'Indigenous Metallurgy' }] }
                        ]},
                        { name: 'Research', children: [{ name: 'Peer-reviewed Papers' }, { name: 'Open Datasets' }, { name: 'IP Registry' }] },
                        { name: 'Community', children: [{ name: 'Elder Circles' }, { name: 'Regional Hubs' }, { name: 'Discourse Forums' }] },
                        { name: 'Admin & Profile', children: [{ name: 'Contribution Dashboard' }, { name: 'Settings' }, { name: 'Impact Analytics' }] }
                      ]}
                    </SiteMapNode>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="taxonomy">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                <div className="space-y-8">
                  <h3 className="text-3xl font-serif font-bold text-emerald-950">Knowledge Taxonomy</h3>
                  <p className="text-stone-600">The platform uses a poly-hierarchical taxonomy to categorize wisdom across scientific and cultural dimensions.</p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {[
                      { cat: 'Life Sciences', sub: ['Ethnobotany', 'Ecology', 'Human Health', 'Maternal Wisdom'] },
                      { cat: 'Physical Sciences', sub: ['Indigenous Engineering', 'Sustainable Metallurgy', 'Earthy Materials'] },
                      { cat: 'Linguistics', sub: ['Oral Traditions', 'Proverbial Logic', 'Dialect Mapping'] },
                      { cat: 'Environmental', sub: ['Climate Resilience', 'Water Sovereignty', 'Biodiversity'] }
                    ].map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-stone-200">
                        <AccordionTrigger className="text-lg font-serif font-bold text-stone-800 hover:text-emerald-700">
                          {item.cat}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2 py-4">
                            {item.sub.map((s, j) => (
                              <Badge key={j} className="bg-stone-100 text-stone-700 border-none px-4 py-1">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                
                <div className="bg-emerald-950 rounded-3xl p-10 text-white flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/knowledge-graph-visual-f5570ef7-1782893744440.webp" className="w-full h-full object-cover" alt="Graph" />
                  </div>
                  <div className="relative z-10">
                    <Badge className="bg-amber-500 text-emerald-950 mb-6 border-none">Architect's Note</Badge>
                    <h4 className="text-2xl font-serif font-bold mb-4">Scalability Design</h4>
                    <p className="text-emerald-200/80 mb-8 leading-relaxed">
                      "Taxonomy is designed for millions of nodes. By using a Knowledge Graph approach rather than a flat database, we allow one article to exist in 'Agriculture', 'Healthcare', and 'Linguistic Preservation' simultaneously."
                    </p>
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 bg-emerald-900/50 rounded-2xl border border-emerald-800">
                        <div className="text-xl font-bold">1M+</div>
                        <div className="text-xs text-emerald-400 uppercase tracking-widest">Target Articles</div>
                      </div>
                      <div className="flex-1 p-4 bg-emerald-900/50 rounded-2xl border border-emerald-800">
                        <div className="text-xl font-bold">Offline</div>
                        <div className="text-xs text-emerald-400 uppercase tracking-widest">First Architecture</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="search">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="bg-white p-12 rounded-3xl border border-stone-200 shadow-sm max-w-4xl mx-auto text-center space-y-8">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-serif font-bold text-stone-900">Multidimensional Search</h3>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                      Breaking the language barrier. Search in Swahili, find results originally documented in Yoruba, French, or English through real-time semantic mapping.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['Keyword', 'Semantic Question', 'Language', 'Country', 'Scientific Field', 'Traditional Practice', 'Evidence Level'].map((filter, i) => (
                      <Badge key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-full">
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-none shadow-md bg-stone-900 text-white">
                    <CardHeader>
                      <CardTitle className="font-serif">Semantic Relationship Model</CardTitle>
                      <CardDescription className="text-stone-400">How data nodes connect</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">1</div>
                        <p className="text-stone-300">Article ↔ Peer-Reviewed Research Paper</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-stone-900">2</div>
                        <p className="text-stone-300">Elder (Knowledge Holder) ↔ Origin Community</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">3</div>
                        <p className="text-stone-300">Traditional Method ↔ Practical Application (Innovation)</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-md bg-white">
                    <CardHeader>
                      <CardTitle className="font-serif text-emerald-950">Cross-Lingual Indexing</CardTitle>
                      <CardDescription>Preserving nuance through AI</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-stone-600 text-sm italic">"The system translates scientific concepts (e.g., Photosynthesis) into indigenous dialects without losing cultural context, and vice-versa."</p>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                          <span>Input</span>
                          <span>Bridge Mapping</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-900 font-bold">"Healing Leaf"</span>
                          <ChevronRight className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-700 font-bold">Artemisia annua</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="template">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">The Article Component Model</h3>
                  <p className="text-stone-600">Standardizing the bridge between two worlds.</p>
                </div>
                <ArticleStructurePreview />
              </motion.div>
            </TabsContent>

            <TabsContent value="journeys">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[
                  { user: 'Researcher', flow: 'Search Plant → Find Traditional Use → Review Elder Credentials → Propose Collaboration.' },
                  { user: 'Elder', flow: 'Oral Recording → AI Transcription → Language Review → Scientific Verification Loop.' },
                  { user: 'Student', flow: 'Browse Topics → Learning Modules → Certification → Community Contribution.' },
                  { user: 'Innovator', flow: 'Explore Validated Knowledge → IP Review → Pilot Project → Funding Grant.' },
                  { user: 'Gov Official', flow: 'Impact Analytics → Policy Drafting → Regional Hub Review → Public API Integration.' },
                  { user: 'General User', flow: 'Bridge Search (Question) → Synthesis Article → Related Podcasts/Media.' }
                ].map((j, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 group-hover:w-2 transition-all" />
                    <h4 className="font-serif font-bold text-xl text-emerald-950 mb-4">{j.user}</h4>
                    <p className="text-stone-600 text-sm leading-loose tracking-wide">{j.flow}</p>
                  </div>
                ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>

      <footer className="py-24 bg-stone-100 mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-1 bg-emerald-900 mx-auto rounded-full" />
          <h2 className="text-3xl font-serif font-bold text-stone-900">Ready for Implementation</h2>
          <p className="text-stone-600 text-lg">
            This Information Architecture is built to be modular. Each section (Library, Bridge, Research) can be deployed independently while remaining part of the unified Knowledge Graph.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="px-4 py-1 text-stone-500">React-Vite Core</Badge>
            <Badge variant="outline" className="px-4 py-1 text-stone-500">PostgreSQL Graph Schema</Badge>
            <Badge variant="outline" className="px-4 py-1 text-stone-500">Cross-Lingual LLM Integration</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InformationArchitecture;
