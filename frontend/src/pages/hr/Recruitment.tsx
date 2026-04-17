import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { UserPlus, Search, Filter, Mail, Phone, Download, User, Briefcase, FileText, Star, Trash2 } from 'lucide-react';

const candidates = [
  { id: 1, name: 'Jonathan Reeves', role: 'Mathematics Tutor', stage: 'Interviewing', applied: 'Oct 12', score: 8.5 },
  { id: 2, name: 'Samantha Bloom', role: 'HR Assistant', stage: 'Screening', applied: 'Oct 14', score: 7.2 },
  { id: 3, name: 'Marcus Davies', role: 'Science Head', stage: 'Offer Sent', applied: 'Oct 08', score: 9.4 },
];

const Recruitment: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Recruitment Tracker</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage job openings and applicant pipelines</p>
        </div>
        <Button className="rounded-2xl h-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Add Candidate
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
         {['Active Pipelines', 'Interviews Today', 'Pipeline History', 'Archives'].map((tab, idx) => (
            <button key={tab} className={`px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${idx === 0 ? 'bg-brand-500 text-white shadow-premium' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}>
               {tab}
            </button>
         ))}
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200">
         <div className="flex items-center justify-between mb-8 overflow-hidden px-1">
            <h2 className="text-xl font-medium text-gray-900  ">Candidate Pipeline</h2>
            <div className="flex gap-2">
               <div className="hidden md:flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" placeholder="Search applicants..." className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-48 font-sans" />
               </div>
               <Button size="sm" variant="outline" className="rounded-xl"><Filter size={16}/></Button>
            </div>
         </div>

         <div className="space-y-4">
            {candidates.map(candidate => (
               <div key={candidate.id} className="group p-6 bg-slate-50/50 hover:bg-white rounded-[32px] border border-transparent hover:border-brand-500/20 hover:shadow-premium transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white text-brand-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm border border-slate-100 group-hover:border-brand-100">
                        {candidate.name.charAt(0)}
                     </div>
                     <div>
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors ">{candidate.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{candidate.role}</p>
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                     <div className="text-center px-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                        <span className="font-bold text-brand-600">{candidate.score}/10</span>
                     </div>
                     <div className="text-center px-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applied</p>
                        <span className="font-bold text-gray-900  text-xs uppercase">{candidate.applied}</span>
                     </div>
                     <Badge variant={candidate.stage === 'Offer Sent' ? 'success' : 'brand'}>
                        {candidate.stage}
                     </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                     <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500 transition-all"><Mail size={18}/></button>
                     <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500 transition-all"><Phone size={18}/></button>
                     <button className="h-10 px-4 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500 transition-all font-bold text-[10px] uppercase tracking-widest gap-2"><Download size={14}/> CV</button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Required Form: Add Candidate */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Candidate"
        description="Register a new applicant to the recruitment pipeline."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" placeholder="Johnathan Reeves" icon={User} required />
            <Input label="Target Role / Designation" placeholder="e.g. Senior Lecturer" icon={Briefcase} required />
            <Input label="Email Address" placeholder="jr@example.com" icon={Mail} required type="email" />
            <Input label="Contact Number" placeholder="+1 (555) 000-0000" icon={Phone} required />
            <div className="md:col-span-2">
              <Input label="LinkedIn / Portfolio URL" placeholder="https://linkedin.com/in/..." icon={FileText} />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Target Branch</label>
                <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                  <option value="">Select Branch</option>
                  <option value="main">Main Campus</option>
                  <option value="north">North Branch</option>
                  <option value="west">West Side Academy</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Candidate Source</label>
                <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                  <option>LinkedIn</option>
                  <option>Internal Referral</option>
                  <option>Official Website</option>
                  <option>Agency</option>
                </select>
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Initial Screening Score</label>
                <div className="flex items-center gap-3">
                   <div className="flex-1 bg-slate-50 rounded-xl h-12 flex items-center px-4 border border-slate-200 font-sans font-bold">8.5 / 10</div>
                   <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center border border-brand-100">
                     <Star size={20} fill="currentColor" />
                   </div>
                </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex items-start gap-4">
             <div className="w-10 h-10 bg-danger-light text-danger-dark rounded-xl flex items-center justify-center shrink-0 border border-danger/10">
               <Trash2 size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-gray-900 leading-tight">Privacy Notice</p>
               <p className="text-xs text-gray-500 mt-1 leading-relaxed">Candidate data is stored in compliance with institutional GDPR policies.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600">Add to Pipeline</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Recruitment;
