import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Key,
  UserCheck,
  Award,
  Gavel,
  Table as TableIcon,
  Check,
  X,
  ArrowRight,
  ClipboardCheck, 
  FileText, 
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const roles = {
  guest: { title: 'Guest', icon: Users, description: 'Read-only access to public validated content and basic platform exploration.' },
  student: { title: 'Student', icon: Users, description: 'Can save bookmarks, track learning, and use limited AI synthesis queries.' },
  researcher: { title: 'Researcher', icon: UserCheck, description: 'Can upload papers/datasets. Verified status allows peer-reviewing.' },
  elder: { title: 'Community Elder', icon: UserCheck, description: 'Can submit oral traditions and has verification authority for traditional claims.' },
  moderator: { title: 'Moderator', icon: Gavel, description: 'Handles disputes, content quality control, and platform flag management.' },
  admin: { title: 'Administrator', icon: Key, description: 'Full platform configuration, user management, and high-level analytics access.' },
};

const permissions = {
  'View Public Content': { guest: true, student: true, researcher: true, elder: true, moderator: true, admin: true },
  'AI Synthesis Queries': { guest: false, student: true, researcher: true, elder: true, moderator: true, admin: true },
  'Submit Oral Tradition': { guest: false, student: false, researcher: false, elder: true, moderator: true, admin: true },
  'Verify Traditional Claim': { guest: false, student: false, researcher: false, elder: true, moderator: false, admin: true },
  'Upload Research Papers': { guest: false, student: false, researcher: true, elder: false, moderator: true, admin: true },
  'Peer Review (Science)': { guest: false, student: false, researcher: 'Verified', elder: false, moderator: true, admin: true },
  'Moderate Content': { guest: false, student: false, researcher: false, elder: false, moderator: true, admin: true },
  'Manage User Permissions': { guest: false, student: false, researcher: false, elder: false, moderator: false, admin: true },
  'Access Platform Analytics': { guest: false, student: false, researcher: false, elder: false, moderator: false, admin: true },
};

const SecurityArchitecture: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<keyof typeof roles>('researcher');

  return (
    <div className="min-h-screen bg-stone-100 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Header */}
      <header className="bg-emerald-950 text-white pt-24 pb-12 px-6 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">RBAC & Security Framework</h1>
          </div>
          <p className="text-emerald-200/80 max-w-3xl text-lg leading-relaxed">
            A multi-tiered system for permissions, verification, and moderation, designed to ensure the integrity of the Knowledge Bridge ecosystem.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="roles" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white border border-stone-200 p-1.5 rounded-full h-auto flex-wrap justify-center md:flex-nowrap shadow-md">
              <TabsTrigger value="roles" className="rounded-full px-5 py-2 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" /> Role Profiles
              </TabsTrigger>
              <TabsTrigger value="matrix" className="rounded-full px-5 py-2 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <TableIcon className="w-4 h-4 mr-2" /> Permission Matrix
              </TabsTrigger>
              <TabsTrigger value="workflows" className="rounded-full px-5 py-2 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <ClipboardCheck className="w-4 h-4 mr-2" /> Verification
              </TabsTrigger>
              <TabsTrigger value="safeguards" className="rounded-full px-5 py-2 data-[state=active]:bg-emerald-900 data-[state=active]:text-white">
                <ShieldCheck className="w-4 h-4 mr-2" /> Safeguards
              </TabsTrigger>
            </TabsList>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <TabsContent value="roles">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Role Selector */}
                <div className="lg:col-span-1 space-y-3">
                  {Object.entries(roles).map(([key, role]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedRole(key as keyof typeof roles)}
                      className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                        selectedRole === key 
                          ? 'bg-white border-emerald-500 shadow-lg' 
                          : 'bg-stone-50 border-transparent hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <role.icon className={`w-6 h-6 ${selectedRole === key ? 'text-emerald-600' : 'text-stone-500'}`} />
                        <span className="font-bold text-lg text-stone-800">{role.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Role Details */}
                <div className="lg:col-span-2">
                  <Card className="border-none shadow-xl rounded-2xl min-h-[300px]">
                    <CardHeader className="bg-stone-50 rounded-t-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                           <AnimatePresence mode="wait">
                            <motion.div
                              key={selectedRole}
                              initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                              animate={{ opacity: 1, rotate: 0, scale: 1 }}
                              exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                            >
                              {React.createElement(roles[selectedRole].icon, { className: "w-7 h-7 text-emerald-700" })}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-serif text-emerald-950">{roles[selectedRole].title}</CardTitle>
                          <CardDescription>{roles[selectedRole].description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <h4 className="font-bold text-stone-700 mb-4">Key Permissions:</h4>
                      <ul className="space-y-2">
                        {Object.entries(permissions).map(([perm, rolesPerms]) => {
                          const hasPerm = rolesPerms[selectedRole];
                          if (hasPerm) {
                            return (
                              <li key={perm} className="flex items-center gap-3 text-stone-600">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>
                                  {perm}
                                  {typeof hasPerm === 'string' && 
                                    <Badge variant="outline" className="ml-2 border-amber-300 text-amber-700 bg-amber-50">Requires: {hasPerm}</Badge>
                                  }
                                </span>
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="matrix">
               <Card className="shadow-lg border-none">
                <CardContent className="p-0 overflow-x-auto">
                    <Table className="min-w-full divide-y divide-stone-200">
                      <TableHeader className="bg-stone-50">
                        <TableRow>
                          <TableHead className="p-4 font-bold text-stone-800 text-sm">Action / Permission</TableHead>
                          {Object.values(roles).map(r => <TableHead key={r.title} className="text-center p-4 font-bold text-stone-800 text-sm">{r.title}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white divide-y divide-stone-200">
                        {Object.entries(permissions).map(([perm, rolesPerms]) => (
                          <TableRow key={perm} className="hover:bg-stone-50/50">
                            <TableCell className="font-medium p-4 text-stone-700">{perm}</TableCell>
                            {Object.keys(roles).map(roleKey => {
                              const permValue = rolesPerms[roleKey as keyof typeof rolesPerms];
                              return (
                                <TableCell key={roleKey} className="text-center p-4">
                                  {permValue === true ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                  : permValue === false ? <X className="w-5 h-5 text-stone-300 mx-auto" />
                                  : <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">{permValue}</Badge>
                                  }
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="workflows">
              <div className="space-y-12">
                {[
                  {
                    title: 'Researcher Verification', icon: UserCheck,
                    steps: [
                      { name: 'Submit Credentials', desc: 'ORCID, University Email, or Published DOI history.', icon: FileText },
                      { name: 'Automated Check', desc: 'System cross-references public academic databases.', icon: Key },
                      { name: 'Manual Review', desc: 'For edge cases, an Admin reviews the application.', icon: Gavel },
                      { name: 'Grant "Verified" Role', desc: 'Account is upgraded with peer-review permissions.', icon: Award }
                    ]
                  },
                  {
                    title: 'Community Elder Verification', icon: Users,
                    steps: [
                      { name: 'Nomination', desc: 'Submitted by a regional NGO partner or existing Elder Circle.', icon: Mail },
                      { name: 'Community Validation', desc: 'Confirmation from a recognized community leadership body.', icon: Users },
                      { name: 'Grant "Elder" Role', desc: 'Account receives authority to verify traditional claims.', icon: Award }
                    ]
                  }
                ].map(workflow => (
                  <Card key={workflow.title} className="shadow-lg border-none rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 font-serif text-2xl text-emerald-950">
                        <workflow.icon className="w-7 h-7 text-amber-600" />
                        {workflow.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-start gap-4">
                        {workflow.steps.map((step, index) => (
                          <React.Fragment key={step.name}>
                            <div className="flex flex-col items-center gap-4 group flex-1">
                              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-white transition-transform">
                                <step.icon className="w-8 h-8" />
                              </div>
                              <div className="text-center">
                                <h4 className="font-bold text-stone-800">{step.name}</h4>
                                <p className="text-sm text-stone-500 max-w-xs mx-auto">{step.desc}</p>
                              </div>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <div className="hidden md:flex items-center h-16 mt-0">
                                 <ArrowRight className="w-8 h-8 text-stone-300 mt-2"/>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="safeguards">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {
                  [
                    { title: 'Evidence Level Gates', desc: 'Content with low evidence scores is flagged with clear visual disclaimers to distinguish cultural narrative from scientific fact.', icon: ShieldCheck},
                    { title: 'Synthesis Conflict Resolution', desc: 'Disagreements between indigenous and scientific claims are routed to a human "Synthesis Panel" (Elder + Scientist) for nuanced review.', icon: Gavel },
                    { title: 'IP & Attribution Ledger', desc: 'All contributions are timestamped and attributed, with options for blockchain-based ledgers to protect against future biopiracy.', icon: Key }
                  ].map(item => (
                    <Card key={item.title} className="shadow-md border-none rounded-xl hover:shadow-xl transition-shadow bg-white">
                      <CardHeader className="flex-row items-center gap-4">
                         <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                           <item.icon className="w-6 h-6"/>
                         </div>
                         <CardTitle className="font-serif text-lg text-emerald-950">{item.title}</CardTitle>
                      </CardHeader>
                       <CardContent>
                         <p className="text-stone-600">{item.desc}</p>
                       </CardContent>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  );
};

export default SecurityArchitecture;
