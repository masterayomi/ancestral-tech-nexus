import React from 'react';
import {
  Globe, MessageCircle, Languages, Mic, Search, ShieldCheck,
  BookOpen, Brain, GitBranch, Share2, Check, AlertTriangle,
  AudioLines, FileAudio, SlidersHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

const pillars = [
  {
    title: 'Cross-Language Retrieval',
    icon: Globe,
    description: 'Enables a user searching in one language to retrieve high-relevance documents written in another.',
    features: [
      { name: 'Shared Vector Space', desc: 'Maps queries and documents into a language-agnostic embedding space using models like XLM-R.' },
      { name: 'Cross-Lingual Alignment', desc: 'Compares semantic vectors rather than literal keywords for true meaning-based search.' },
      { name: 'Query Expansion', desc: 'Automatically includes related regional dialects to broaden the search scope.' }
    ],
  },
  {
    title: 'Context-Aware Translation',
    icon: Languages,
    description: 'Goes beyond literal translation to preserve the original nuance and domain-specific meaning.',
    features: [
      { name: 'Domain-Specific Adapters', desc: 'Specialized models for "Academic Science" vs. "Traditional Medicine".' },
      { name: 'Nuance Preservation', desc: 'Distinguishes between clinical and spiritual contexts for the same word.' },
      { name: 'Zero-Shot Transfer', desc: 'Uses high-resource languages as a bridge to translate low-resource languages.' }
    ],
  },
  {
    title: 'Indigenous Terminology',
    icon: BookOpen,
    description: 'Protects the integrity of unique cultural and local terms that should not be translated.',
    features: [
      { name: 'Terminology Protection Vault', desc: 'A "No-Translate" registry for sacred or highly specific terms (e.g., *Umhlonyane*).' },
      { name: 'Phonetic Glossaries', desc: 'Provides audio pronunciations to ensure researchers respect original names.' },
      { name: 'Entity Linking', desc: 'Maps local names to Latin botanical counterparts in the background.' }
    ],
  },
  {
    title: 'Voice & Accessibility',
    icon: Mic,
    description: 'Enables oral history contribution and makes knowledge accessible to non-literate users.',
    features: [
      { name: 'Speech-to-Text (STT)', desc: 'Fine-tuned models for diverse African accents and regional languages.' },
      { name: 'Text-to-Speech (TTS)', desc: 'Generates natural-sounding responses in local languages for auditory learning.' },
      { name: 'Voice-Query Intent', desc: 'Detects spoken nuances and emotional markers for empathetic assistance.' }
    ],
  },
  {
    title: 'Multilingual Search',
    icon: Search,
    description: 'A seamless search experience that adapts to the user’s linguistic needs in real-time.',
    features: [
      { name: 'Language-Aware Indexing', desc: 'Allows users to filter results by the original language of the document.' },
      { name: 'Auto-Language Detection', desc: 'The search bar identifies input language and adjusts the UI accordingly.' },
      { name: 'Diverse Script Support', desc: "Full support for Latin, Ge'ez, Arabic, and other African writing systems." }
    ],
  },
  {
    title: 'Translation Quality Assurance',
    icon: ShieldCheck,
    description: 'A multi-layered system to ensure the accuracy and reliability of every translation.',
    features: [
      { name: 'Back-Translation Verification', desc: 'AI translates content back to the source to check for "semantic drift".' },
      { name: 'Human-in-the-Loop (HITL)', desc: 'Flags high-importance translations for review by regional linguistic experts.' },
      { name: 'Confidence Scoring', desc: 'Displays a "Translation Accuracy" badge to users, flagging unverified content.' }
    ],
  },
];

const MultilingualArchitecture: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF6] pb-32 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Hero Header */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/7b9c0d0a-9648-43b1-94a2-12d09a535049/multilingual-ai-architecture-hero-82a9135b-1782973756381.webp"
          className="w-full h-full object-cover"
          alt="Multilingual AI Architecture"
        />
        <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl"
          >
            <Badge className="bg-amber-500 text-emerald-950 font-bold px-6 py-2 text-sm uppercase tracking-widest">Module 6.0: Multilingual Architecture</Badge>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-tight">
              The Language Bridge
            </h1>
            <p className="text-emerald-100/90 text-xl md:text-2xl max-w-3xl mx-auto font-light italic leading-relaxed">
              An architecture designed to flow knowledge seamlessly across linguistic boundaries while preserving cultural integrity.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto -mt-20 relative z-10 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 h-full flex flex-col group hover:shadow-2xl transition-all">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                       <pillar.icon className="w-7 h-7 text-emerald-700 group-hover:text-amber-600 transition-colors" />
                     </div>
                     <CardTitle className="text-xl font-serif font-bold text-emerald-950 leading-tight">{pillar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <p className="text-stone-500 text-sm leading-relaxed mb-6">{pillar.description}</p>
                  <ul className="space-y-4">
                    {pillar.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-sm text-stone-800">{feature.name}</p>
                          <p className="text-xs text-stone-500 leading-snug">{feature.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Section */}
        <footer className="max-w-7xl mx-auto mt-24">
          <div className="bg-emerald-950 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 p-8 opacity-5"><Languages className="w-64 h-64" /></div>
              <div className="flex-1 space-y-6 relative z-10">
                <h4 className="text-4xl font-serif font-bold text-amber-400">The Multilingual Mandate</h4>
                <p className="text-emerald-100/70 text-lg leading-relaxed italic">
                    "To build a true bridge, we must speak every language. This architecture ensures that no wisdom is lost in translation and every voice, spoken or written, is heard with clarity and respect."
                </p>
                <div className="flex gap-4">
                    <Badge variant="outline" className="border-amber-500/50 text-amber-400 py-1 px-4">Contextual</Badge>
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 py-1 px-4">Respectful</Badge>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400 py-1 px-4">Accessible</Badge>
                </div>
              </div>
              <div className="w-48 h-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center relative shrink-0">
                <AudioLines className="w-24 h-24 text-amber-500 relative z-10 animate-pulse" />
              </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MultilingualArchitecture;
