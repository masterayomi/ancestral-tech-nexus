import React from 'react';
import {
  Book, FileText, Users, Shield, Network, Server, Layers, Briefcase, Milestone, CheckCircle, AlertTriangle, Lightbulb, ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';

const MasterDocumentation: React.FC = () => {
  const features = [
    'Core Knowledge Object (CKO) v2.0', 'AI Knowledge Bridge', 'Knowledge Library', 
    'Indigenous Knowledge Archive', 'Integrity Engine', 'Translation Center', 
    'AI Tutor', 'Admin Dashboard'
  ];

  return (
    <div className="min-h-screen bg-stone-100 font-sans selection:bg-amber-100 selection:text-amber-900">
      <header className="bg-emerald-950 text-white pt-24 pb-12 px-6 border-b-8 border-amber-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center">
              <Book className="w-8 h-8 text-emerald-950" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Master Project Documentation</h1>
              <p className="text-emerald-200/80 text-lg">The single source of truth for Knowledge Bridge Africa.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="summary" className="space-y-12">
          <div className="flex justify-center">
             <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto bg-white border border-stone-200 p-2 rounded-full shadow-lg">
              <TabsTrigger value="summary"><FileText className="w-4 h-4 mr-2"/>Executive Summary</TabsTrigger>
              <TabsTrigger value="architecture"><Layers className="w-4 h-4 mr-2"/>Architecture</TabsTrigger>
              <TabsTrigger value="features"><Briefcase className="w-4 h-4 mr-2"/>Feature Inventory</TabsTrigger>
              <TabsTrigger value="roadmap"><Milestone className="w-4 h-4 mr-2"/>Roadmap & Progress</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary">
            <Card className="shadow-xl border-none">
              <CardHeader>
                <CardTitle className="font-serif text-3xl text-emerald-950">Project Overview</CardTitle>
                <CardDescription>Consolidating the vision, mission, and core principles of Knowledge Bridge Africa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className='italic text-stone-600'>A future where every African language is a bridge to both ancient wisdom and modern science, creating a continent where knowledge is born, shared, and advanced by its own people.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-700">Primary Users</h4>
                    <ul className="list-disc list-inside text-stone-600">
                      <li>Indigenous knowledge holders (elders, herbalists)</li>
                      <li>African researchers and scientists</li>
                      <li>Students and educators</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-700">Core Objectives</h4>
                     <ul className="list-disc list-inside text-stone-600">
                      <li>Preserve and validate indigenous knowledge.</li>
                      <li>Connect wisdom with scientific research.</li>
                      <li>Make knowledge accessible in all African languages.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture">
            <Accordion type="single" collapsible defaultValue="item-5">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-serif font-bold text-emerald-900"><Network className="w-5 h-5 mr-3 text-amber-600"/>Platform Architecture</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4 text-stone-700">
                  <p>The platform utilizes a modular, plug-in architecture designed for scalability. The frontend is a React/Vite application presenting a series of architectural dashboards.</p>
                  <Badge variant="outline">Modular Plug-in Architecture</Badge>
                  <Badge variant="outline">React/Vite Frontend</Badge>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-serif font-bold text-emerald-900"><Users className="w-5 h-5 mr-3 text-amber-600"/>User Roles & Permissions</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4 text-stone-700">
                   <p>A comprehensive RBAC model with 16 distinct roles ensures secure and appropriate access.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-serif font-bold text-emerald-900"><Shield className="w-5 h-5 mr-3 text-amber-600"/>AI & Evidence Framework</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4 text-stone-700">
                  <p>The AI architecture relies on Retrieval-Augmented Generation (RAG) to synthesize information.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl font-serif font-bold text-emerald-900"><Server className="w-5 h-5 mr-3 text-amber-600"/>Data Ontology & Knowledge Model</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4 text-stone-700">
                  <p>The <strong>Core Knowledge Object (CKO) v2.0</strong> is the foundation, featuring a 35+ field schema and dual-verification quality gates.</p>
                  <Badge variant="secondary">CKO Specification v2.0</Badge>
                  <Badge variant="secondary">Integrity Engine Architected</Badge>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-xl font-serif font-bold text-emerald-900"><Layers className="w-5 h-5 mr-3 text-amber-600"/>Knowledge Type System</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4 text-stone-700">
                  <p>A comprehensive classification framework with 20+ primary knowledge types, hierarchical domains, and specific AI behavioral protocols.</p>
                  <Badge variant="secondary">20+ Primary Types</Badge>
                  <Badge variant="secondary">Bridge Graph Ontology</Badge>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-xl font-serif font-bold text-emerald-900"><Network className="w-5 h-5 mr-3 text-amber-600"/>Knowledge Relationship Model</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4 text-stone-700">
                  <p>A multidimensional graph specification defining 30+ relationship types and AI traversal protocols for scientific and indigenous knowledge mapping.</p>
                  <Badge variant="secondary">30+ Relation Types</Badge>
                  <Badge variant="secondary">AI Traversal Protocol</Badge>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-xl font-serif font-bold text-emerald-900"><ShieldCheck className="w-5 h-5 mr-3 text-amber-600"/>Knowledge Governance & Metadata</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4 text-stone-700">
                  <p>A comprehensive framework ensuring traceability and integrity, featuring a 30+ field metadata schema, multi-layered review workflows, and contributor attribution standards.</p>
                  <Badge variant="secondary">30+ Metadata Fields</Badge>
                  <Badge variant="secondary">Trust Protocol v4.0</Badge>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="features">
            <Card className="shadow-xl border-none">
               <CardHeader>
                <CardTitle className="font-serif text-3xl text-emerald-950">Feature & Module Inventory</CardTitle>
                <CardDescription>An inventory of all defined modules within the Knowledge Bridge ecosystem.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The system is composed of 20+ interconnected modules. Below is a partial list of key modules and their status.</p>
                <div className="space-y-3">
                  {features.map(feature => (
                    <div key={feature} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <p className="font-bold text-stone-800">{feature}</p>
                      <Badge className="bg-emerald-100 text-emerald-800">Architected</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roadmap">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-xl border-none">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-emerald-950 flex items-center gap-2"><CheckCircle className="text-emerald-500 w-5 h-5"/>Current Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className='text-stone-600'>Architectural visualization is complete for key pillars:</p>
                  <ul className="list-disc list-inside text-stone-700 font-medium">
                    <li>Product Strategy</li>
                    <li>Information Architecture</li>
                    <li>Core Knowledge Object (CKO)</li>
                    <li>Knowledge Type System</li>
                    <li>Knowledge Relationship Graph</li>
                    <li>RBAC & Security Framework</li>
                    <li>Knowledge Governance & Metadata</li>
                    <li>Feature Ecosystem Blueprint</li>
                    <li>Core Knowledge Object Specification v2.0</li>
                    <li>Knowledge Type System Specification</li>
                  </ul>
                </CardContent>
              </Card>
               <Card className="shadow-xl border-amber-500/50 border-2 bg-amber-50">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-amber-900 flex items-center gap-2"><AlertTriangle className="text-amber-600 w-5 h-5"/>Technical Debt & Risks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className='text-amber-800'>Primary technical debt is the lack of a backend implementation.</p>
                   <ul className="list-disc list-inside text-amber-800 font-medium">
                    <li><span className='font-bold'>Scalability:</span> UI is scalable, but backend performance is theoretical.</li>
                    <li><span className='font-bold'>Security:</span> No live data persistence; RLS policies are designed but not implemented.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default MasterDocumentation;
