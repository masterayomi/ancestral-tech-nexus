import React, { useState } from 'react';
import { 
  ShieldCheck, History, Users, Gavel, Zap, Info, ArrowRight, 
  CheckCircle, AlertTriangle, FileText, Globe, Search, 
  Layers, GitBranch, Milestone, Scale, Eye, Edit3, 
  Lock, Award, Fingerprint, Activity, Database, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const KnowledgeGovernance: React.FC = () => {
  const [activeMetadata, setActiveMetadata] = useState<string>('Identification');

  const metadataFramework = [
    {
      group: 'Identification',
      fields: [
        { name: 'Knowledge ID', type: 'UUID', required: true, purpose: 'Global unique identifier.', ai: 'Index key for RAG retrieval.', user: 'Direct citation and reference.' },
        { name: 'Content Type', type: 'Enum', required: true, purpose: 'Classifies the object (e.g., Medicinal Plant).', ai: 'Selects the appropriate reasoning model.', user: 'Filter results by interest.' },
        { name: 'Title', type: 'String', required: true, purpose: 'Primary name of the knowledge entry.', ai: 'Semantic embedding for search.', user: 'Quick recognition.' },
        { name: 'Short Description', type: 'Text', required: true, purpose: 'Brief summary of the content.', ai: 'Snippet generation for results.', user: 'Skimmable overview.' },
        { name: 'Version Number', type: 'SemVer', required: true, purpose: 'Track iteration (e.g., 1.2.0).', ai: 'Ensures use of most recent context.', user: 'Verify recency.' },
      ]
    },
    {
      group: 'Contextual & Geographic',
      fields: [
        { name: 'Geographic Coverage', type: 'Enum', required: true, purpose: 'Scope of relevance (Continental, Regional).', ai: 'Contextual filtering for queries.', user: 'Relevance to their location.' },
        { name: 'Country/Region', type: 'List', required: true, purpose: 'Specific nations or zones of origin.', ai: 'Localized data retrieval.', user: 'Hyper-local relevance.' },
        { name: 'Language', type: 'ISO-639', required: true, purpose: 'Primary language of the content.', ai: 'Manages translation and tokenization.', user: 'Access in mother tongue.' },
        { name: 'Scientific Discipline', type: 'Enum', required: true, purpose: 'Academic field (e.g., Botany).', ai: 'Domain-specific accuracy checks.', user: 'Academic filtering.' },
        { name: 'Traditional Category', type: 'Enum', required: true, purpose: 'Indigenous knowledge domain.', ai: 'Cross-links with cultural ontology.', user: 'Cultural discovery.' },
      ]
    },
    {
      group: 'Quality & Evidence',
      fields: [
        { name: 'Evidence Level', type: '1-5 Scale', required: true, purpose: 'Strength of validation (Lab vs Anecdotal).', ai: 'Weights the reliability of the answer.', user: 'Decide how much to trust info.' },
        { name: 'Confidence Score', type: 'Float (0-1)', required: true, purpose: 'Calculated reliability of the data.', ai: 'Trigger for hallucination warnings.', user: 'Objective trust indicator.' },
        { name: 'Source Quality', type: 'Rating', required: true, purpose: 'Reliability of the originating source.', ai: 'Source bias mitigation.', user: 'Transparency of origin.' },
        { name: 'Status', type: 'Enum', required: true, purpose: 'Lifecycle stage (Published, Archive).', ai: 'Excludes drafts from RAG pools.', user: 'Avoid using obsolete info.' },
        { name: 'License', type: 'String', required: true, purpose: 'Usage rights and IP protection.', ai: 'Manages data redistribution rules.', user: 'Know how they can use the data.' },
      ]
    },
    {
      group: 'Governance & Audit',
      fields: [
        { name: 'Reviewer', type: 'UserID', required: true, purpose: 'Identity of the quality controller.', ai: 'Authority weight in ranking.', user: 'Accountability.' },
        { name: 'Verifying Institution', type: 'InstID', required: true, purpose: 'Accredited body that validated info.', ai: 'Institutional trust propagation.', user: 'Official endorsement.' },
        { name: 'Last Reviewed', type: 'DateTime', required: true, purpose: 'Date of the most recent audit.', ai: 'Triggers re-verification tasks.', user: 'Trust freshness.' },
        { name: 'Review Frequency', type: 'Interval', required: true, purpose: 'How often the item needs re-validation.', ai: 'Automates maintenance queues.', user: 'Ensures continuity.' },
        { name: 'Citation Count', type: 'Integer', required: false, purpose: 'Measure of impact and use.', ai: 'Impact factor for ranking.', user: 'Popularity indicator.' },
      ]
    }
  ];

  const versionStates = [
    { name: 'Draft', color: 'bg-stone-100 text-stone-600', icon: Edit3, desc: 'Initial creation. Only visible to the author and assigned editor.' },
    { name: 'Under Review', color: 'bg-amber-100 text-amber-700', icon: Eye, desc: 'Locked for changes. Being audited by Scientific and Indigenous reviewers.' },
    { name: 'Revision Requested', color: 'bg-rose-100 text-rose-700', icon: AlertTriangle, desc: 'Reviewers found gaps. Returned to author with feedback.' },
    { name: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, desc: 'Quality gates passed. Pending final editorial layout.' },
    { name: 'Published', color: 'bg-emerald-600 text-white', icon: Globe, desc: 'Live on the platform. Accessible to public and AI agents.' },
    { name: 'Updated', color: 'bg-blue-100 text-blue-700', icon: History, desc: 'New version published. Previous version becomes "Archived".' },
    { name: 'Archived', color: 'bg-stone-500 text-white', icon: Lock, desc: 'Read-only historical reference. Not used for active AI RAG.' },
    { name: 'Deprecated', color: 'bg-rose-900 text-white', icon: Gavel, desc: 'Information found to be inaccurate or harmful. Explicitly warned against.' },
  ];

  const reviewWorkflows = [
    { title: 'Scientific Review', role: 'Verified Researchers', criteria: 'Methodological rigor, data accuracy, source verification.' },
    { title: 'Indigenous Review', role: 'Community Elders', criteria: 'Cultural sensitivity, traditional accuracy, IP protection.' },
    { title: 'Language Review', role: 'Linguistic Experts', criteria: 'Grammar, dialectical nuance, tone consistency.' },
    { title: 'Translation Review', role: 'Native Speakers', criteria: 'Conceptual preservation across language bridges.' },
    { title: 'Evidence Review', role: 'Ethics Board', criteria: 'Conflicts of interest, evidence-to-claim alignment.' },
    { title: 'Editorial Review', role: 'Senior Editors', criteria: 'Clarity, formatting, final quality sign-off.' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF6] pb-32 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Hero Header */}
      <div className="relative h-[450px] overflow-hidden">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/knowledge-governance---integrity-dashboard-47256d14-1782899698448.webp"
          className="w-full h-full object-cover"
          alt="Knowledge Governance & Integrity"
        />
        <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl"
          >
            <Badge className="bg-amber-500 text-emerald-950 font-bold px-6 py-2 text-sm uppercase tracking-widest">Module 4.0: Governance & Integrity</Badge>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-tight">
              The Standard of Trust
            </h1>
            <p className="text-emerald-100/90 text-xl md:text-2xl max-w-3xl mx-auto font-light italic">
              Ensuring every bridge between indigenous wisdom and modern science is traceable, auditable, and authoritative.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto -mt-20 relative z-10 px-6">
        <Tabs defaultValue="metadata" className="space-y-12">
          <div className="flex justify-center overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollbarWidth: 'thin' }}>
            <TabsList className="bg-white/95 backdrop-blur shadow-2xl border border-emerald-100 p-2 h-auto rounded-3xl flex gap-1 whitespace-nowrap">
              <TabsTrigger value="metadata" className="rounded-2xl px-4 py-3 min-h-[44px] data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all hover:bg-emerald-50"><Layers className="w-5 h-5 mr-2" /> Metadata</TabsTrigger>
              <TabsTrigger value="versioning" className="rounded-2xl px-4 py-3 min-h-[44px] data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all hover:bg-emerald-50"><History className="w-5 h-5 mr-2" /> Lifecycle</TabsTrigger>
              <TabsTrigger value="review" className="rounded-2xl px-4 py-3 min-h-[44px] data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all hover:bg-emerald-50"><ShieldCheck className="w-5 h-5 mr-2" /> Review Tracks</TabsTrigger>
              <TabsTrigger value="attribution" className="rounded-2xl px-4 py-3 min-h-[44px] data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all hover:bg-emerald-50"><Users className="w-5 h-5 mr-2" /> Attribution</TabsTrigger>
              <TabsTrigger value="principles" className="rounded-2xl px-4 py-3 min-h-[44px] data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all hover:bg-emerald-50"><Gavel className="w-5 h-5 mr-2" /> Governance</TabsTrigger>
              <TabsTrigger value="ai" className="rounded-2xl px-4 py-3 min-h-[44px] data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all hover:bg-emerald-50"><Zap className="w-5 h-5 mr-2" /> AI Integration</TabsTrigger>
            </TabsList>
          </div>

          {/* Metadata Tab */}
          <TabsContent value="metadata">
            <div className="grid lg:grid-cols-4 gap-8">
              <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden self-start">
                <CardHeader className="bg-emerald-950 text-white p-8">
                  <CardTitle className="text-xl font-serif">Metadata Schema</CardTitle>
                  <CardDescription className="text-emerald-200/70 text-xs">The DNA of every Knowledge Object.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {metadataFramework.map((group) => (
                    <button
                      key={group.group}
                      onClick={() => setActiveMetadata(group.group)}
                      className={`w-full text-left p-4 min-h-[44px] rounded-2xl transition-all font-bold text-sm focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                        activeMetadata === group.group ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-200' : 'text-stone-500 hover:bg-stone-50 active:bg-stone-100'
                      }`}
                    >
                      {group.group}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <div className="lg:col-span-3 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMetadata}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid gap-6"
                  >
                    {metadataFramework.find(g => g.group === activeMetadata)?.fields.map((field, i) => (
                      <Card key={i} className="border-none shadow-lg bg-white rounded-[2rem] p-8 hover:shadow-xl transition-shadow border-l-4 border-l-emerald-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                           <div className="flex items-center gap-3">
                              <h4 className="text-2xl font-serif font-bold text-emerald-950">{field.name}</h4>
                              <Badge variant="outline" className="border-emerald-100 text-emerald-700">{field.type}</Badge>
                              {field.required && <Badge className="bg-rose-100 text-rose-700 border-rose-200">Required</Badge>}
                           </div>
                           <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">{field.purpose}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                           <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                              <h5 className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-3">
                                <Zap className="w-4 h-4 text-amber-500" /> AI Application
                              </h5>
                              <p className="text-emerald-800 text-sm leading-relaxed">{field.ai}</p>
                           </div>
                           <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                              <h5 className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
                                <Users className="w-4 h-4 text-amber-600" /> User Benefit
                              </h5>
                              <p className="text-amber-800 text-sm leading-relaxed">{field.user}</p>
                           </div>
                        </div>
                      </Card>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          {/* Versioning Tab */}
          <TabsContent value="versioning">
             <div className="space-y-12">
                <div className="bg-emerald-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><History className="w-64 h-64" /></div>
                   <h3 className="text-4xl font-serif font-bold mb-8 relative z-10">Knowledge Lifecycle States</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                      {versionStates.map((state, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur border border-white/20 p-8 rounded-[2rem] hover:bg-white/20 transition-all group">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${state.color}`}>
                              <state.icon className="w-6 h-6" />
                           </div>
                           <h4 className="text-xl font-bold mb-3">{state.name}</h4>
                           <p className="text-sm text-emerald-100/70 leading-relaxed">{state.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                   <Card className="border-none shadow-xl bg-white p-10 rounded-[2.5rem] flex flex-col justify-center border-t-4 border-t-amber-500">
                      <h4 className="text-2xl font-serif font-bold text-emerald-950 mb-6 flex items-center gap-3"><Milestone className="text-amber-500" /> Revision Logic</h4>
                      <ul className="space-y-6">
                        <li className="flex gap-4">
                           <div className="p-2 bg-emerald-50 rounded-lg h-fit"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>
                           <div>
                              <p className="font-bold text-stone-800">Minor Revisions (x.1.x)</p>
                              <p className="text-xs text-stone-500">Typos, formatting, or supplementary media updates.</p>
                           </div>
                        </li>
                        <li className="flex gap-4">
                           <div className="p-2 bg-emerald-50 rounded-lg h-fit"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>
                           <div>
                              <p className="font-bold text-stone-800">Major Revisions (1.x.x)</p>
                              <p className="text-xs text-stone-500">New evidence, core claim changes, or significant new sections.</p>
                           </div>
                        </li>
                      </ul>
                   </Card>
                   <Card className="md:col-span-2 border-none shadow-xl bg-white p-10 rounded-[2.5rem] relative overflow-hidden">
                      <div className="absolute inset-0 bg-stone-50 opacity-50" />
                      <div className="relative z-10">
                        <h4 className="text-2xl font-serif font-bold text-emerald-950 mb-8">History & Transparency</h4>
                        <div className="space-y-8">
                           <div className="flex items-start gap-6">
                              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><Fingerprint className="text-emerald-700" /></div>
                              <div>
                                 <h5 className="font-bold text-lg text-emerald-900">Immutable Audit Trail</h5>
                                 <p className="text-stone-600 leading-relaxed">Every change is logged with a timestamp, user ID, and diff. Previous versions are never deleted but marked as "Archived" to preserve the evolution of knowledge.</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-6">
                              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center shrink-0"><Activity className="text-amber-700" /></div>
                              <div>
                                 <h5 className="font-bold text-lg text-amber-900">Rollback Procedures</h5>
                                 <p className="text-stone-600 leading-relaxed">System Administrators can restore any previous "Published" state instantly if a new update is found to be compromised or inaccurate.</p>
                              </div>
                           </div>
                        </div>
                      </div>
                   </Card>
                </div>
             </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review">
             <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h3 className="text-4xl font-serif font-bold text-emerald-950">Multi-Layered Review Workflow</h3>
                   <p className="text-lg text-stone-600 leading-relaxed italic">
                      "Knowledge is only as strong as its verification. We employ a dual-track review system that respects both peer-reviewed science and communal ancestral wisdom."
                   </p>
                    <div className="space-y-4">
                       {reviewWorkflows.map((track, i) => (
                         <motion.div key={i} whileHover={{ x: 8 }} className="p-6 min-h-[72px] bg-white rounded-3xl shadow-lg border border-stone-100 flex gap-6 items-center hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none" tabIndex={0}>
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 font-bold text-emerald-700 text-base">0{i+1}</div>
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold text-emerald-950">{track.title}</h4>
                                 <Badge variant="secondary" className="text-[10px]">{track.role}</Badge>
                              </div>
                              <p className="text-xs text-stone-500">{track.criteria}</p>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>

                <div className="space-y-8">
                   <Card className="bg-white p-12 rounded-[3rem] shadow-2xl border-none relative overflow-hidden flex flex-col items-center text-center justify-center h-full">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500" />
                      <div className="w-24 h-24 bg-emerald-900 rounded-full flex items-center justify-center mb-8 shadow-xl">
                         <ShieldCheck className="w-12 h-12 text-amber-400" />
                      </div>
                      <h4 className="text-3xl font-serif font-bold text-emerald-950 mb-6">Final Approval Criteria</h4>
                      <ul className="space-y-4 text-stone-600 font-medium">
                         <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> At least 2 Scientific Reviews</li>
                         <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> At least 1 Indigenous Elder Approval</li>
                         <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Zero critical evidence gaps</li>
                         <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Linguistic validation for primary language</li>
                         <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Senior Editorial sign-off</li>
                      </ul>
                      <Badge className="mt-10 bg-emerald-950 text-white px-8 py-3 rounded-full text-sm font-bold tracking-tighter shadow-lg">STRICT TRUST PROTOCOL V4.0</Badge>
                   </Card>
                </div>
             </div>
          </TabsContent>

          {/* Attribution Tab */}
          <TabsContent value="attribution">
             <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                   <Card className="border-none shadow-2xl bg-white p-12 rounded-[3.5rem] overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Users className="w-48 h-48" /></div>
                      <h3 className="text-3xl font-serif font-bold text-emerald-950 mb-8 underline decoration-amber-500 decoration-4 underline-offset-8">Contributor Attribution Model</h3>
                      <div className="grid sm:grid-cols-2 gap-8">
                         {[
                           { title: 'Original Author', role: 'Primary Researcher/Elder', weight: 'High', visibility: 'Lead Profile' },
                           { title: 'Scientific Reviewer', role: 'Subject Expert', weight: 'Med', visibility: 'Review History' },
                           { title: 'Indigenous Elder', role: 'Knowledge Guardian', weight: 'High', visibility: 'Validation Badge' },
                           { title: 'Translator', role: 'Language Specialist', weight: 'Low', visibility: 'Translation Log' },
                           { title: 'Community Collective', role: 'Local Group', weight: 'Med', visibility: 'Group Attribution' },
                           { title: 'AI Assistant', role: 'System Algorithm', weight: 'N/A', visibility: 'Process Tag' }
                         ].map((item, i) => (
                           <div key={i} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 group hover:bg-emerald-50 transition-colors">
                              <h5 className="font-bold text-emerald-900 mb-2">{item.title}</h5>
                              <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-tighter">
                                 <span>{item.role}</span>
                                 <span className="text-amber-600">{item.weight} Weight</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </Card>
                </div>
                <div className="space-y-8">
                   <Card className="bg-emerald-900 text-white p-10 rounded-[3rem] border-none shadow-xl h-full flex flex-col justify-center">
                      <Award className="w-16 h-16 text-amber-400 mb-8" />
                      <h4 className="text-2xl font-serif font-bold mb-6">Visibility & Recognition</h4>
                      <p className="text-emerald-100/70 leading-relaxed mb-8 italic">
                         "Contributors are the lifeblood of Knowledge Bridge Africa. We ensure their intellectual property and communal legacy are permanently honored."
                      </p>
                      <ul className="space-y-4 text-emerald-50 text-sm">
                         <li className="flex items-center gap-3"><Badge className="bg-white/10">Public</Badge> Name and Institution shown on Article.</li>
                         <li className="flex items-center gap-3"><Badge className="bg-white/10">Private</Badge> Anonymized if culturally sensitive.</li>
                         <li className="flex items-center gap-3"><Badge className="bg-white/10">Communal</Badge> Attributed to entire village or tribe.</li>
                      </ul>
                   </Card>
                </div>
             </div>
          </TabsContent>

          {/* Principles Tab */}
          <TabsContent value="principles">
             <div className="max-w-4xl mx-auto">
                <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3.5rem]">
                   <CardHeader className="bg-emerald-950 text-white p-12 text-center">
                      <Scale className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                      <CardTitle className="text-4xl font-serif font-bold mb-4">Governance Principles Charter</CardTitle>
                      <CardDescription className="text-emerald-200 text-lg">The ethical and operational foundation of Knowledge Bridge Africa.</CardDescription>
                   </CardHeader>
                   <CardContent className="p-12">
                      <Accordion type="single" collapsible className="space-y-4">
                         {[
                           { q: 'Scientific Integrity', a: 'Commitment to the scientific method, rigorous peer review, and continuous self-correction based on new empirical data.' },
                           { q: 'Indigenous Knowledge Protection', a: 'Explicit measures to prevent biopiracy and ensure that sacred or sensitive knowledge is only shared with appropriate permissions and cultural respect.' },
                           { q: 'Absolute Transparency', a: 'Every claim must be linked to a verifiable source, author, or elder consensus. There are no "anonymous" facts.' },
                           { q: 'Accuracy Over Speed', a: 'We prioritize verified truth over rapid publication. Knowledge remains in "Under Review" until consensus is reached.' },
                           { q: 'Ethical Use of AI', a: 'AI is a bridge, not an author. It assists in retrieval and translation but never overrides human-verified evidence.' },
                           { q: 'Conflict Resolution', a: 'A formal mediation board comprising both Scientists and Elders to resolve discrepancies between modern data and traditional wisdom.' },
                           { q: 'Data Stewardship', a: 'We treat knowledge not as a commodity but as a shared legacy held in trust for future generations of Africans.' }
                         ].map((item, i) => (
                           <AccordionItem key={i} value={`item-${i}`} className="border-none bg-stone-50 rounded-2xl px-8 mb-4">
                              <AccordionTrigger className="text-lg font-bold text-emerald-950 hover:no-underline">{item.q}</AccordionTrigger>
                              <AccordionContent className="text-stone-600 leading-relaxed pb-8">{item.a}</AccordionContent>
                           </AccordionItem>
                         ))}
                      </Accordion>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>

          {/* AI Integration Tab */}
          <TabsContent value="ai">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                 <h3 className="text-4xl font-serif font-bold text-emerald-950 tracking-tight">AI & Governance Integration</h3>
                 <p className="text-lg text-stone-600 leading-relaxed">
                    Metadata and versioning are not just for humans. They are the primary signals used by our AI models to ensure accuracy and prevent hallucination.
                 </p>
                 <div className="grid gap-6">
                    {[
                      { icon: Search, title: 'Enhanced RAG Retrieval', desc: 'AI filters "Draft" or "Archived" states to ensure only published knowledge is used for answering.' },
                      { icon: AlertTriangle, title: 'Hallucination Prevention', desc: 'Cross-references claim metadata against Evidence Levels to trigger warnings if a claim is unverified.' },
                      { icon: Milestone, title: 'Citation Generation', desc: 'Automatically generates academic and community citations using ID and Contributor metadata.' },
                      { icon: BookOpen, title: 'Context-Aware Translation', desc: 'Uses metadata about the geographic origin to select the most appropriate dialect and cultural tone.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl shadow-lg border border-stone-100 group hover:shadow-xl hover:border-emerald-200 transition-all">
                         <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-50 transition-colors">
                           <item.icon className="w-6 h-6 text-emerald-700 group-hover:text-amber-600" />
                         </div>
                         <div>
                            <h4 className="font-bold text-emerald-950 mb-1">{item.title}</h4>
                            <p className="text-sm text-stone-500">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-emerald-950 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_#F59E0B_0%,_transparent_25%)] opacity-10" />
                 <Database className="w-24 h-24 text-amber-500 mb-8 animate-pulse" />
                 <h4 className="text-3xl font-serif font-bold mb-6">Future Model Training</h4>
                 <p className="text-emerald-100/70 leading-relaxed mb-8">
                    "Our structured metadata and version history serve as a high-quality 'Gold Standard' dataset for future specialized African AI models, ensuring that African wisdom is properly represented in the global digital landscape."
                 </p>
                 <div className="flex flex-wrap justify-center gap-4">
                    <Badge className="bg-white/10 border-white/20">Clean Data Loops</Badge>
                    <Badge className="bg-white/10 border-white/20">Bias Mitigation</Badge>
                    <Badge className="bg-white/10 border-white/20">Ethical AI</Badge>
                 </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer Section */}
      <footer className="max-w-7xl mx-auto px-6 mt-24">
         <div className="bg-emerald-950 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl">
            <div className="flex-1 space-y-6">
               <h4 className="text-4xl font-serif font-bold text-amber-400">The Governance Mandate</h4>
               <p className="text-emerald-100/70 text-lg leading-relaxed italic">
                  "Knowledge Bridge Africa is more than an archive; it is a living trust. These governance protocols ensure that as we scale to millions of objects, the integrity of our ancestors' wisdom and the rigor of modern science remain uncompromised."
               </p>
               <div className="flex gap-4">
                  <Badge variant="outline" className="border-amber-500/50 text-amber-400 py-1 px-4">Traceable</Badge>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 py-1 px-4">Auditable</Badge>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400 py-1 px-4">Respectful</Badge>
               </div>
            </div>
            <div className="w-48 h-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center relative">
               <ShieldCheck className="w-24 h-24 text-amber-500 opacity-20 absolute pointer-events-none" />
               <Milestone className="w-16 h-16 text-amber-500 relative z-10" />
            </div>
         </div>
      </footer>
    </div>
  );
};

export default KnowledgeGovernance;
