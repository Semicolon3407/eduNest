import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { CreditCard, ArrowRight, Download, Calendar, Wallet, History, AlertCircle, CheckCircle2, User, Building2, CreditCard as CardIcon } from 'lucide-react';

const feeHistory = [
  { id: 'INV-2023-001', description: 'Annual Tuition Fee - Term 1', amount: '$4,500', date: 'Sept 15, 2023', status: 'Paid', method: 'Credit Card' },
  { id: 'INV-2023-002', description: 'Laboratory & Resource Fee', amount: '$350', date: 'Oct 02, 2023', status: 'Paid', method: 'Bank Transfer' },
  { id: 'INV-2023-003', description: 'Sports & Athletics Fee', amount: '$200', date: 'Oct 10, 2023', status: 'Paid', method: 'Digital Wallet' },
  { id: 'INV-2023-004', description: 'Annual Tuition Fee - Term 2', amount: '$4,500', date: 'Jan 15, 2024', status: 'Pending', method: '-' },
];

const StudentFees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">My Financials</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage tuition fees, view receipts and handle upcoming payments</p>
        </div>
        <Button className="rounded-2xl h-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600 px-8" onClick={() => setIsModalOpen(true)}>
          <CreditCard size={18} className="mr-2" /> Make Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 transition-all hover:border-brand-100 group">
            <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all">
               <Wallet size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
               <h4 className="text-2xl font-medium text-gray-900  ">$4,500</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 transition-all hover:border-success-100 group">
            <div className="w-14 h-14 bg-success-light text-success-dark rounded-2xl flex items-center justify-center group-hover:bg-success group-hover:text-white transition-all">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid (YTD)</p>
               <h4 className="text-2xl font-medium text-gray-900  ">$5,050</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 transition-all hover:border-warning-100 group">
            <div className="w-14 h-14 bg-warning-light text-warning-dark rounded-2xl flex items-center justify-center group-hover:bg-warning group-hover:text-white transition-all">
               <Calendar size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Due Date</p>
               <h4 className="text-2xl font-medium text-gray-900  ">Jan 15, 2024</h4>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Payment History */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
               <div className="flex items-center justify-between mb-8 px-2">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <History size={20} />
                     </div>
                     <h2 className="text-xl font-medium text-gray-900  ">Billing History</h2>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl"><Download size={16} /> Export Statement</Button>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                           <th className="px-6 py-4">Invoice / Description</th>
                           <th className="px-6 py-4">Date</th>
                           <th className="px-6 py-4">Amount</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-4 py-4 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {feeHistory.map(item => (
                           <tr key={item.id} className="group hover:bg-slate-50/50 transition-all font-sans">
                              <td className="px-6 py-5">
                                 <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors text-sm">{item.description}</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.id}</p>
                              </td>
                              <td className="px-6 py-5">
                                 <p className="text-sm font-medium text-slate-500">{item.date}</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.method}</p>
                              </td>
                              <td className="px-6 py-5 text-sm font-bold text-gray-900">{item.amount}</td>
                              <td className="px-6 py-5">
                                 <Badge variant={item.status === 'Paid' ? 'success' : 'warning'}>{item.status}</Badge>
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <button className="p-2 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-white transition-all shadow-sm group-hover:shadow-md">
                                    {item.status === 'Paid' ? <Download size={18} /> : <ArrowRight size={18} />}
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Upcoming & Info Section */}
         <div className="space-y-6">
            <div className="bg-brand-500 text-white rounded-[40px] p-8 shadow-premium relative overflow-hidden group">
               <div className="relative z-10">
                  <Badge variant="neutral" className="bg-white/10 text-white border-white/10 mb-6 tracking-widest uppercase">Quick Pay</Badge>
                  <h3 className="text-2xl font-medium mb-2 leading-tight">Tuition Installment<br/>is almost due.</h3>
                  <p className="text-brand-100 text-sm font-medium mt-4">Term 2 Tuition ($4,500) is scheduled for Jan 15, 2024. Pay early to avoid late fees.</p>
                  <div className="mt-10">
                     <Button className="w-full bg-white text-brand-600 hover:bg-brand-50 rounded-2xl h-14 font-bold shadow-soft">
                        Pay Term 2 Now
                     </Button>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-400 rounded-full blur-3xl opacity-20 group-hover:scale-110 transition-transform"></div>
            </div>

            <div className="bg-surface p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-start gap-4">
               <div className="w-10 h-10 bg-warning-light text-warning-dark rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-gray-900  ">Financial Support</h4>
                  <p className="text-[10px] font-medium text-slate-500 mt-1 leading-relaxed">Having trouble with payments? Contact our financial aid office for installment plans.</p>
               </div>
            </div>
         </div>
      </div>

      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Secure Checkout"
         description="Review your pending dues and proceed to the payment gateway."
         maxWidth="2xl"
      >
         <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
               <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-500">Selected Invoice</p>
                  <p className="text-sm font-bold text-gray-900">Term 2 Tuition Fee</p>
               </div>
               <div className="flex items-center justify-between py-4 border-y border-slate-200">
                  <p className="text-lg font-medium text-gray-900">Total Amount Due</p>
                  <p className="text-2xl font-bold text-brand-600">$4,500.00</p>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Payment Method</p>
               <div className="grid grid-cols-2 gap-4">
                  {[
                     { id: 'card', name: 'Credit/Debit Card', icon: CardIcon },
                     { id: 'bank', name: 'Bank Transfer', icon: Building2 },
                  ].map(method => (
                     <label key={method.id} className="cursor-pointer group">
                        <input type="radio" name="paymentMethod" value={method.id} className="peer hidden" defaultChecked={method.id === 'card'} />
                        <div className="p-4 rounded-2xl border border-slate-200 bg-white group-hover:border-brand-500 transition-all flex items-center gap-3 peer-checked:border-brand-500 peer-checked:bg-brand-50">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-brand-500 group-hover:bg-brand-100 transition-all peer-checked:bg-brand-100 peer-checked:text-brand-600">
                              <method.icon size={20} />
                           </div>
                           <span className="text-sm font-bold text-slate-600 group-hover:text-brand-900 transition-all">{method.name}</span>
                        </div>
                     </label>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <Input label="Cardholder Name" placeholder="e.g. John Doe" icon={User} required />
               <div className="grid grid-cols-2 gap-4">
                  <Input label="Card Number" placeholder="**** **** **** ****" icon={CardIcon} required />
                  <div className="grid grid-cols-2 gap-2">
                     <Input label="Expiry" placeholder="MM/YY" required />
                     <Input label="CVC" placeholder="***" required />
                  </div>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
               <Button type="submit" className="rounded-xl h-12 px-10 shadow-premium bg-brand-500 text-white hover:bg-brand-600">Proceed to Pay $4,500</Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default StudentFees;
