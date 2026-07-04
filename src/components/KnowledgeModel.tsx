import React, { useState } from 'react';
import { 
  Database, Share2, ShieldCheck, Cpu, Languages, MapPin, History, 
  GitBranch, FlaskConical, Sprout, Microscope, BookOpen, Search, 
  Layers, Link2, Binary, Activity, ChevronRight, Globe, AlertCircle, 
  FileSearch, UserCheck, HardDrive, Zap, HelpCircle, FileText, 
  ShieldAlert, Workflow, BarChart3, Cloud, Smartphone, Code2, Scale,
  Lightbulb, CheckCircle2, BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const KnowledgeModel: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('Medicinal Plant');

  const knowledgeTypes = [
    { name: 'Scientific Concept', icon: Microscope, color: 'text-blue-500', bg: 'bg-blue-50', purpose: 'Theoretical and empirical scientific frameworks.' },
    { name: 'Indigenous Practice', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50', purpose: 'Time-tested community wisdom and methodologies.' },
    { name: 'Research Paper', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50', purpose: 'Formal academic publications and datasets.' },
    { name: 'Agricultural Technique', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50', purpose: 'Sustainable farming and land management practices.' },
    { name: 'Medicinal Plant', icon: FlaskConical, color: 'text-rose-500', bg: 'bg-rose-50', purpose: 'Botanical knowledge and pharmacological applications.' },
    { name: 'Historical Discovery', icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-50', purpose: 'Archaeological and oral history records.' },
    { name: 'Innovation', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50', purpose: 'Modern adaptations of traditional methods.' },
    { name: 'Policy', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50', purpose: 'Governance and ethical guidelines.' }
  ];

  const ckoFields = [
    { section: 'Identifiers & Identity', fields: [
      { name: 'Unique Identifier', type: 'UUID', desc: 'Immutable global ID for referential integrity.' },
      { name: 'Title (Canonical)', type: 'String', desc: 'The primary name used for indexing.' },
      { name: 'Subtitle', type: 'String', desc: 'Descriptive secondary title for context.' },
      { name: 'Summary', type: 'Text', desc: 'Concise overview for quick AI retrieval.' }
    ]},
    { section: 'Knowledge Core', fields: [
      { name: 'Full Description', type: 'Markdown', desc: 'Extensive documentation of the entry.' },
      { name: 'Scientific Explanation', type: 'Text', desc: 'Modern scientific context and data.' },
      { name: 'Indigenous Knowledge', type: 'Text', desc: 'Heritage-based wisdom and context.' },
      { name: 'Practical Applications', type: 'Array', desc: 'Real-world use cases and methods.' }
    ]},
    { section: 'Evaluation & Trust', fields: [
      { name: 'Evidence Level', type: 'Enum', desc: 'Classification of source reliability.' },
      { name: 'Confidence Score', type: 'Float', desc: 'AI-calculated trustworthiness metric.' },
      { name: 'Benefits / Risks', type: 'Text', desc: 'Safety and utility considerations.' },
      { name: 'Limitations', type: 'Text', desc: 'Constraints and boundaries of the knowledge.' }
    ]},
    { section: 'Taxonomy & Geo', fields: [
      { name: 'Categories / Sub', type: 'Array', desc: 'Hierarchical classification markers.' },
      { name: 'Language', type: 'ISO Code', desc: 'Primary language of the content.' },
      { name: 'Geographic Relevance', type: 'GeoJSON', desc: 'Mapping to regions and countries.' },
      { name: 'Scientific Discipline', type: 'Enum', desc: 'Primary academic field association.' }
    ]},
    { section: 'References & Media', fields: [
      { name: 'Research Papers', type: 'Array', desc: 'DOIs and links to academic work.' },
      { name: 'Citations / Sources', type: 'Array', desc: 'Oral and written source tracking.' },
      { name: 'Media Assets', type: 'Object', desc: 'Images, Videos, and Audio recordings.' },
      { name: 'Related Knowledge', type: 'Array', desc: 'Semantic links to other CKO nodes.' }
    ]},
    { section: 'Governance', fields: [
      { name: 'Contributors', type: 'Array', desc: 'List of authors and wisdom keepers.' },
      { name: 'Reviewers', type: 'Array', desc: 'Verified peers and elders who audited.' },
      { name: 'Version / Status', type: 'String', desc: 'Lifecycle and publication state.' },
      { name: 'Timestamps', type: 'DateTime', desc: 'Created, Updated, and Review dates.' }
    ]}
  ];

  const qualityRules = [
    { title: 'Required Fields Integrity', desc: 'No object can be published without 100% completion of mandatory identity and core knowledge fields.', icon: ShieldAlert },
    { title: 'Source Validation', desc: 'Every claim must be anchored to either a verified academic source or a registered community elder.', icon: UserCheck },
    { title: 'Evidence Verification', desc: 'Claims undergo a dual-verification process (Scientific Peer Review + Cultural Elder Consensus).', icon: FileSearch },
    { title: 'Language Quality', desc: 'Manual audit required for all automatic translations to ensure cultural nuances are preserved.', icon: Languages },
    { title: 'Contributor Verification', desc: 'Reputation-based access; only verified experts can modify core scientific or indigenous data.', icon: BadgeCheck }
  ];

  const futureCapabilities = [
    { name: 'AI Knowledge Bridge', desc: 'Real-time synthesis between science and tradition.', icon: Zap },
    { name: 'AI Tutor / Assistant', desc: 'Personalized learning based on CKO granularity.', icon: Cpu },
    { name: 'Voice & Multilingual Search', desc: 'Accessibility for oral tradition speakers.', icon: Search },
    { name: 'Offline Access Network', desc: 'Edge-cached knowledge for rural connectivity.', icon: Cloud },
    { name: 'Government Portals', desc: 'API integration for national policy making.', icon: Globe },
    { name: 'University Research Net', desc: 'Shared repositories for academic collaboration.', icon: HardDrive },
    { name: 'Public API / SDK', desc: 'Enabling third-party ecosystem growth.', icon: Code2 },
    { name: 'Mobile Application', desc: 'Native experience with location-aware knowledge.', icon: Smartphone }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF6] pb-32">
      {/* Hero Header */}
      <div className="relative h-[450px] overflow-hidden">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/knowledge-graph-visualization-8d4ad5df-1782897696559.webp"
          className="w-full h-full object-cover"
          alt="Knowledge Model Architecture"
        />
        <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Badge className="bg-amber-500 text-emerald-950 font-bold px-6 py-2 text-sm">PHASE 2.5: CORE KNOWLEDGE SPECIFICATION</Badge>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white max-w-5xl leading-tight">
              The Atom of Wisdom: Core Knowledge Object
            </h1>
            <p className="text-emerald-100/90 text-xl md:text-2xl max-w-3xl mx-auto font-light">
              Designing a unified, scalable, and trustworthy data foundation for the continent's intellectual heritage.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto -mt-20 relative z-10 px-6">
        <Tabs defaultValue="purpose" className="space-y-12">
          <div className="flex justify-center overflow-x-auto pb-4">
            <TabsList className="bg-white/95 backdrop-blur shadow-2xl border-emerald-100 p-2 h-auto rounded-3xl flex gap-2">
              <TabsTrigger value="purpose" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Activity className="w-4 h-4 mr-2" /> Purpose</TabsTrigger>
              <TabsTrigger value="cko" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Database className="w-4 h-4 mr-2" /> Schema</TabsTrigger>
              <TabsTrigger value="types" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Layers className="w-4 h-4 mr-2" /> Archetypes</TabsTrigger>
              <TabsTrigger value="quality" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><ShieldCheck className="w-4 h-4 mr-2" /> Rules</TabsTrigger>
              <TabsTrigger value="relationships" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Share2 className="w-4 h-4 mr-2" /> Graph</TabsTrigger>
              <TabsTrigger value="future" className="rounded-2xl px-6 py-4 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Zap className="w-4 h-4 mr-2" /> Future</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="purpose">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-12 border-none shadow-2xl bg-white">
                <h3 className="text-4xl font-serif font-bold text-emerald-950 mb-8">What is a Knowledge Object?</h3>
                <div className="prose prose-emerald prose-lg text-stone-600 space-y-6">
                  <p>
                    A <strong>Core Knowledge Object (CKO)</strong> is the smallest, irreducible unit of information within Knowledge Bridge Africa. It is not merely a database record; it is a polymorphic container that bridges the epistemological gap between indigenous wisdom and modern scientific inquiry.
                  </p>
                  <p>
                    By standardizing information into CKOs, we enable the platform to process complex, multi-lingual, and often contradictory data types under a single, unified architecture.
                  </p>
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                    <Lightbulb className="w-8 h-8 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-900 mb-1">Philosophy of Symmetry</p>
                      <p className="text-sm text-emerald-800/80 italic text-pretty">
                        "Every entry treats scientific data and indigenous wisdom with equal structural priority, ensuring no form of knowledge is subordinated."
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="space-y-8">
                <div className="bg-emerald-900 rounded-3xl p-12 text-white shadow-2xl">
                  <h4 className="text-2xl font-serif font-bold mb-6">Key Strategic Benefits</h4>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0"><Cpu className="text-amber-400 w-5 h-5" /></div>
                      <div>
                        <p className="font-bold">AI Native</p>
                        <p className="text-sm text-emerald-200/70">Structured metadata enables precise RAG and semantic mapping.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0"><Languages className="text-amber-400 w-5 h-5" /></div>
                      <div>
                        <p className="font-bold">Multilingual Scalability</p>
                        <p className="text-sm text-emerald-200/70">Native support for 2,000+ languages via universal UTF-8 encoding.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0"><Scale className="text-amber-400 w-5 h-5" /></div>
                      <div>
                        <p className="font-bold">Trust Framework</p>
                        <p className="text-sm text-emerald-200/70">Built-in confidence scoring and evidence classification.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <img 
                  src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/digital-library-interface-b759713e-1782897695654.webp"
                  className="w-full h-[250px] object-cover rounded-3xl shadow-xl border-4 border-white"
                  alt="Knowledge Archive"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cko">
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-emerald-950">CKO Master Schema Specification</h3>
                  <p className="text-stone-500">The authoritative list of all fields required for a world-class knowledge platform.</p>
                </div>
                <Badge className="bg-emerald-950 text-white px-4 py-2">v2.0 Stable</Badge>
              </div>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {ckoFields.map((group, idx) => (
                  <Card key={idx} className="border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-stone-50 border-b border-stone-100">
                      <CardTitle className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-amber-500" /> {group.section}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-stone-100">
                        {group.fields.map((field, fIdx) => (
                          <div key={fIdx} className="p-4 hover:bg-emerald-50 transition-colors group">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-stone-800 text-sm group-hover:text-emerald-900">{field.name}</span>
                              <Badge variant="outline" className="text-[10px] font-mono">{field.type}</Badge>
                            </div>
                            <p className="text-xs text-stone-500 leading-relaxed">{field.desc}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="types">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-emerald-950">Knowledge Archetypes</h3>
                <p className="text-sm text-stone-600">Specialized templates optimized for specific domains.</p>
                <div className="space-y-2 mt-6">
                  {knowledgeTypes.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedType(t.name)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                        selectedType === t.name 
                          ? 'bg-emerald-900 text-white shadow-xl shadow-emerald-900/20' 
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-300'
                      }`}
                    >
                      {React.createElement(t.icon, { className: `w-5 h-5 ${selectedType === t.name ? 'text-amber-400' : t.color}` })}
                      <span className="font-bold text-sm">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedType}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-12 h-full"
                  >
                    <div className="flex items-center gap-6 mb-12">
                      <div className={`p-6 rounded-3xl ${knowledgeTypes.find(t => t.name === selectedType)?.bg}`}>
                        {React.createElement(knowledgeTypes.find(t => t.name === selectedType)?.icon || HelpCircle, { 
                          className: `w-12 h-12 ${knowledgeTypes.find(t => t.name === selectedType)?.color}` 
                        })}
                      </div>
                      <div>
                        <h4 className="text-4xl font-serif font-bold text-stone-900">{selectedType} Template</h4>
                        <p className="text-emerald-700 font-medium">Domain: {knowledgeTypes.find(t => t.name === selectedType)?.purpose}</p>
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div>
                          <h5 className="font-bold text-stone-900 text-xl mb-4 flex items-center gap-2">
                             <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Primary Objectives
                          </h5>
                          <p className="text-stone-600 leading-relaxed">
                            Ensures that {selectedType.toLowerCase()} records capture the unique epistemological data points required for validation and discovery.
                          </p>
                        </div>
                        <div>
                          <h5 className="font-bold text-stone-900 text-xl mb-4 flex items-center gap-2">
                             <Workflow className="w-5 h-5 text-amber-500" /> Unique Requirements
                          </h5>
                          <ul className="space-y-3">
                            {['Structural Lineage Mapping', 'Contextual Relevance Analysis', 'Multimodal Evidence Assets', 'Cross-Domain Relationship Metadata'].map(f => (
                              <li key={f} className="flex items-start gap-3 text-stone-600">
                                <ChevronRight className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> 
                                <span className="font-medium">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Card className="bg-stone-50 p-8 rounded-[2rem] border-none">
                         <h5 className="font-bold text-stone-900 text-xl mb-6 flex items-center gap-2">
                           <GitBranch className="w-5 h-5 text-emerald-600" /> Lifecycle Workflow
                         </h5>
                         <div className="space-y-4">
                           <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                             <span className="text-stone-600 font-bold">Initial Entry</span>
                             <Badge className="bg-emerald-100 text-emerald-800">Verified Contributor</Badge>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                             <span className="text-stone-600 font-bold">Content Review</span>
                             <Badge className="bg-amber-100 text-amber-800">Elder + Scientist</Badge>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                             <span className="text-stone-600 font-bold">Semantic Linking</span>
                             <Badge className="bg-blue-100 text-blue-800">AI Graph Agent</Badge>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                             <span className="text-stone-600 font-bold">Publication</span>
                             <Badge className="bg-emerald-900 text-white">Trust Ver. 1.0</Badge>
                           </div>
                         </div>
                      </Card>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quality">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-4xl font-serif font-bold text-emerald-950">Publication Quality Standards</h3>
                <p className="text-lg text-stone-600">Before any Knowledge Object is published to the global repository, it must pass a rigorous multi-stage quality gate.</p>
                <div className="space-y-6">
                  {qualityRules.map((rule, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="p-6 bg-white rounded-3xl shadow-xl border border-stone-100 flex gap-6 items-start"
                    >
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                        <rule.icon className="w-8 h-8 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-emerald-950 mb-2">{rule.title}</h4>
                        <p className="text-stone-600 text-sm leading-relaxed">{rule.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl self-start">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-64 h-64" />
                 </div>
                 <h4 className="text-3xl font-serif font-bold mb-8 relative z-10 text-amber-400">The Integrity Engine</h4>
                 <div className="space-y-12 relative z-10">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="font-bold">Required Fields Completion</span>
                          <span className="text-amber-400 font-mono">100%</span>
                       </div>
                       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-full" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="font-bold">Source Verification Strength</span>
                          <span className="text-amber-400 font-mono">85% Min.</span>
                       </div>
                       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[85%]" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                          <h5 className="font-bold mb-2">Citation Quorum</h5>
                          <p className="text-xs text-emerald-200/60">Requires 3+ independent scientific or community cross-references.</p>
                       </div>
                       <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                          <h5 className="font-bold mb-2">Peer Review</h5>
                          <p className="text-xs text-emerald-200/60">Mandatory blind review by two domain experts.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="relationships">
             <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem]">
                <CardHeader className="bg-emerald-950 text-white p-12 text-center">
                   <CardTitle className="text-5xl font-serif font-bold mb-4">The Continental Bridge Graph</CardTitle>
                   <CardDescription className="text-emerald-200 text-lg max-w-2xl mx-auto">
                      A multi-relational ontology mapping trillions of potential connections across the continent's knowledge nodes.
                   </CardDescription>
                </CardHeader>
                <CardContent className="p-12">
                   <div className="grid lg:grid-cols-2 gap-16 items-center">
                     <div className="space-y-10">
                        <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 relative shadow-inner">
                           <h4 className="text-2xl font-serif font-bold text-emerald-950 mb-6 flex items-center gap-3">
                             <FlaskConical className="w-8 h-8 text-amber-500" /> Node Case: Medicinal Plant
                           </h4>
                           <div className="grid grid-cols-2 gap-4">
                             {[
                               { label: 'Scientific Studies', context: 'Clinical Trials, Papers' },
                               { label: 'Traditional Uses', context: 'Cultural Oral History' },
                               { label: 'Regional Origins', context: 'Geographic Mapping' },
                               { label: 'Active Compounds', context: 'Chemical Taxonomy' },
                               { label: 'Expert Elders', context: 'Knowledge Lineage' },
                               { label: 'Universities', context: 'Research Partners' },
                               { label: 'Diseases', context: 'Treatment Efficacy' },
                               { label: 'Community Discourse', context: 'Field Observations' }
                             ].map(link => (
                               <div key={link.label} className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm group hover:border-amber-400 transition-colors cursor-pointer">
                                 <div className="flex items-center gap-2 mb-1">
                                    <Link2 className="w-4 h-4 text-amber-500" />
                                    <span className="font-bold text-emerald-900 text-sm">{link.label}</span>
                                 </div>
                                 <p className="text-[10px] text-stone-500">{link.context}</p>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                     <div className="relative aspect-square bg-emerald-950 rounded-[3rem] overflow-hidden flex items-center justify-center p-12 border-8 border-white shadow-2xl">
                        <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </div>
                        <div className="relative w-full h-full flex items-center justify-center">
                           <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                             className="absolute w-[100%] h-[100%] border border-emerald-500/20 rounded-full"
                           />
                           <div className="w-32 h-32 bg-amber-500 rounded-[2rem] shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center justify-center relative z-10 border-8 border-emerald-950">
                             <Database className="w-14 h-14 text-emerald-950" />
                           </div>
                           {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                             <motion.div
                               key={i}
                               style={{ 
                                 position: 'absolute',
                                 transform: `rotate(${deg}deg) translateY(-140px) rotate(-${deg}deg)`
                               }}
                               className="w-14 h-14 bg-emerald-900 rounded-2xl border border-emerald-700 flex flex-col items-center justify-center shadow-lg"
                             >
                               <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                             </motion.div>
                           ))}
                        </div>
                     </div>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="future">
             <div className="space-y-12">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                   <h3 className="text-5xl font-serif font-bold text-emerald-950">The Horizon Architecture</h3>
                   <p className="text-lg text-stone-600">Built to evolve with the continent's digital transformation.</p>
                </div>

                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                   {futureCapabilities.map((cap, idx) => (
                      <Card key={idx} className="p-8 border-none shadow-xl bg-white hover:bg-emerald-50 transition-all group rounded-3xl">
                         <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
                            <cap.icon className="w-8 h-8 text-emerald-700 group-hover:text-amber-500 transition-colors" />
                         </div>
                         <h4 className="text-xl font-bold text-emerald-950 mb-3">{cap.name}</h4>
                         <p className="text-stone-500 text-sm leading-relaxed">{cap.desc}</p>
                      </Card>
                   ))}
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-200 flex items-start gap-6">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
             <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-amber-900 text-lg">Architectural Standard Disclaimer</h5>
            <p className="text-sm text-amber-800 leading-relaxed max-w-5xl">
              This <strong>Knowledge Model Specification v2.0</strong> is the authoritative architectural blueprint for Knowledge Bridge Africa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KnowledgeModel;