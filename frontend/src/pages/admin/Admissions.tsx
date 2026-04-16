import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Filter, ChevronRight, GraduationCap, Users, User, Calendar, Mail, Phone, Book } from 'lucide-react';

const applicants = [
  { id: 1, name: 'Ava Thompson', grade: 'Grade 1', parent: 'Mark Thompson', stage: 'Interview', date: 'Oct 12, 2023', score: '88/100' },
  { id: 2, name: 'Leo Garcia', grade: 'Grade 5', parent: 'Elena Garcia', stage: 'Document Review', date: 'Oct 14, 2023', score: '-' },
  { id: 3, name: 'Mia Robinson', grade: 'Grade 10', parent: 'Paul Robinson', stage: 'Approved', date: 'Oct 08, 2023', score: '94/100' },
  { id: 4, name: 'Noah Davis', grade: 'Grade 1', parent: 'Sarah Davis', stage: 'Applied', date: 'Oct 16, 2023', score: '-' },
];

const Admissions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Admission Pipeline</h1>
          <p className="text-gray-500 mt-1">Track applicants from initial inquiry to final enrollment</p>
        </div>
        <Button className="rounded-2xl h-12 shadow-premium bg-brand-500 text-white" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Application
        </Button>
      </div>

      {/* Pipeline Stages Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {['Applied', 'Interview', 'Approval', 'Enrolled'].map((stage, i) => (
            <div key={stage} className="bg-surface p-4 rounded-2xl border border-surface-200 flex items-center justify-between group cursor-pointer hover:border-brand-300 transition-all">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stage}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{[12, 5, 24, 156][i]}</h3>
              </div>
              <div className="hidden sm:flex w-8 h-8 rounded-lg bg-surface-100 text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-600 items-center justify-center transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
         ))}
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8 px-1">
           <div className="flex-1">
             <Input placeholder="Search applicants..." icon={Search} />
           </div>
           <Button variant="outline" className="rounded-xl font-bold text-[10px] uppercase tracking-widest py-3 border-slate-200"><Filter size={18}/> Filter Stage</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {applicants.map((app) => (
             <div key={app.id} className="p-6 rounded-3xl border border-surface-100 hover:border-brand-200 transition-all group hover:bg-brand-50/10">
               <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform font-bold text-xl ">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors  ">{app.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                        <GraduationCap size={14} className="text-brand-500" /> Applying for {app.grade}
                      </p>
                    </div>
                  </div>
                  <Badge variant={app.stage === 'Approved' ? 'success' : app.stage === 'Interview' ? 'warning' : 'brand'}>
                    {app.stage}
                  </Badge>
               </div>
               
               <div className="mt-8 flex items-center justify-between border-t border-surface-50 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ">Guardian</p>
                       <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{app.parent}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ">Entry Score</p>
                       <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{app.score}</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-brand-600 font-bold text-[10px] uppercase tracking-widest px-0">Dossier <ChevronRight size={14} /></Button>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Required Form: New Admission Application */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Student Admission"
        description="Initiate a new student enrollment application for the current academic session."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Student Full Name" placeholder="e.g. Ava Thompson" icon={User} required />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 text-sm">Target Grade</label>
               <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                 <option>Grade 1</option>
                 <option>Grade 5</option>
                 <option>Grade 10</option>
                 <option>A-Levels</option>
               </select>
            </div>
            <Input label="Date of Birth" placeholder="YYYY-MM-DD" icon={Calendar} required type="date" />
            <div className="md:col-span-2 pb-2 border-b border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Guardian Information</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Parent / Guardian Name" placeholder="Mark Thompson" icon={Users} required />
                  <Input label="Contact Number" placeholder="+1 (555) 000-0000" icon={Phone} required />
                  <div className="md:col-span-2">
                    <Input label="Guardian Email" placeholder="parent@example.com" icon={Mail} required type="email" />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
               <Book size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-brand-900 leading-tight">Document Verification</p>
               <p className="text-xs text-brand-700 mt-1 leading-relaxed">Proceeding will create a temporary applicant ID. Documents must be uploaded for stage progression.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 transition-all active:scale-95">Register Applicant</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admissions;

