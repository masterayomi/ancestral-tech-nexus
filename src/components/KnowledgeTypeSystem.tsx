import React, { useState } from 'react';
import { 
  Microscope, Sprout, BookOpen, FileText, FlaskConical, Globe, Lightbulb, 
  MapPin, Wind, GraduationCap, Gavel, Database, Hammer, TreeDeciduous, 
  PawPrint, Construction, Cpu, Users, Eye, CloudRain, ShieldCheck, 
  Share2, Layers, GitBranch, Binary, ChevronRight, Info, Zap, 
  Search, ExternalLink, ArrowRight, ListTree, Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

const KnowledgeTypeSystem: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('Scientific Concept');

  const knowledgeTypes = [
    { 
      id: 'scientific-concept',
      name: 'Scientific Concept', 
      icon: Microscope, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      domain: 'Science & Theory',
      purpose: "Formalizes theoretical frameworks and empirical scientific models.",
      users: "Researchers, Academics, Students.",
      requiredInfo: "Hypothesis, Methodology, Evidence Base, Peer Reviews.",
      aiInterpretation: "Prioritize precision, handle as a factual baseline, use for deductive reasoning."
    },
    { 
      id: 'indigenous-practice',
      name: 'Indigenous Practice', 
      icon: Sprout, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50',
      domain: 'Heritage',
      purpose: "Documents time-tested community wisdom and cultural methodologies.",
      users: "Community Elders, Anthropologists, Ethnobotanists.",
      requiredInfo: "Oral Lineage, Community Consensus, Cultural Context, Practical Outcomes.",
      aiInterpretation: "Preserve cultural nuances, avoid reductionism, seek scientific parallels."
    },
    { 
      id: 'research-paper',
      name: 'Research Paper', 
      icon: BookOpen, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50',
      domain: 'Academia',
      purpose: "Aggregates formal academic findings and experimental data.",
      users: "Scientists, Analysts, Policy Makers.",
      requiredInfo: "DOI, Abstract, Authors, Journal, Citations, Dataset Links.",
      aiInterpretation: "Extract methodology, summarize findings, verify citations, assess impact factor."
    },
    { 
      id: 'case-study',
      name: 'Case Study', 
      icon: Info, 
      color: 'text-cyan-500', 
      bg: 'bg-cyan-50',
      domain: 'Applied Science',
      purpose: "Detailed analysis of a specific instance or project.",
      users: "Practitioners, Consultants, Educators.",
      requiredInfo: "Context, Problem, Solution, Results, Lessons Learned.",
      aiInterpretation: "Focus on causality, extract transferable insights, identify constraints."
    },
    { 
      id: 'medicinal-plant',
      name: 'Medicinal Plant', 
      icon: FlaskConical, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50',
      domain: 'Healthcare',
      purpose: "Cataloging botanical properties and pharmacological utility.",
      users: "Pharmacists, Traditional Healers, Botanists.",
      requiredInfo: "Taxonomy, Local Names, Active Compounds, Traditional Uses, Safety Data.",
      aiInterpretation: "Cross-reference pharmacology with ethnomedicine, highlight contraindications."
    },
    { 
      id: 'crop',
      name: 'Crop', 
      icon: TreeDeciduous, 
      color: 'text-green-500', 
      bg: 'bg-green-50',
      domain: 'Agriculture',
      purpose: "Management of agricultural species for food security.",
      users: "Farmers, Agronomists, Supply Chain Managers.",
      requiredInfo: "Variety, Growing Cycle, Soil Needs, Yield Specs, Pest Resistance.",
      aiInterpretation: "Analyze yield potential, suggest optimized growing conditions based on geo-data."
    },
    { 
      id: 'animal-species',
      name: 'Animal Species', 
      icon: PawPrint, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50',
      domain: 'Ecology',
      purpose: "Scientific and community observation of fauna.",
      users: "Conservationists, Zoologists, Game Wardens.",
      requiredInfo: "Species Name, Habitat, Diet, Population Status, Traditional Significance.",
      aiInterpretation: "Monitor ecological trends, link to biodiversity indices."
    },
    { 
      id: 'agricultural-technique',
      name: 'Agricultural Technique', 
      icon: MapPin, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      domain: 'Agriculture',
      purpose: "Practical methods for farming and land stewardship.",
      users: "Rural Communities, Development Workers.",
      requiredInfo: "Steps, Equipment, Water Requirements, Cost-Benefit Analysis.",
      aiInterpretation: "Compare with local soil/climate data, suggest adaptations."
    },
    { 
      id: 'engineering-method',
      name: 'Engineering Method', 
      icon: Hammer, 
      color: 'text-slate-600', 
      bg: 'bg-slate-50',
      domain: 'Engineering',
      purpose: "Technical procedures for infrastructure and manufacturing.",
      users: "Engineers, Architects, Technicians.",
      requiredInfo: "Specifications, Safety Codes, Materials, Performance Metrics.",
      aiInterpretation: "Validate against international standards, assess sustainability."
    },
    { 
      id: 'architectural-practice',
      name: 'Architectural Practice', 
      icon: Construction, 
      color: 'text-brown-500', 
      bg: 'bg-orange-50',
      domain: 'Engineering',
      purpose: "Design philosophies and building techniques.",
      users: "Urban Planners, Architects, Cultural Historians.",
      requiredInfo: "Design Principles, Materials, Climate Response, Symbolic Meaning.",
      aiInterpretation: "Analyze thermal efficiency, link to cultural identity."
    },
    { 
      id: 'innovation',
      name: 'Innovation', 
      icon: Lightbulb, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-50',
      domain: 'Innovation',
      purpose: "New solutions or adaptations of existing knowledge.",
      users: "Entrepreneurs, Inventors, Investors.",
      requiredInfo: "Novelty, Prototype Status, Market Fit, Scalability Plan.",
      aiInterpretation: "Assess commercial viability, identify patent/IP potential."
    },
    { 
      id: 'scientific-experiment',
      name: 'Scientific Experiment', 
      icon: Binary, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50',
      domain: 'Science & Theory',
      purpose: "Controlled tests to validate or debunk theories.",
      users: "Laboratory Staff, Grad Students.",
      requiredInfo: "Variables, Equipment, Raw Data, Error Margins.",
      aiInterpretation: "Validate statistical significance, check for bias."
    },
    { 
      id: 'historical-discovery',
      name: 'Historical Discovery', 
      icon: Globe, 
      color: 'text-emerald-700', 
      bg: 'bg-emerald-50',
      domain: 'History',
      purpose: "Records of past events or archaeological finds.",
      users: "Historians, Tourists, Researchers.",
      requiredInfo: "Date, Location, Evidence, Significance, Source.",
      aiInterpretation: "Synthesize timelines, correlate with oral traditions."
    },
    { 
      id: 'environmental-observation',
      name: 'Environmental Observation', 
      icon: Eye, 
      color: 'text-teal-500', 
      bg: 'bg-teal-50',
      domain: 'Ecology',
      purpose: "Real-time or longitudinal monitoring of nature.",
      users: "Climate Scientists, Local Citizens.",
      requiredInfo: "Sensor Data, Visual Evidence, Date/Time, Location.",
      aiInterpretation: "Identify anomalies, feed into climate models."
    },
    { 
      id: 'climate-adaptation-strategy',
      name: 'Climate Adaptation Strategy', 
      icon: CloudRain, 
      color: 'text-sky-500', 
      bg: 'bg-sky-50',
      domain: 'Governance',
      purpose: "Plans to mitigate climate change impact.",
      users: "NGOs, Local Government, Community Leaders.",
      requiredInfo: "Risk Profile, Resource Needs, Timeline, Impact Targets.",
      aiInterpretation: "Simulate outcomes, optimize resource allocation."
    },
    { 
      id: 'educational-lesson',
      name: 'Educational Lesson', 
      icon: GraduationCap, 
      color: 'text-violet-500', 
      bg: 'bg-violet-50',
      domain: 'Education',
      purpose: "Structured content for knowledge transfer.",
      users: "Teachers, Students, Lifelong Learners.",
      requiredInfo: "Learning Objectives, Level, Assessment, Resources.",
      aiInterpretation: "Adapt complexity based on user profile, generate quizzes."
    },
    { 
      id: 'policy',
      name: 'Policy', 
      icon: Gavel, 
      color: 'text-stone-700', 
      bg: 'bg-stone-50',
      domain: 'Governance',
      purpose: "Legal and administrative frameworks.",
      users: "Lawyers, Civil Servants, Activists.",
      requiredInfo: "Legal Basis, Enforcement, Scope, Review Date.",
      aiInterpretation: "Summarize legal text, identify cross-policy conflicts."
    },
    { 
      id: 'dataset',
      name: 'Dataset', 
      icon: Database, 
      color: 'text-gray-600', 
      bg: 'bg-gray-100',
      domain: 'Academia',
      purpose: "Raw or processed data for secondary analysis.",
      users: "Data Scientists, Researchers.",
      requiredInfo: "Schema, Format, Size, Collection Method, License.",
      aiInterpretation: "Profile data distribution, identify missing values."
    },
    { 
      id: 'tool-or-technology',
      name: 'Tool or Technology', 
      icon: Cpu, 
      color: 'text-purple-700', 
      bg: 'bg-purple-50',
      domain: 'Innovation',
      purpose: "Hardware or software used to perform tasks.",
      users: "Users, Developers, Engineers.",
      requiredInfo: "User Guide, Specs, Maintenance, Source Code/Blueprints.",
      aiInterpretation: "Compare features, troubleshoot common issues."
    },
    { 
      id: 'community-observation',
      name: 'Community Observation', 
      icon: Users, 
      color: 'text-pink-500', 
      bg: 'bg-pink-50',
      domain: 'Heritage',
      purpose: "Crowdsourced insights and local sightings.",
      users: "General Public, Citizen Scientists.",
      requiredInfo: "Description, Media, Authenticity Score.",
      aiInterpretation: "Filter noise, identify emerging trends or crises."
    }
  ];

  const hierarchy = [
    { 
      domain: 'Agriculture', 
      types: ['Crop', 'Agricultural Technique', 'Soil (Future)', 'Irrigation (Future)', 'Livestock (Future)', 'Pest Control (Future)'],
      color: 'bg-emerald-100 text-emerald-800'
    },
    { 
      domain: 'Healthcare', 
      types: ['Medicinal Plant', 'Diseases (Future)', 'Nutrition (Future)', 'Public Health (Future)'],
      color: 'bg-rose-100 text-rose-800'
    },
    { 
      domain: 'Science & Theory', 
      types: ['Scientific Concept', 'Scientific Experiment', 'Dataset', 'Research Paper'],
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      domain: 'Engineering', 
      types: ['Engineering Method', 'Architectural Practice', 'Civil (Future)', 'Mechanical (Future)', 'Indigenous Engineering'],
      color: 'bg-slate-100 text-slate-800'
    },
    { 
      domain: 'Heritage', 
      types: ['Indigenous Practice', 'Historical Discovery', 'Community Observation'],
      color: 'bg-amber-100 text-amber-800'
    },
    { 
      domain: 'Governance', 
      types: ['Policy', 'Climate Adaptation Strategy'],
      color: 'bg-stone-100 text-stone-800'
    },
    { 
      domain: 'Education', 
      types: ['Educational Lesson'],
      color: 'bg-violet-100 text-violet-800'
    },
    { 
      domain: 'Innovation', 
      types: ['Innovation', 'Tool or Technology'],
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const bridgeGraphRelations = [
    { source: 'Medicinal Plant', targets: ['Diseases', 'Scientific Studies', 'Regions', 'Communities', 'Active Compounds'] },
    { source: 'Research Paper', targets: ['Experiments', 'Authors', 'Universities', 'Knowledge Articles', 'Datasets'] },
    { source: 'Crop', targets: ['Soil Types', 'Pest Species', 'Traditional Techniques', 'Market Prices', 'Regional Climate'] },
    { source: 'Indigenous Practice', targets: ['Ethical Guidelines', 'Elders', 'Tools', 'Natural Resources', 'Scientific Validations'] }
  ];

  const aiBehaviors = [
    { type: 'Research Papers', protocol: "Prioritize citations, summarize findings, compare methodologies, assess statistical significance." },
    { type: 'Indigenous Practices', protocol: "Preserve cultural context, compare with scientific evidence without dismissing spiritual context, avoid unsupported universal conclusions." },
    { type: 'Educational Lessons', protocol: "Simplify concepts based on Bloom's taxonomy, adapt to learner level, suggest interactive quizzes and knowledge checks." },
    { type: 'Medicinal Plants', protocol: "Verify botanical nomenclature, cross-reference toxicity data, highlight traditional dosage alongside pharmacological data." },
    { type: 'Climate Strategies', protocol: "Project long-term outcomes, assess scalability in rural contexts, identify policy dependencies." }
  ];

  const extensibilityRules = [
    { title: 'CKO Compliance', desc: 'Any new type must utilize the Core Knowledge Object schema as its base. No field shadowing.' },
    { title: 'Domain Alignment', desc: 'New types must be categorized under one of the 8 primary domains or justify a new domain creation.' },
    { title: 'AI Instruction Set', desc: 'A new type is not "live" until a specific AI Behavioral Protocol is defined and tested.' },
    { title: 'Naming Convention', desc: 'Types must use Camel Case and be singular (e.g., "MedicinalPlant", not "Medicinal Plants").' }
  ];

  const activeTypeData = knowledgeTypes.find(t => t.name === selectedType) || knowledgeTypes[0];

  return (
    <div className="min-h-screen bg-[#FDFCF6] pb-32 font-sans">
      {/* Header Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/knowledge-type-system-header-71b7f500-1782898278794.webp"
          className="w-full h-full object-cover"
          alt="Knowledge Type System"
        />
        <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-6"
          >
            <Badge className="bg-amber-500 text-emerald-950 font-bold px-6 py-2">MODULE 2.6: CLASSIFICATION FRAMEWORK</Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              The Knowledge Type System
            </h1>
            <p className="text-emerald-100/90 text-xl md:text-2xl font-light italic">
              Bridging domains through a standardized, polymorphic taxonomy.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto -mt-16 relative z-10 px-6">
        <Tabs defaultValue="explorer" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white/95 backdrop-blur shadow-2xl border-emerald-100 p-2 h-auto rounded-full flex gap-1 overflow-x-auto">
              <TabsTrigger value="explorer" className="rounded-full px-6 py-3 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Search className="w-4 h-4 mr-2" /> Explorer</TabsTrigger>
              <TabsTrigger value="hierarchy" className="rounded-full px-6 py-3 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><ListTree className="w-4 h-4 mr-2" /> Hierarchy</TabsTrigger>
              <TabsTrigger value="graph" className="rounded-full px-6 py-3 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Share2 className="w-4 h-4 mr-2" /> Bridge Graph</TabsTrigger>
              <TabsTrigger value="ai" className="rounded-full px-6 py-3 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><Zap className="w-4 h-4 mr-2" /> AI Protocols</TabsTrigger>
              <TabsTrigger value="extensibility" className="rounded-full px-6 py-3 data-[state=active]:bg-emerald-900 data-[state=active]:text-white font-bold"><GitBranch className="w-4 h-4 mr-2" /> Framework</TabsTrigger>
            </TabsList>
          </div>

          {/* Explorer Tab */}
          <TabsContent value="explorer">
            <div className="grid lg:grid-cols-4 gap-8">
              <Card className="lg:col-span-1 border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-emerald-950 text-white p-6">
                  <CardTitle className="text-xl font-serif">Primary Types</CardTitle>
                  <CardDescription className="text-emerald-200/70 text-xs">Select a classification to view details.</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-1">
                      {knowledgeTypes.map((type) => (
                        <button
                          key={type.name}
                          onClick={() => setSelectedType(type.name)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            selectedType === type.name 
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-200 border shadow-sm' 
                              : 'hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <type.icon className={`w-4 h-4 ${selectedType === type.name ? 'text-amber-600' : 'text-stone-400'}`} />
                          <span className="font-bold text-sm">{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedType}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-[3rem] shadow-2xl border border-stone-100 p-10 h-full"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                      <div className="flex items-center gap-6">
                        <div className={`p-6 rounded-3xl ${activeTypeData.bg}`}>
                          <activeTypeData.icon className={`w-12 h-12 ${activeTypeData.color}`} />
                        </div>
                        <div>
                          <Badge className="bg-amber-100 text-amber-800 mb-2">{activeTypeData.domain}</Badge>
                          <h4 className="text-4xl font-serif font-bold text-emerald-950 uppercase">{activeTypeData.name}</h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <Badge variant="outline" className="border-emerald-200 text-emerald-800">CKO Compliant</Badge>
                         <Badge variant="outline" className="border-amber-200 text-amber-800">AI Ready</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <section>
                          <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Purpose & Context</h5>
                          <p className="text-stone-700 text-lg leading-relaxed">{activeTypeData.purpose}</p>
                        </section>
                        <section>
                          <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Primary User Groups</h5>
                          <p className="text-stone-700 font-medium">{activeTypeData.users}</p>
                        </section>
                        <section>
                          <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Required Schema Extensions</h5>
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-emerald-900 text-sm font-medium">{activeTypeData.requiredInfo}</p>
                          </div>
                        </section>
                      </div>

                      <Card className="bg-emerald-950 text-white p-8 rounded-[2.5rem] border-none shadow-2xl self-start">
                        <h5 className="text-amber-400 font-bold mb-6 flex items-center gap-2">
                          <Zap className="w-5 h-5" /> AI Interpretation Protocol
                        </h5>
                        <div className="space-y-4">
                          <p className="text-emerald-100/90 leading-relaxed italic text-sm">
                             "{activeTypeData.aiInterpretation}"
                          </p>
                          <hr className="border-emerald-800" />
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-emerald-400">Trust Weight</span>
                              <span className="font-mono">0.85 - 0.98</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-emerald-400">Retrieval Priority</span>
                              <span className="font-mono">High</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-emerald-400">Cross-Ref Requirement</span>
                              <span className="font-mono">Mandatory</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          {/* Hierarchy Tab */}
          <TabsContent value="hierarchy">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-8">
                  <h3 className="text-4xl font-serif font-bold text-emerald-950">The Knowledge Domain Tree</h3>
                  <p className="text-lg text-stone-600">All knowledge types are anchored into logical domains, ensuring scalable discovery and semantic grouping.</p>
                  
                  <div className="grid gap-4">
                    {hierarchy.map((domain) => (
                      <Card key={domain.domain} className="border border-stone-100 shadow-lg hover:shadow-xl transition-shadow overflow-hidden rounded-3xl">
                        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${domain.color.split(' ')[0]}`} />
                            <h4 className="font-bold text-emerald-900 text-xl">{domain.domain}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {domain.types.map(t => (
                              <Badge key={t} variant="secondary" className="bg-stone-100 text-stone-600 text-[10px]">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
               </div>
               <div className="relative">
                  <img 
                    src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/knowledge-hierarchy-tree-8152c8b0-1782898279298.webp"
                    className="w-full rounded-[3rem] shadow-2xl border-4 border-white"
                    alt="Hierarchy Tree"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-amber-500 text-emerald-950 p-8 rounded-3xl shadow-xl max-w-xs">
                     <p className="font-serif font-bold text-lg mb-2">Structural Integrity</p>
                     <p className="text-xs leading-relaxed">The hierarchy follows a parent-child inheritance model, where child types inherit metadata requirements from their parent domains.</p>
                  </div>
               </div>
             </div>
          </TabsContent>

          {/* Graph Tab */}
          <TabsContent value="graph">
            <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem]">
               <CardHeader className="bg-emerald-950 text-white p-12 text-center">
                  <CardTitle className="text-5xl font-serif font-bold mb-4">The Bridge Graph Ontology</CardTitle>
                  <CardDescription className="text-emerald-200 text-lg max-w-2xl mx-auto">
                    A multi-relational ontology mapping trillions of potential connections across the continent's knowledge nodes.
                  </CardDescription>
               </CardHeader>
               <CardContent className="p-12">
                  <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-6">
                       <h4 className="text-2xl font-serif font-bold text-emerald-950">Core Relationship Examples</h4>
                       <p className="text-stone-600 mb-8">Every knowledge type is designed to be a node in a massive relational graph. Relationships are bidirectional and type-safe.</p>
                       
                       <div className="space-y-4">
                         {bridgeGraphRelations.map((rel) => (
                           <div key={rel.source} className="p-6 bg-stone-50 rounded-3xl border border-stone-200">
                              <div className="flex items-center gap-3 mb-4">
                                 <Badge className="bg-emerald-900">{rel.source}</Badge>
                                 <ArrowRight className="w-4 h-4 text-stone-400" />
                                 <span className="text-stone-400 text-xs font-bold">LINKS TO</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {rel.targets.map(t => (
                                  <Badge key={t} variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">{t}</Badge>
                                ))}
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>

                    <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 flex flex-col justify-center">
                       <div className="space-y-8">
                          <div className="flex gap-6 items-start">
                             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0"><Layers className="text-emerald-600" /></div>
                             <div>
                                <h5 className="font-bold text-emerald-900">Polymorphic Linking</h5>
                                <p className="text-sm text-stone-600">Nodes can have multiple types, allowing an object like "Neem Tree" to exist as both a Medicinal Plant and a Climate Adaptation Strategy.</p>
                             </div>
                          </div>
                          <div className="flex gap-6 items-start">
                             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0"><ExternalLink className="text-emerald-600" /></div>
                             <div>
                                <h5 className="font-bold text-emerald-900">Evidence Anchoring</h5>
                                <p className="text-sm text-stone-600">Every relationship must specify a "Link Type" (e.g., Supported By, Contradicted By, Inspired By) with a confidence score.</p>
                             </div>
                          </div>
                          <div className="flex gap-6 items-start">
                             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0"><Workflow className="text-emerald-600" /></div>
                             <div>
                                <h5 className="font-bold text-emerald-900">Discovery Paths</h5>
                                <p className="text-sm text-stone-600">AI-driven pathfinding allows researchers to discover "Knowledge Bridges"—unexpected links between science and tradition.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </TabsContent>

          {/* AI Protocol Tab */}
          <TabsContent value="ai">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-4xl font-serif font-bold text-emerald-950">AI Behavioral Protocols</h3>
                <p className="text-lg text-stone-600">The system defines how LLMs and RAG agents should process and present information based on the Knowledge Type.</p>
                <div className="space-y-4">
                  {aiBehaviors.map((behavior, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-stone-100 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap className="w-16 h-16 text-emerald-900" />
                      </div>
                      <h4 className="font-bold text-emerald-950 text-xl mb-3 flex items-center gap-3">
                        <div className="w-2 h-8 bg-amber-500 rounded-full" /> {behavior.type}
                      </h4>
                      <p className="text-stone-600 text-sm leading-relaxed italic">{behavior.protocol}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="bg-emerald-950 rounded-[3rem] p-12 text-white self-start shadow-2xl space-y-12">
                 <div>
                   <Badge className="bg-amber-500 text-emerald-950 font-bold mb-4">GLOBAL AI RULES</Badge>
                   <h4 className="text-3xl font-serif font-bold mb-6">The Prime Directives</h4>
                   <div className="space-y-6">
                      {[
                        { title: 'Preservation of Truth', desc: 'Never hallucinate or alter indigenous oral history. If data is missing, state it clearly.' },
                        { title: 'Epistemological Equality', desc: 'Treat scientific and traditional knowledge with equal structural weight in summaries.' },
                        { title: 'Toxicity Awareness', desc: 'Always prioritize safety data in medicinal/chemical knowledge types.' },
                        { title: 'Language Respect', desc: 'Default to the original language for key terms, providing translations as secondary context.' }
                      ].map(rule => (
                        <div key={rule.title} className="space-y-2">
                           <div className="flex items-center gap-2 text-amber-400 font-bold">
                              <ShieldCheck className="w-4 h-4" /> {rule.title}
                           </div>
                           <p className="text-emerald-100/60 text-sm">{rule.desc}</p>
                        </div>
                      ))}
                   </div>
                 </div>
              </div>
            </div>
          </TabsContent>

          {/* Extensibility Tab */}
          <TabsContent value="extensibility">
             <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                   <h3 className="text-4xl font-serif font-bold text-emerald-950">System Extensibility Framework</h3>
                   <p className="text-lg text-stone-600">Guidelines for introducing new knowledge types while maintaining platform consistency.</p>
                </div>

                <div className="grid gap-6">
                   {extensibilityRules.map((rule, idx) => (
                     <Card key={idx} className="p-8 border-none shadow-xl bg-white rounded-[2rem] flex gap-8 items-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-3xl flex items-center justify-center shrink-0 font-serif text-3xl font-bold text-emerald-900">
                          {idx + 1}
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-emerald-950 mb-2">{rule.title}</h4>
                           <p className="text-stone-500 text-sm">{rule.desc}</p>
                        </div>
                     </Card>
                   ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 p-12 rounded-[3rem] text-center space-y-6">
                   <GitBranch className="w-16 h-16 text-amber-600 mx-auto" />
                   <h4 className="text-2xl font-serif font-bold text-amber-900">Evolutionary Governance</h4>
                   <p className="text-stone-600 max-w-2xl mx-auto italic">
                     "The Knowledge Type System is a living organism. New classifications are proposed by the community, audited by the Governance Council, and technically validated before merging into the Master Reference."
                   </p>
                   <button className="bg-emerald-950 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-900 transition-colors">
                     Propose New Type
                   </button>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 flex items-start gap-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
             <Info className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-emerald-950 text-lg">Architectural Standard v1.4</h5>
            <p className="text-sm text-stone-500 leading-relaxed">
              This <strong>Knowledge Type System Specification</strong> is the authoritative framework for data classification in Knowledge Bridge Africa. All future modules must adhere to these type definitions to ensure global search and AI interoperability.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KnowledgeTypeSystem;
