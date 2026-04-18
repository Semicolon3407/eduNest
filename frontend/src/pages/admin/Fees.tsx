import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CreditCard, DollarSign, Users, AlertCircle, Download, Plus, FileText, CheckCircle2, MoreHorizontal } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const feeStructures = [
  { id: 1, name: 'Annual Tuition', amount: '$4,500', frequency: 'Annual', category: 'Academic' },
  { id: 2, name: 'Library Membership', amount: '$50', frequency: 'Termly', category: 'Library' },
  { id: 3, name: 'Laboratory Fee', amount: '$200', frequency: 'Annual', category: 'Lab' },
];

const defaulters = [
  { name: 'John Doe', class: 'Grade 10-A', amount: '$1,200', overdue: '14 Days' },
  { name: 'Samantha Reed', class: 'Grade 12-B', amount: '$2,450', overdue: '32 Days' },
];

const Fees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Fee Management</h1>
          <p className="text-gray-500 mt-1">Configure fee structures, track collections, and manage liabilities</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Fee Structure</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft">
            <div className="flex items-center gap-3 text-brand-600 mb-4">
               <DollarSign size={20} />
               <span className="text-[10px] font-medium   leading-none">Total Collected</span>
            </div>
            <h3 className="text-2xl font-medium  ">$142k</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">Current academic year</p>
         </div>
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft">
            <div className="flex items-center gap-3 text-danger mb-4">
               <AlertCircle size={20} />
               <span className="text-[10px] font-medium   leading-none">Unpaid Dues</span>
            </div>
            <h3 className="text-2xl font-medium  ">$24.5k</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">Impacts 42 students</p>
         </div>
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft">
            <div className="flex items-center gap-3 text-success mb-4">
               <CreditCard size={20} />
               <span className="text-[10px] font-medium   leading-none">Online Payments</span>
            </div>
            <h3 className="text-2xl font-medium  ">84%</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">via Stripe/PayPal</p>
         </div>
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft">
            <div className="flex items-center gap-3 text-warning mb-4">
               <Users size={20} />
               <span className="text-[10px] font-medium   leading-none">Defaulters</span>
            </div>
            <h3 className="text-2xl font-medium  ">3.2%</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">Student population</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:p-8">
         {/* Fee Structure Table */}
         <div className="xl:col-span-2 bg-surface p-4 sm:p-8 rounded-[40px] shadow-soft border border-surface-200">
            <h2 className="text-2xl font-medium text-gray-900 mb-8  ">Fee Structures</h2>
            <div className="overflow-x-auto -mx-4 sm:-mx-8">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                    <th className="px-8 py-4">Name / Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Frequency</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {feeStructures.map(fee => (
                    <tr key={fee.id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs shadow-sm border border-brand-100 group-hover:bg-white group-hover:scale-110 transition-all">
                            {fee.category.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{fee.name}</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{fee.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-gray-900">{fee.amount}</span>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="brand">{fee.frequency}</Badge>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-gray-400 hover:bg-white hover:text-brand-600 rounded-xl transition-all shadow-sm border border-transparent hover:border-brand-100">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>

         {/* Defaulter List */}
         <div className="bg-danger/5 p-4 sm:p-8 rounded-[40px] border border-danger/10 flex flex-col shadow-premium">
            <div className="flex items-center gap-2 text-danger mb-6">
               <AlertCircle size={20} fill="currentColor" className="text-white ring-2 ring-danger rounded-full" />
               <h3 className="text-xl font-medium  ">Defaulter List</h3>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
               {defaulters.map(def => (
                  <div key={def.name} className="bg-white p-5 rounded-2xl border border-danger/10 shadow-sm relative overflow-hidden group">
                     <div className="relative z-10 flex justify-between items-start">
                        <div>
                           <h4 className="font-medium text-gray-900 text-sm group-hover:text-danger transition-colors">{def.name}</h4>
                           <p className="text-[10px] font-medium text-gray-400">{def.class}</p>
                        </div>
                        <p className="text-xs font-medium text-danger mt-1  ">{def.overdue} Overdue</p>
                     </div>
                     <div className="relative z-10 mt-4 flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-900">{def.amount}</p>
                        <button className="text-[10px] font-medium bg-danger text-white px-3 py-1 rounded-lg   hover:bg-danger-dark transition-colors">Alert Parent</button>
                     </div>
                  </div>
               ))}
            </div>
            <Button variant="outline" className="mt-8 border-danger/30 text-danger hover:bg-danger hover:text-white h-14">
               <Download size={18} /> Bulk Invoice Reminders
            </Button>
         </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Fee Structure"
        description="Define a new academic or operational fee for students."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input label="Fee Name" placeholder="e.g. Transportation Fee" icon={FileText} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount ($)" placeholder="200" type="number" required />
            <div className="space-y-1.5 focus-within:z-10 group">
              <label className="text-xs font-bold text-gray-400 px-1 uppercase tracking-tight">Billing Frequency</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
                <option value="annual">Annual</option>
                <option value="termly">Termly</option>
                <option value="monthly">Monthly</option>
                <option value="one-time">One-time</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Description / Notes</label>
            <textarea 
              className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
              placeholder="Provide details about what this fee covers..."
            ></textarea>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success-light/30 rounded-2xl border border-success-light">
            <CheckCircle2 size={20} className="text-success-dark" />
            <p className="text-xs font-medium text-success-dark text-[10px] uppercase tracking-wider">This fee will be applied to selected student groups upon save.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white">Create Fee</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;
