import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  ShieldCheck, 
  Languages, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Flag, 
  Lightbulb,
  CheckCircle2,
  Cpu,
  Sprout,
  Anchor,
  BookOpen
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-serif font-bold text-emerald-900 mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-stone-600 max-w-2xl mx-auto text-lg"
      >
        {subtitle}
      </motion.p>
    )}
    <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full" />
  </div>
);

const StrategyDoc: React.FC = () => {
  return (
    <div className="bg-[#fdfcfb] min-h-screen font-sans text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/hero-bridge-afb482f3-1782892965482.webp"
            alt="Knowledge Bridge Africa"
            className="w-full h-full object-cover opacity-90 brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-transparent to-[#fdfcfb]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-amber-500 text-white border-none px-4 py-1 text-sm uppercase tracking-widest hover:bg-amber-600">
              Product Strategy Foundation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-md">
              Knowledge Bridge Africa
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-12 text-stone-100 leading-relaxed">
              Bridging ancestral wisdom with modern scientific discovery to fuel global progress.
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-left flex-1"
            >
              <h3 className="text-amber-400 font-serif text-xl mb-3 flex items-center gap-2">
                <Flag className="w-5 h-5" /> Vision
              </h3>
              <p className="text-stone-50">To be the world's most trusted bridge between ancestral African wisdom and modern scientific discovery.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-left flex-1"
            >
              <h3 className="text-amber-400 font-serif text-xl mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" /> Mission
              </h3>
              <p className="text-stone-50">Preserve, validate, and expand African knowledge by connecting indigenous wisdom with research in every African language.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <SectionHeader 
          title="The Foundation of Our Approach" 
          subtitle="Our core values guide every decision, from data collection to scientific validation."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Cultural Sovereignty",
              desc: "Respecting the ownership and sanctity of indigenous knowledge holders.",
              icon: ShieldCheck,
              color: "bg-emerald-50 text-emerald-700"
            },
            {
              title: "Scientific Integrity",
              desc: "Upholding rigorous standards for evidence-based validation and research.",
              icon: Cpu,
              color: "bg-amber-50 text-amber-700"
            },
            {
              title: "Linguistic Inclusivity",
              desc: "Ensuring accessibility through native African languages and dialects.",
              icon: Languages,
              color: "bg-stone-50 text-stone-700"
            },
            {
              title: "Collaborative Synergy",
              desc: "Fostering mutual respect between community elders and researchers.",
              icon: Users,
              color: "bg-emerald-50 text-emerald-700"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-6`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 bg-emerald-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/feature-validation-2686df67-1782892966165.webp" 
            alt="Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-amber-500 text-white mb-6">The Challenge</Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">
                A Library in Flames
              </h2>
              <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                Africa’s vast repository of indigenous knowledge—medicinal, agricultural, and ecological—is rapidly disappearing due to oral-only transmission and the lack of a systematic bridge to modern science.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Why it matters</h4>
                    <p className="text-emerald-200/80">Lost knowledge means lost solutions for climate change, healthcare, and global food security.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Current Solutions are Insufficient</h4>
                    <p className="text-emerald-200/80">Existing databases are often extractive, Western-centric, or fail to account for linguistic nuances.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
              <h3 className="text-2xl font-serif font-bold mb-6 text-amber-400">Market Opportunity</h3>
              <p className="text-stone-300 mb-8 italic">
                "The global 'Indigenous Knowledge Market' is untapped, specifically in bio-prospecting, sustainable tech, and linguistic AI."
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-900/50 rounded-xl border border-emerald-800">
                  <div className="text-3xl font-bold text-white mb-1">2k+</div>
                  <div className="text-sm text-emerald-300 uppercase tracking-wider">Languages</div>
                </div>
                <div className="p-4 bg-emerald-900/50 rounded-xl border border-emerald-800">
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-emerald-300 uppercase tracking-wider">Untapped AI Frontier</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <SectionHeader 
          title="The Ecosystem" 
          subtitle="Connecting knowledge holders with those who can amplify its impact."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-serif font-bold text-emerald-900 flex items-center gap-2">
              <Users className="w-6 h-6" /> Primary Stakeholders
            </h3>
            {[
              { role: "Knowledge Holders", desc: "Indigenous experts, elders, and community leaders preserving oral traditions." },
              { role: "Local Speakers", desc: "Native African language speakers providing linguistic context and nuance." }
            ].map((user, idx) => (
              <div key={idx} className="flex gap-6 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-lg">{user.role}</h4>
                  <p className="text-stone-600">{user.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-serif font-bold text-amber-800 flex items-center gap-2">
              <Globe className="w-6 h-6" /> Secondary Stakeholders
            </h3>
            {[
              { role: "Research Scientists", desc: "Pharmacologists and environmentalists seeking evidence-based traditional methods." },
              { role: "AI Researchers", desc: "Teams building African-centric LLMs and data platforms." }
            ].map((user, idx) => (
              <div key={idx} className="flex gap-6 p-6 bg-amber-50/30 rounded-2xl border border-amber-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-amber-700 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-lg">{user.role}</h4>
                  <p className="text-stone-600">{user.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals & Metrics */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Strategic Goals & Success" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 bg-emerald-900 text-white rounded-lg flex items-center justify-center font-bold">1</div>
                <h3 className="text-2xl font-serif font-bold mb-3">Preserve</h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  Create a robust, multilingual digital archive for oral traditions, ensuring that no piece of wisdom is lost to time.
                </p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 bg-emerald-900 text-white rounded-lg flex items-center justify-center font-bold">2</div>
                <h3 className="text-2xl font-serif font-bold mb-3">Validate</h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  Implement a peer-review system bridging elders and scientists to verify efficacy and safety.
                </p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 bg-emerald-900 text-white rounded-lg flex items-center justify-center font-bold">3</div>
                <h3 className="text-2xl font-serif font-bold mb-3">Expand</h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  Use advanced AI to identify patterns and bridge gaps between traditional practices and modern data.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { label: "Knowledge Entries", value: "50+ Languages", metric: "Validated entries across diverse linguistic groups." },
                { label: "Collaboration Rate", value: "Co-Authored Papers", metric: "Research co-produced by scientists and elders." },
                { label: "Language Coverage", value: "Linguistic Depth", metric: "Depth of vocabulary and context in the platform." }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-serif font-bold text-xl text-emerald-900">{kpi.label}</h4>
                    <TrendingUp className="text-amber-500 w-5 h-5" />
                  </div>
                  <div className="text-3xl font-bold text-stone-900 mb-2">{kpi.value}</div>
                  <p className="text-stone-500">{kpi.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-emerald-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 text-center text-amber-400">The "Knowledge First" Principles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: "Indigenous First", desc: "User experience must prioritize the comfort and dignity of knowledge holders.", icon: Anchor },
                { title: 'The "Truth Tag"', desc: 'Clearly distinguish between "Traditional Wisdom" and "Scientifically Validated" data.', icon: Lightbulb },
                { title: "Ethical Attribution", desc: "Always credit the source community for their intellectual property.", icon: ShieldCheck },
                { title: "Scalable Localization", desc: "Design for offline-first and low-bandwidth accessibility.", icon: Globe }
              ].map((p, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="shrink-0">
                    <p.icon className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{p.title}</h4>
                    <p className="text-emerald-100/80 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20 pt-12 border-t border-emerald-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-2">Long-term Vision</h3>
                  <p className="text-emerald-200">Become the primary engine for "African-Centric AI" within 5-10 years.</p>
                </div>
                <div className="bg-amber-500 text-emerald-950 px-8 py-4 rounded-full font-bold text-lg cursor-default shadow-lg shadow-amber-500/20">
                  Powering Global Breakthroughs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200 text-center text-stone-500">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-900 rounded flex items-center justify-center text-amber-500 font-serif font-bold">K</div>
          <span className="font-serif font-bold text-stone-900 text-xl tracking-tight">Knowledge Bridge Africa</span>
        </div>
        <p>© 2025 Knowledge Bridge Africa. All rights reserved.</p>
        <p className="mt-2 text-sm">Strategic Foundation Document v1.0</p>
      </footer>
    </div>
  );
};

export default StrategyDoc;
