import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  CreditCard, FileText, Download, Send, Plus, 
  DollarSign, Briefcase, Calculator, ChevronDown,
  ShieldCheck, Percent, Search, Filter, GitBranch
} from 'lucide-react';

const staffPayroll = [
  { id: 'EMP-001', name: 'Robert Fox', role: 'Tutor', department: 'Science', branch: 'Main Campus', base: '$4,200', bonus: '$200', tax: '$420', net: '$3,980' },
  { id: 'EMP-002', name: 'Jane Cooper', role: 'HR Manager', department: 'HR', branch: 'North Branch', base: '$3,800', bonus: '$500', tax: '$380', net: '$3,920' },
  { id: 'EMP-003', name: 'Guy Hawkins', role: 'Librarian', department: 'Library', branch: 'Main Campus', base: '$2,200', bonus: '-', tax: '$220', net: '$1,980' },
  { id: 'EMP-004', name: 'James Wilson', role: 'Tutor', department: 'Mathematics', branch: 'West Side', base: '$4,500', bonus: '$300', tax: '$450', net: '$4,350' },
  { id: 'EMP-005', name: 'Emily Davis', role: 'Administrator', department: 'Admin', branch: 'Main Campus', base: '$5,200', bonus: '$1,000', tax: '$520', net: '$5,680' },
];

const Payroll: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedRole, setSelectedRole] = useState('All Designations');

  const filteredPayroll = staffPayroll.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All Branches' || item.branch === selectedBranch;
    const matchesRole = selectedRole === 'All Designations' || item.role === selectedRole;
    return matchesSearch && matchesBranch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Payroll Engine</h1>
          <p className="text-gray-500 mt-1 font-medium">Process salaries, handle statutory deductions and generate payslips</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <Button variant="outline" className="rounded-xl h-11 flex-1 sm:flex-none"><FileText size={18} /> Tax Reports</Button>
           <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-11 bg-brand-500 text-white hover:bg-brand-600 shadow-premium flex-1 sm:flex-none whitespace-nowrap"><Plus size={18} /> Add Adjustment</Button>
           <Button className="rounded-xl h-11 bg-brand-500 text-white hover:bg-brand-600 shadow-premium flex-1 sm:flex-none whitespace-nowrap"><CreditCard size={18} /> Disburse Salaries</Button>
        </div>
      </div>

      <div className="bg-brand-500 text-white rounded-[40px] p-4 sm:p-8 lg:p-12 shadow-premium relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 sm:p-8">
         <div className="relative z-10 max-w-lg">
            <Badge variant="neutral" className="bg-white/10 text-white border-white/20 mb-4 tracking-[0.2em] ">Current Period: October 2023</Badge>
            <h2 className="text-3xl sm:text-4xl font-medium ">Total Payout: $42,500.00</h2>
            <p className="mt-2 text-brand-200 font-medium">142 employees ready for disbursement. No pending compliance alerts found for this cycle.</p>
         </div>
         <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
               <p className="text-[10px] uppercase font-bold tracking-widest text-brand-300 ">Base Payout</p>
               <h4 className="text-xl font-medium mt-1">$38,200</h4>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
               <p className="text-[10px] uppercase font-bold tracking-widest text-brand-300 ">Global Bonus</p>
               <h4 className="text-xl font-medium mt-1">$4,300</h4>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
           <h3 className="text-xl font-medium text-gray-900 shrink-0">Detailed Payslip Preview</h3>
           
           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-grow justify-end max-w-4xl">
              <div className="relative flex-grow max-w-md">
                 <Input 
                   placeholder="Search employee..." 
                   icon={Search} 
                   className="h-11 rounded-xl"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>

              <div className="flex items-center gap-2">
                 <div className="relative min-w-[160px]">
                    <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-tight outline-none focus:bg-white focus:border-brand-500 transition-all appearance-none cursor-pointer font-sans"
                    >
                      <option>All Branches</option>
                      <option>Main Campus</option>
                      <option>North Branch</option>
                      <option>West Side</option>
                    </select>
                    <GitBranch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 </div>

                 <div className="relative min-w-[170px]">
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-tight outline-none focus:bg-white focus:border-brand-500 transition-all appearance-none cursor-pointer font-sans"
                    >
                      <option>All Designations</option>
                      <option>Tutor</option>
                      <option>Administrator</option>
                      <option>HR Manager</option>
                      <option>Librarian</option>
                    </select>
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 </div>

                 <Button variant="outline" className="rounded-xl h-11 w-11 p-0 shrink-0 border-slate-200">
                    <Filter size={18} className="mx-auto" />
                 </Button>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto min-w-[1000px]">
           <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Basic Salary</th>
                <th className="px-6 py-4">Periodic Bonus</th>
                <th className="px-6 py-4">Tax Deduction</th>
                <th className="px-6 py-4">Net Payout</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayroll.map((item) => (
                <tr key={item.id} className="group hover:bg-brand-50/20 transition-all font-sans">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-brand-600 font-bold shadow-sm group-hover:scale-110 transition-all">
                          {item.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-medium text-sm text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.role}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2 text-slate-600">
                        <GitBranch size={14} className="text-brand-400" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{item.branch}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">{item.base}</td>
                  <td className="px-6 py-5 text-sm font-bold text-success-dark">
                    {item.bonus === '-' ? <span className="opacity-30">N/A</span> : item.bonus}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-danger-dark">{item.tax}</td>
                  <td className="px-6 py-5">
                     <span className="bg-brand-50 text-brand-600 px-4 py-2 rounded-xl font-bold text-xs border border-brand-100/50">
                        {item.net}
                     </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm" title="Edit Component">
                          <Calculator size={18}/>
                       </button>
                       <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm" title="Download Payslip">
                          <Download size={18}/>
                       </button>
                       <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm" title="Send Email">
                          <Send size={18}/>
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
        title="Institutional Salary Setup"
        description="Configure basic salary, periodic bonuses, and statutory tax deductions for faculty members."
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1.5 focus-within:z-10 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Staff Selection</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer">
                    <option value="">Choose Employee...</option>
                    {staffPayroll.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <Input label="Basic Salary ($)" placeholder="e.g. 4500.00" icon={DollarSign} required type="number" />
            <Input label="Performance Bonus ($)" placeholder="e.g. 500.00" icon={Plus} required type="number" />
            <Input label="Tax Deduction ($)" placeholder="e.g. 450.00" icon={Percent} required type="number" />
            
            <div className="space-y-1.5 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Disbursement Cycle</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer">
                    <option>Oct 2023 (Current)</option>
                    <option>Nov 2023 (Next)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="md:col-span-2">
              <Input label="Adjustment Remarks" placeholder="Reason for salary change or bonus..." icon={Briefcase} required />
            </div>
          </div>

          <div className="bg-brand-50/50 p-6 rounded-[32px] border border-brand-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
               <ShieldCheck size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-brand-600 leading-tight uppercase tracking-tight">Financial Audit Lock</p>
               <p className="text-[10px] text-brand-700/70 mt-1 leading-relaxed italic uppercase font-medium tracking-tight">Changes to salary components require institutional audit clearance. This update will be logged for the quarterly financial review.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6 font-sans font-bold text-xs uppercase tracking-widest">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest">
               <ShieldCheck size={18} /> Update Ledger
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payroll;
