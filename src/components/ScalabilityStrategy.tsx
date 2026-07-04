import React from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Users, 
  Database, 
  Globe, 
  Shield, 
  GraduationCap, 
  MessageSquare, 
  Mic, 
  CheckCircle2, 
  Zap,
  TrendingUp,
  Layers,
  Network,
  Cpu,
  Search,
  Lock
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const SectionHeader = ({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-3xl md:text-4xl font-serif font-bold ${light ? 'text-white' : 'text-emerald-900'} mb-4`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`max-w-2xl mx-auto text-lg ${light ? 'text-stone-200' : 'text-stone-600'}`}
      >
        {subtitle}
      </motion.p>
    )}
    <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full" />
  </div>
);

const ScalabilityStrategy: React.FC = () => {
  const roadmapSteps = [
    {
      phase: "Phase 1: Foundation",
      focus: "Infrastructure Setup",
      deliverable: "Kubernetes orchestration & Global CDN integration.",
      icon: <Layers className="w-6 h-6" />,
      status: "In Progress"
    },
    {
      phase: "Phase 2: Depth",
      focus: "Vector Scaling",
      deliverable: "Transition to partitioned high-density vector indices.",
      icon: <Database className="w-6 h-6" />,
      status: "Upcoming"
    },
    {
      phase: "Phase 3: Breadth",
      focus: "Multi-Agent Beta",
      deliverable: "Launch of AI Research Assistant and Validator prototypes.",
      icon: <Cpu className="w-6 h-6" />,
      status: "Upcoming"
    },
    {
      phase: "Phase 4: Sovereign",
      focus: "Institutional Portal",
      deliverable: "Secure API gateways for Government/University deployments.",
      icon: <Lock className="w-6 h-6" />,
      status: "Planned"
    },
    {
      phase: "Phase 5: Ubiquity",
      focus: "Voice & Edge",
      deliverable: "Ultra-low latency voice interaction for millions.",
      icon: <Mic className="w-6 h-6" />,
      status: "Planned"
    }
  ];

  return (
    <div className="bg-[#fdfcfb] min-h-screen font-sans text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/scalability-hero-623e3c7d-1782974667655.webp"
            alt="AI Scalability Network"
            className="w-full h-full object-cover opacity-90 brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-emerald-900/40 to-[#fdfcfb]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-amber-500 text-white border-none px-4 py-1 text-sm uppercase tracking-widest hover:bg-amber-600">
              Future-Proof Infrastructure
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-md text-white">
              AI Scalability Strategy
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-12 text-stone-100 leading-relaxed">
              Scaling Knowledge Bridge Africa into a continent-wide infrastructure for millions of users and knowledge objects.
            </p>
          </motion.div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { icon: <Users className="w-5 h-5" />, text: "Millions of Users" },
              { icon: <Database className="w-5 h-5" />, text: "Millions of Records" },
              { icon: <Shield className="w-5 h-5" />, text: "Sovereign Deployments" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20"
              >
                <span className="text-amber-400">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Scaling Pillars */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <SectionHeader 
          title="Architecture for Scale" 
          subtitle="A modular, distributed system designed to handle the complexity and volume of continental knowledge exchange."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Users & Traffic",
              icon: <Users className="w-8 h-8 text-amber-500" />,
              points: [
                "Distributed Edge Serving via regional hubs",
                "Asynchronous Processing for complex tasks",
                "Multi-Tenant dynamic rate limiting"
              ],
              color: "bg-emerald-50/50"
            },
            {
              title: "Knowledge Density",
              icon: <Layers className="w-8 h-8 text-amber-500" />,
              points: [
                "Partitioned HNSW Vector Indexing",
                "Hybrid Storage (Hot Vector DB / Cold S3)",
                "Incremental micro-batch embedding updates"
              ],
              color: "bg-amber-50/30"
            },
            {
              title: "Institutional Reach",
              icon: <Globe className="w-8 h-8 text-amber-500" />,
              points: [
                "Kubernetes-based On-Premise support",
                "Federated Search for institutional privacy",
                "Role-based Sovereign Data Governance"
              ],
              color: "bg-stone-50"
            }
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`h-full border-emerald-100 ${pillar.color} hover:shadow-lg transition-shadow overflow-hidden`}>
                <CardContent className="p-8">
                  <div className="mb-6">{pillar.icon}</div>
                  <h3 className="text-xl font-serif font-bold text-emerald-900 mb-4">{pillar.title}</h3>
                  <ul className="space-y-4">
                    {pillar.points.map((point, i) => (
                      <li key={i} className="flex gap-3 text-stone-700 items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Agent Evolution */}
      <section className="py-24 bg-emerald-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Expansion of AI Agents" 
            subtitle="From simple retrieval to complex reasoning and specialized validation."
            light
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI Tutors",
                desc: "Personalized learning paths adapted to local contexts.",
                icon: <GraduationCap className="w-6 h-6" />
              },
              {
                title: "Research Assistant",
                desc: "Synthesizing cross-disciplinary reports and trends.",
                icon: <Search className="w-6 h-6" />
              },
              {
                title: "Voice Assistant",
                desc: "Low-bandwidth oral interfaces for rural access.",
                icon: <Mic className="w-6 h-6" />
              },
              {
                title: "Knowledge Validator",
                desc: "Consensus agent for cross-referencing evidence.",
                icon: <Shield className="w-6 h-6" />
              }
            ].map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-4">
                  {agent.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-amber-400">{agent.title}</h4>
                <p className="text-stone-300 text-sm leading-relaxed">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scalability Roadmap */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <SectionHeader 
          title="Implementation Roadmap" 
          subtitle="A five-phase evolution from regional pilot to continental ubiquity."
        />

        <div className="space-y-4">
          {roadmapSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row gap-6 items-center md:items-start group"
            >
              <div className="flex-none flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  idx === 0 ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-emerald-100 text-emerald-800'
                } group-hover:scale-110 transition-transform shadow-sm`}>
                  {step.icon}
                </div>
                {idx !== roadmapSteps.length - 1 && (
                  <div className="w-0.5 h-16 bg-emerald-100 mt-2" />
                )}
              </div>
              
              <div className="flex-grow bg-white p-6 rounded-2xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-emerald-950">{step.phase}</h3>
                  <Badge variant="outline" className={`${
                    step.status === 'In Progress' ? 'border-amber-500 text-amber-600 bg-amber-50' : 
                    step.status === 'Upcoming' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 
                    'border-stone-200 text-stone-500'
                  }`}>
                    {step.status}
                  </Badge>
                </div>
                <h4 className="text-emerald-800 font-medium mb-2">{step.focus}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{step.deliverable}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Summary Footer */}
      <section className="py-20 px-6 bg-stone-50 border-t border-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-8">
            <TrendingUp className="w-4 h-4" /> Scalability Commitment
          </div>
          <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Built for Africa, Ready for the World</h2>
          <p className="text-lg text-stone-600 mb-10 leading-relaxed">
            Our infrastructure ensures that as more knowledge is uncovered and more users join the bridge, the system only grows stronger, faster, and more reliable. We are not just building an app; we are building a knowledge legacy.
          </p>
          <div className="flex justify-center gap-8 text-emerald-800">
            <div className="text-center">
              <div className="text-3xl font-bold font-serif mb-1">100M+</div>
              <div className="text-xs uppercase tracking-widest text-stone-500">Queries/Day</div>
            </div>
            <div className="w-px h-12 bg-emerald-200" />
            <div className="text-center">
              <div className="text-3xl font-bold font-serif mb-1">&lt;100ms</div>
              <div className="text-xs uppercase tracking-widest text-stone-500">Edge Latency</div>
            </div>
            <div className="w-px h-12 bg-emerald-200" />
            <div className="text-center">
              <div className="text-3xl font-bold font-serif mb-1">Exascale</div>
              <div className="text-xs uppercase tracking-widest text-stone-500">Vector Search</div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="h-24" />
    </div>
  );
};

export default ScalabilityStrategy;
