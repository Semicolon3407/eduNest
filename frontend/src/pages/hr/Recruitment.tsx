import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  UserPlus, Search, Filter, Mail, Phone, Eye, 
  User, Briefcase, FileText, Trash2, ChevronDown, 
  Shield, Upload, GitBranch
} from 'lucide-react';

const candidatesList = [
  { id: 'CAN-001', name: 'Jonathan Reeves', role: 'Tutor', department: 'Mathematics', qualification: 'PhD', applied: 'Oct 12, 2023', status: 'In Review' },
  { id: 'CAN-002', name: 'Samantha Bloom', role: 'Administrator', department: 'Operations', qualification: 'MBA', applied: 'Oct 14, 2023', status: 'Hired' },
  { id: 'CAN-003', name: 'Marcus Davies', role: 'Tutor', department: 'Science', qualification: 'M.Sc', applied: 'Oct 08, 2023', status: 'In Review' },
  { id: 'CAN-004', name: 'James Wilson', role: 'Administrator', department: 'Finance', qualification: 'CA', applied: 'Oct 05, 2023', status: 'Shortlisted' },
];

const Recruitment: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Staff Recruitment</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage job applications for educators and administrators</p>
        </div>
        <Button className="rounded-xl h-11 px-6 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Add New Listing
        </Button>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-medium text-gray-900  ">Candidate Registry</h2>
            <div className="flex flex-wrap gap-2">
               <Input 
                 placeholder="Search by name or role..." 
                 icon={Search} 
                 className="h-10 w-full sm:w-64" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Button variant="outline" size="sm" className="rounded-xl h-10 px-4"><Filter size={16}/></Button>
            </div>
         </div>

         <div className="overflow-x-auto min-w-[900px]">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] px-6">
                 <th className="px-6 py-4">Applicant</th>
                 <th className="px-6 py-4">Target Role</th>
                 <th className="px-6 py-4">Qualification</th>
                 <th className="px-6 py-4">Applied Date</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {candidatesList.map((can) => (
                 <tr key={can.id} className="group hover:bg-slate-50/50 transition-all">
                   <td className="px-6 py-5">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-brand-600 font-bold group-hover:bg-white group-hover:scale-110 transition-all shadow-sm border border-transparent group-hover:border-brand-100">
                         {can.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight">{can.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{can.id}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-5">
                     <div className="flex flex-col gap-0.5">
                       <p className="text-sm font-medium text-gray-900">{can.department}</p>
                       <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">{can.role}</p>
                     </div>
                   </td>
                   <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full">{can.qualification}</span>
                   </td>
                   <td className="px-6 py-5 text-xs font-medium text-slate-500  ">{can.applied}</td>
                   <td className="px-6 py-5 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-500 transition-all font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm">
                           <FileText size={14}/> View CV
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-white hover:text-brand-600 rounded-xl transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
                           <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-danger-light hover:text-danger rounded-xl transition-all border border-transparent hover:border-danger/20 hover:shadow-sm">
                           <Trash2 size={18} />
                        </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Staff Induction Listing"
        description="Register a new applicant (Tutor or Administrator) for institutional review."
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
               <Input label="Applicant Name" placeholder="e.g. Jonathan Reeves" icon={User} required />
            </div>
            
            <div className="space-y-1.5 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Institutional Designation</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer">
                    <option value="">Select Role...</option>
                    <option value="tutor">Tutor (Faculty)</option>
                    <option value="admin">Institutional Administrator</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <Input label="Target Department" placeholder="e.g. Mathematics" icon={Briefcase} required />
            <Input label="Institutional Email" placeholder="jr@institution.com" icon={Mail} required type="email" />
            <Input label="Personal Email" placeholder="johnathan@gmail.com" icon={Mail} required type="email" />
            <Input label="Contact Number" placeholder="+1 (555) 000-0000" icon={Phone} required />
            
            <div className="space-y-1.5 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Target Branch</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer">
                    <option value="">Select Branch...</option>
                    <option>Main Campus</option>
                    <option>North Branch</option>
                    <option>West Side Academy</option>
                  </select>
                  <GitBranch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
            
            <div className="md:col-span-2">
               <Input label="Highest Qualification" placeholder="e.g. PhD in Applied Mathematics" icon={FileText} required />
            </div>

            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Upload CV / Resume</label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center gap-3 hover:border-brand-500/50 hover:bg-brand-50/20 transition-all cursor-pointer">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-premium border border-slate-100">
                      <Upload size={20} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Drop CV here or click to upload</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-widest italic">PDF or DOCX (Max 5MB)</p>
                   </div>
                   <input type="file" className="hidden" />
                </div>
            </div>
          </div>

          <div className="bg-brand-50/50 p-6 rounded-[32px] border border-brand-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
               <Shield size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-brand-600 leading-tight uppercase tracking-tight">Recruitment Protocol</p>
               <p className="text-[10px] text-brand-700/70 mt-1 leading-relaxed italic uppercase font-medium tracking-tight">This candidate will be added to the institutional review queue. Interview scheduling will be managed via the Admin module.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2">
               <UserPlus size={18} /> Register Staff
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Recruitment;
