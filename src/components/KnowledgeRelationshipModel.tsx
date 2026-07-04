import React, { useState } from 'react';
import { 
  Network, Share2, GitBranch, MapPin, Globe, Users, FlaskConical, 
  BookOpen, Lightbulb, Zap, Info, ArrowRight, ArrowLeftRight, 
  ShieldCheck, AlertCircle, Compass, Search, Filter, Layers, 
  Database, Milestone, GitPullRequest, Binary, Construction, Gavel
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const KnowledgeRelationshipModel: React.FC = () => {
  const [selectedRel, setSelectedRel] = useState<string>('Supports');

  const relationshipTypes = [
    { name: 'Supports', direction: 'Directed (A -> B)', purpose: 'Indicates that A provides evidence or validation for B.', example: 'Scientific Study -> Indigenous Practice' },
    { name: 'Contradicts', direction: 'Directed (A -> B)', purpose: 'Indicates that A refutes or presents opposing evidence to B.', example: 'New Lab Test -> Traditional Claim' },
    { name: 'Expands', direction: 'Directed (A -> B)', purpose: 'A adds more detail or context to B without changing the core premise.', example: 'Detailed Protocol -> Agricultural Technique' },
    { name: 'References', direction: 'Directed (A -> B)', purpose: 'A cites B as a source of information.', example: 'Research Paper -> Historical Discovery' },
    { name: 'Is Similar To', direction: 'Bidirectional (A <-> B)', purpose: 'Indicates shared characteristics or high semantic overlap.', example: 'Neem Tree <-> Moringa' },
    { name: 'Is Related To', direction: 'Bidirectional (A <-> B)', purpose: "General semantic connection where a specific type isn't defined.", example: 'Climate Zone <-> Crop' },
    { name: 'Is Used In', direction: 'Directed (A -> B)', purpose: 'A is an ingredient, tool, or step used to achieve B.', example: 'Medicinal Plant -> Treatment Protocol' },
    { name: 'Is Derived From', direction: 'Directed (A -> B)', purpose: 'A is a product or evolution of B.', example: 'Modern Drug -> Indigenous Wisdom' },
    { name: 'Was Discovered By', direction: 'Directed (A -> B)', purpose: 'Links a discovery to a researcher, elder, or community.', example: 'Innovation -> Community Group' },
    { name: 'Is Studied By', direction: 'Directed (A -> B)', purpose: 'Links knowledge to the institutions researching it.', example: 'Medicinal Plant -> University' },
    { name: 'Is Practiced In', direction: 'Directed (A -> B)', purpose: 'Links a technique to a specific geographic region or culture.', example: 'Irrigation Method -> Region' },
    { name: 'Treats', direction: 'Directed (A -> B)', purpose: 'Medical/Biological link where A addresses condition B.', example: 'Medicinal Plant -> Disease' },
    { name: 'Prevents', direction: 'Directed (A -> B)', purpose: 'Proactive link where A stops B from occurring.', example: 'Crop Rotation -> Pest Infestation' },
    { name: 'Causes', direction: 'Directed (A -> B)', purpose: 'Causal link where A leads to effect B.', example: 'Drought -> Migration Pattern' },
    { name: 'Improves', direction: 'Directed (A -> B)', purpose: 'A enhances the performance or outcome of B.', example: 'Innovation -> Yield' },
    { name: 'Replaces', direction: 'Directed (A -> B)', purpose: 'A is a more modern, efficient, or accurate version of B.', example: 'Synthetic Material -> Traditional Material' },
    { name: 'Depends On', direction: 'Directed (A -> B)', purpose: 'Requirement link where A cannot exist/function without B.', example: 'Policy -> Dataset' },
    { name: 'Influences', direction: 'Directed (A -> B)', purpose: 'Soft link where A affects the development of B.', example: 'Historical Event -> Policy' },
    { name: 'Is Translation Of', direction: 'Bidirectional (A <-> B)', purpose: 'Cross-language link between identical concepts.', example: 'Amharic Term <-> English Term' },
  ];

  const typeMaps = [
    { 
      type: 'Medicinal Plant', 
      icon: FlaskConical,
      color: 'text-rose-500',
      links: ['Diseases', 'Active Compounds', 'Traditional Uses', 'Scientific Studies', 'Communities', 'Geographic Regions', 'Universities', 'Researchers', 'Local Names']
    },
    { 
      type: 'Crop', 
      icon: Network,
      color: 'text-emerald-500',
      links: ['Soil Types', 'Pest Species', 'Climate Zones', 'Yield Data', 'Farming Techniques', 'Market Prices', 'Nutrition Profiles']
    },
    { 
      type: 'Research Paper', 
      icon: BookOpen,
      color: 'text-purple-500',
      links: ['Authors', 'Universities', 'Datasets', 'Scientific Concepts', 'Funding Sources', 'Citations', 'Reviewers']
    },
    { 
      type: 'Innovation', 
      icon: Lightbulb,
      color: 'text-amber-500',
      links: ['Prototypes', 'Inventors', 'Market Needs', 'Previous Methods', 'Materials', 'Patent Data']
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF6] pb-32 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Hero Header */}
      <div className="relative h-[450px] overflow-hidden">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/knowledge-graph-visualization-c27dc9d8-1782899061250.webp"
          className="w-full h-full object-cover"
          alt="Knowledge Relationship Model"
        />
        <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl"
          >
            <Badge className="bg-amber-500 text-emerald-950 font-bold px-6 py-2 text-sm">MODULE 3.1: INTELLIGENT KNOWLEDGE GRAPH</Badge>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-tight">
              The Architecture of Connection
            </h1>
            <p className="text-emerald-100/90 text-xl md:text-2xl max-w-3xl mx-auto font-light italic">
              Moving beyond isolated data to an interconnected web of scientific and indigenous wisdom.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto -mt-20 relative z-10 px-6">
        <Tabs defaultValue="vision" className="space-y-12">
          <div className="flex justify-center overflow-x-auto pb-4">
            <TabsList className="bg-white/95 backdrop-blur shadow-2xl border-emerald-100 p-2 h-auto rounded-3xl flex gap-2">
              <TabsTrigger value="vision" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Compass className="w-4 h-4 mr-2" /> Vision</TabsTrigger>
              <TabsTrigger value="relationships" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Share2 className="w-4 h-4 mr-2" /> Link Types</TabsTrigger>
              <TabsTrigger value="mapping" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><GitBranch className="w-4 h-4 mr-2" /> Domain Maps</TabsTrigger>
              <TabsTrigger value="geo" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><MapPin className="w-4 h-4 mr-2" /> Geo-Context</TabsTrigger>
              <TabsTrigger value="ai" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Zap className="w-4 h-4 mr-2" /> AI Traversal</TabsTrigger>
              <TabsTrigger value="discovery" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Search className="w-4 h-4 mr-2" /> Discovery</TabsTrigger>
            </TabsList>
          </div>

          {/* Vision Tab */}
          <TabsContent value="vision">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-12 border-none shadow-2xl bg-white flex flex-col justify-center">
                <h3 className="text-4xl font-serif font-bold text-emerald-950 mb-8 underline decoration-amber-500 decoration-4 underline-offset-8">What is a Knowledge Graph?</h3>
                <div className="prose prose-emerald prose-lg text-stone-600 space-y-6">
                  <p>
                    Unlike a traditional database that stores information in isolated rows and tables, a <strong>Knowledge Graph</strong> represents knowledge as a network of nodes and edges.
                  </p>
                  <p>
                    In Knowledge Bridge Africa, nodes are <strong>Core Knowledge Objects (CKOs)</strong> and edges are the <strong>Semantic Relationships</strong> that bind them together.
                  </p>
                  <div className="bg-emerald-50 p-6 rounded-2xl border-l-4 border-amber-500">
                    <p className="font-bold text-emerald-900 mb-2 italic">"Knowledge is not in the node, but in the connection."</p>
                    <p className="text-sm text-emerald-800">By mapping how a medicinal plant relates to a disease, a specific community, and a scientific study, we unlock insights that isolated articles could never reveal.</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-8">
                <div className="bg-emerald-900 rounded-3xl p-12 text-white shadow-2xl">
                  <h4 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                    <Zap className="text-amber-400" /> Strategic Advantages
                  </h4>
                  <div className="grid gap-6">
                    {[
                      { title: 'Improved AI Reasoning', desc: 'LLMs can traverse paths to find secondary evidence, reducing hallucinations.' },
                      { title: 'Semantic Discovery', desc: 'Users find related practices across languages and borders through shared concepts.' },
                      { title: 'Cross-Domain Insight', desc: 'Identify how climate change in one region affects medicinal plant potency in another.' },
                      { title: 'Trust Verification', desc: 'Automatically cross-reference traditional claims with scientific validations.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors"><Info className="w-5 h-5 text-amber-200 group-hover:text-emerald-950" /></div>
                        <div>
                          <p className="font-bold text-lg">{item.title}</p>
                          <p className="text-sm text-emerald-200/70">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Relationships Tab */}
          <TabsContent value="relationships">
            <div className="grid lg:grid-cols-4 gap-8">
              <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden self-start">
                <CardHeader className="bg-emerald-950 text-white p-6">
                  <CardTitle className="text-xl font-serif">Relationship Lexicon</CardTitle>
                  <CardDescription className="text-emerald-200/70 text-xs">Defining the grammar of the graph.</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-1">
                      {relationshipTypes.map((rel) => (
                        <button
                          key={rel.name}
                          onClick={() => setSelectedRel(rel.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                            selectedRel === rel.name 
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-200 border shadow-sm' 
                              : 'hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <span className="font-bold text-sm">{rel.name}</span>
                          {rel.direction.includes('<->') ? <ArrowLeftRight className="w-3 h-3 text-stone-400" /> : <ArrowRight className="w-3 h-3 text-stone-400" />}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedRel}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-[3rem] shadow-2xl border border-stone-100 p-12 h-full flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-6 mb-8">
                      <div className="p-6 rounded-3xl bg-emerald-50">
                        <Share2 className="w-12 h-12 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">{selectedRel} Relationship</h4>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">{relationshipTypes.find(r => r.name === selectedRel)?.direction}</Badge>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <section>
                        <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Functional Purpose</h5>
                        <p className="text-stone-700 text-2xl leading-relaxed font-light">
                          {relationshipTypes.find(r => r.name === selectedRel)?.purpose}
                        </p>
                      </section>

                      <Card className="bg-stone-50 border-2 border-stone-100 p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Network className="w-24 h-24 text-emerald-900" />
                        </div>
                        <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Real-World Case Example</h5>
                        <div className="flex items-center gap-6">
                           <div className="flex-1 p-6 bg-white rounded-2xl shadow-sm border border-stone-100 text-center font-bold text-emerald-900">
                             {relationshipTypes.find(r => r.name === selectedRel)?.example.split(' -> ')[0] || relationshipTypes.find(r => r.name === selectedRel)?.example.split(' <-> ')[0]}
                           </div>
                           <div className="flex flex-col items-center">
                             {relationshipTypes.find(r => r.name === selectedRel)?.direction.includes('<->') ? (
                               <ArrowLeftRight className="w-8 h-8 text-amber-500" />
                             ) : (
                               <ArrowRight className="w-8 h-8 text-amber-500" />
                             )}
                             <span className="text-[10px] font-bold text-amber-600 mt-1 uppercase">{selectedRel}</span>
                           </div>
                           <div className="flex-1 p-6 bg-white rounded-2xl shadow-sm border border-stone-100 text-center font-bold text-emerald-900">
                             {relationshipTypes.find(r => r.name === selectedRel)?.example.split(' -> ')[1] || relationshipTypes.find(r => r.name === selectedRel)?.example.split(' <-> ')[1]}
                           </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          {/* Mapping Tab */}
          <TabsContent value="mapping">
             <div className="space-y-12">
               <div className="text-center max-w-3xl mx-auto space-y-4">
                  <h3 className="text-4xl font-serif font-bold text-emerald-950">Knowledge Type Maps</h3>
                  <p className="text-lg text-stone-600 italic">How primary classifications branch out into the ecosystem.</p>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                 {typeMaps.map((map, i) => (
                   <Card key={i} className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all group">
                     <CardHeader className="bg-emerald-950 text-white p-8 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/10 rounded-xl"><map.icon className="w-6 h-6 text-amber-400" /></div>
                          <CardTitle className="font-serif text-2xl">{map.type}</CardTitle>
                        </div>
                        <Badge variant="outline" className="border-emerald-700 text-emerald-200">Map v1.0</Badge>
                     </CardHeader>
                     <CardContent className="p-8">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Mandatory Relationship Targets</p>
                        <div className="flex flex-wrap gap-2">
                          {map.links.map(link => (
                            <Badge key={link} className="bg-stone-50 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors py-2 px-4 rounded-xl border border-stone-100 cursor-default">
                              {link}
                            </Badge>
                          ))}
                        </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </div>
          </TabsContent>

          {/* Geo Tab */}
          <TabsContent value="geo">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h3 className="text-4xl font-serif font-bold text-emerald-950">Geographic & Cultural Grounding</h3>
                <p className="text-lg text-stone-600 leading-relaxed">
                  Knowledge is not abstract; it belongs to places and people. The relationship model enforces a geographic context for every applicable CKO.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Globe, name: 'Country/Region', desc: 'Political boundaries and jurisdictions.' },
                    { icon: Layers, name: 'Climate Zone', desc: 'Ecological suitability and conditions.' },
                    { icon: Users, name: 'Ethnic Group', desc: 'Cultural lineage and intellectual property.' },
                    { icon: Compass, name: 'Ecosystem', desc: 'Biological and environmental context.' }
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-white rounded-3xl shadow-lg border border-stone-100 flex flex-col items-center text-center gap-3">
                       <item.icon className="w-8 h-8 text-amber-500" />
                       <h5 className="font-bold text-emerald-900">{item.name}</h5>
                       <p className="text-xs text-stone-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:40px_40px]" />
                <h4 className="text-2xl font-serif font-bold mb-8 relative z-10 text-amber-400">Institutional Interlinking</h4>
                <div className="space-y-6 relative z-10">
                   <p className="text-sm text-emerald-200">The graph connects knowledge to the physical infrastructure of African progress:</p>
                   <div className="space-y-4">
                      {[
                        { type: 'University', rel: 'Is Studied At', context: 'University of Nairobi' },
                        { type: 'Research Institute', rel: 'Validated By', context: 'KEMRI' },
                        { type: 'Government Body', rel: 'Governed By', context: 'Ministry of Agriculture' },
                        { type: 'Community Coop', rel: 'Practiced By', context: "Rural Women's Herbalist Collective" }
                      ].map((link, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                           <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-emerald-950 text-xs">{i+1}</div>
                           <div className="flex-1">
                             <p className="text-xs font-bold text-amber-400 uppercase">{link.type}</p>
                             <p className="text-sm font-medium">{link.rel} → {link.context}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI Traversal Tab */}
          <TabsContent value="ai">
             <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem]">
                <CardHeader className="bg-emerald-950 text-white p-12 text-center">
                   <CardTitle className="text-4xl font-serif font-bold mb-4">Intelligent AI Navigation</CardTitle>
                   <CardDescription className="text-emerald-200 text-lg max-w-2xl mx-auto italic">
                     "Simulating how the AI Brain traverses the continental knowledge graph."
                   </CardDescription>
                </CardHeader>
                <CardContent className="p-12">
                   <div className="max-w-4xl mx-auto space-y-12">
                      <div className="bg-stone-50 p-8 rounded-3xl border-2 border-dashed border-stone-200">
                         <h5 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                           <Search className="w-5 h-5 text-amber-500" /> User Query Case Study
                         </h5>
                         <p className="text-2xl text-stone-700 font-serif font-bold italic underline decoration-amber-500/30 underline-offset-8">
                           "Which indigenous farming methods improve soil fertility in semi-arid regions?"
                         </p>
                      </div>

                      <div className="relative space-y-6">
                         {[
                           { step: '1. Semantic Entry', action: 'Identify "Soil Fertility", "Semi-Arid", and "Farming Method" as starting nodes.' },
                           { step: '2. Geographic Filter', action: 'Traversal restricted to nodes linked to "Region: Semi-Arid Ecosystems".' },
                           { step: '3. Relationship Crawl', action: 'Look for "Indigenous Practice" nodes linked via "Improves" or "Supports" to "Soil Fertility".' },
                           { step: '4. Evidence Synthesis', action: 'Crawl outward to "Scientific Studies" linked to these practices to calculate a confidence score.' },
                           { step: '5. Response Generation', action: 'AI generates answer using primary indigenous knowledge verified by scientific cross-links.' }
                         ].map((node, i) => (
                           <div key={i} className="flex gap-8 items-start group">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-white flex items-center justify-center shrink-0 font-bold group-hover:scale-110 transition-transform shadow-lg">{i+1}</div>
                              <div className="flex-1 pt-2">
                                 <h6 className="font-bold text-emerald-950 mb-1">{node.step}</h6>
                                 <p className="text-stone-500">{node.action}</p>
                              </div>
                           </div>
                         ))}
                         <div className="absolute top-12 left-6 bottom-12 w-0.5 bg-emerald-100 -z-10" />
                      </div>

                      <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex items-center gap-6">
                        <ShieldCheck className="w-12 h-12 text-emerald-600 shrink-0" />
                        <div>
                           <h5 className="font-bold text-emerald-900">Trust-Based Navigation</h5>
                           <p className="text-sm text-stone-600 leading-relaxed">The AI is programmed to stop and flag "Information Gaps" if a practice node lacks a link to either an Elder consensus or a Scientific study, ensuring users only receive validated advice.</p>
                        </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          {/* Discovery Tab */}
          <TabsContent value="discovery">
            <div className="grid lg:grid-cols-2 gap-12">
               <div className="space-y-12">
                 <div className="space-y-4">
                    <h3 className="text-4xl font-serif font-bold text-emerald-950">Natural User Discovery</h3>
                    <p className="text-lg text-stone-600 italic">Designing the UI to reveal connections, not just list items.</p>
                 </div>

                 <div className="space-y-6">
                    {[
                      { icon: Layers, title: 'Knowledge Explorer Sidebar', desc: "Visualizes the current node's immediate neighbors (experts, related plants, studies)." },
                      { icon: Compass, title: 'Bridge Recommendations', desc: 'AI suggests unexpected links: "Because you are researching Soil, you might find this Community Practice relevant."' },
                      { icon: MapPin, title: 'Interactive Map Discovery', desc: 'See knowledge clusters geographically, identifying regional expertise centers.' },
                      { icon: Users, title: 'Community Pulse', desc: 'Live view of current discussions and observations related to the active knowledge node.' }
                    ].map((item, i) => (
                      <motion.div key={i} whileHover={{ x: 10 }} className="p-6 bg-white rounded-3xl shadow-xl border border-stone-100 flex gap-6 items-start">
                         <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                           <item.icon className="w-7 h-7 text-emerald-700" />
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-emerald-950 mb-2">{item.title}</h4>
                            <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                         </div>
                      </motion.div>
                    ))}
                 </div>
               </div>

               <div className="space-y-8 self-center">
                  <Card className="bg-emerald-950 text-white p-10 rounded-[3rem] border-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-48 h-48" /></div>
                    <h4 className="text-2xl font-serif font-bold mb-6 text-amber-400 relative z-10">Smart Content Trails</h4>
                    <div className="space-y-6 relative z-10">
                       <p className="text-emerald-100/70 leading-relaxed italic">
                         &quot;User journeys are converted into Knowledge Trails. If a student explores 'Drought Resistant Crops' &rarr; 'Kenya' &rarr; 'Maize', the system builds a semantic trail that can be shared or saved as a curated learning path.&quot;
                       </p>
                       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                            className="h-full bg-amber-500" 
                          />
                       </div>
                       <div className="flex justify-between text-xs font-mono text-emerald-400">
                         <span>EXPLORATION DEPTH</span>
                         <span>75% DISCOVERY</span>
                       </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-200 text-center">
                       <Compass className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                       <h5 className="font-bold text-amber-900 mb-2">Curated Paths</h5>
                       <p className="text-xs text-amber-800/70">Expert-led journeys through the graph.</p>
                    </div>
                    <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-center">
                       <Compass className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                       <h5 className="font-bold text-emerald-900 mb-2">Organic Search</h5>
                       <p className="text-xs text-emerald-800/70">Find nodes by semantic meaning, not just keywords.</p>
                    </div>
                  </div>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-24">
        <div className="bg-emerald-950 p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
              <h4 className="text-4xl font-serif font-bold text-amber-400">The Future of Growth</h4>
              <p className="text-emerald-100/70 text-lg leading-relaxed max-w-2xl">
                This relationship model is built for infinite extensibility. New knowledge types, languages, and government datasets can be plugged into the graph without redesigning the existing structure. The edges remain constant, even as the nodes multiply.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                 <Badge className="bg-white/10 text-white border-white/20 px-4 py-1">v3.0 Roadmap</Badge>
                 <Badge className="bg-white/10 text-white border-white/20 px-4 py-1">Graph DB Ready</Badge>
                 <Badge className="bg-white/10 text-white border-white/20 px-4 py-1">RAG Optimized</Badge>
              </div>
           </div>
           <div className="w-64 h-64 shrink-0 bg-white/5 rounded-full border border-white/10 flex items-center justify-center animate-reverse-spin relative z-10">
              <Network className="w-32 h-32 text-amber-500/50" />
           </div>
        </div>
      </footer>
    </div>
  );
};

export default KnowledgeRelationshipModel;
