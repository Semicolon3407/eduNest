import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { CreditCard, ArrowRight, Download, Calendar, Wallet, History, AlertCircle, CheckCircle2, User, CreditCard as CardIcon, Loader2, Landmark } from 'lucide-react';
import { getFeeRecords, initiateEsewaPayment, checkEsewaStatus } from '../../services/studentService';
import toast from 'react-hot-toast';

const StudentFees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('esewa');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getFeeRecords();
      setRecords(res.data);
    } catch (error) {
      console.error('Error fetching fee records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (record?: any) => {
    const amount = record ? record.amount : totalOutstanding;
    const feeRecordId = record?._id;
    const description = record ? record.description : 'Outstanding Dues';

    if (amount <= 0) {
      toast.error('No outstanding amount to pay.');
      return;
    }

    if (paymentMethod === 'esewa') {
      try {
        const res = await initiateEsewaPayment(amount, feeRecordId, description);
        if (res.success) {
          // Store for rescuing buggy eSewa redirects
          localStorage.setItem('pending_esewa_uuid', res.data.transaction_uuid);
          localStorage.setItem('pending_esewa_amount', res.data.total_amount);

          // Create and submit eSewa form
          const form = document.createElement('form');
          form.setAttribute('method', 'POST');
          form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

          Object.keys(res.data).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', res.data[key]);
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Payment initiation failed');
      }
    } else {
      toast.error('Payment method not implemented yet. Please use eSewa.');
    }
  };

  const handleCheckStatus = async (record: any) => {
    const uuid = record.transactionUuid;
    const amount = record.amount.toString();
    
    if (!uuid) {
       toast.error('Missing transaction details for status check.');
       return;
    }
    
    const loadingToast = toast.loading('Verifying with eSewa...');
    try {
      const res = await checkEsewaStatus(uuid, amount);
      if (res.success && res.data.status === 'COMPLETE') {
        toast.success('Payment verified successfully!', { id: loadingToast });
        fetchData(); // Refresh list
      } else {
        toast.error(`Transaction status: ${res.data.status || 'PENDING'}`, { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error.message || 'Status check failed', { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  const totalOutstanding = records.filter(r => r.status !== 'Paid').reduce((acc, r) => acc + r.amount, 0);
  const totalPaid = records.filter(r => r.status === 'Paid').reduce((acc, r) => acc + r.amount, 0);
  const nextDueDate = records.find(r => r.status !== 'Paid')?.date;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">My Financials</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage tuition fees, view receipts and handle upcoming payments</p>
        </div>
        <Button className="rounded-2xl h-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600 px-8" onClick={() => { setSelectedRecord(null); setIsModalOpen(true); }}>
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
               <h4 className="text-2xl font-medium text-gray-900  ">Rs {totalOutstanding}</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 transition-all hover:border-success-100 group">
            <div className="w-14 h-14 bg-success-light text-success-dark rounded-2xl flex items-center justify-center group-hover:bg-success group-hover:text-white transition-all">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid (YTD)</p>
               <h4 className="text-2xl font-medium text-gray-900  ">Rs {totalPaid}</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 transition-all hover:border-warning-100 group">
            <div className="w-14 h-14 bg-warning-light text-warning-dark rounded-2xl flex items-center justify-center group-hover:bg-warning group-hover:text-white transition-all">
               <Calendar size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Due Date</p>
               <h4 className="text-2xl font-medium text-gray-900  ">{nextDueDate ? new Date(nextDueDate).toLocaleDateString() : 'N/A'}</h4>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        {records.length > 0 ? records.map(item => (
                           <tr key={item._id} className="group hover:bg-slate-50/50 transition-all font-sans">
                              <td className="px-6 py-5">
                                 <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors text-sm">{item.description}</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.transactionId || '---'}</p>
                              </td>
                              <td className="px-6 py-5">
                                 <p className="text-sm font-medium text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.method}</p>
                              </td>
                              <td className="px-6 py-5 text-sm font-bold text-gray-900">Rs {item.amount}</td>
                               <td className="px-6 py-5">
                                 <div className="flex flex-col gap-1">
                                    <Badge variant={item.status === 'Paid' ? 'success' : (item.status === 'Pending' ? 'warning' : 'neutral')}>{item.status}</Badge>
                                    {item.status === 'Pending' && item.method === 'eSewa' && (
                                       <button 
                                          onClick={() => handleCheckStatus(item)}
                                          className="text-[10px] font-bold text-brand-500 hover:text-brand-600 underline text-left px-1"
                                       >
                                          Check Status
                                       </button>
                                    )}
                                 </div>
                               </td>
                              <td className="px-6 py-5 text-right">
                                 <button 
                                  onClick={() => {
                                    if (item.status !== 'Paid') {
                                      setSelectedRecord(item);
                                      setIsModalOpen(true);
                                    }
                                  }}
                                  className={`p-2 rounded-lg transition-all shadow-sm group-hover:shadow-md ${item.status === 'Paid' ? 'text-slate-400 hover:text-brand-600 hover:bg-white' : 'text-brand-600 bg-brand-50 hover:bg-brand-500 hover:text-white'}`}
                                 >
                                    {item.status === 'Paid' ? <Download size={18} /> : <ArrowRight size={18} />}
                                 </button>
                              </td>
                           </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="py-10 text-center text-gray-400">No billing history available.</td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-brand-500 text-white rounded-[40px] p-8 shadow-premium relative overflow-hidden group">
               <div className="relative z-10">
                  <Badge variant="neutral" className="bg-white/10 text-white border-white/10 mb-6 tracking-widest uppercase">Quick Pay</Badge>
                  <h3 className="text-2xl font-medium mb-2 leading-tight">Institutional Dues<br/>Pending Approval</h3>
                  <p className="text-brand-100 text-sm font-medium mt-4">Review your outstanding balance of Rs {totalOutstanding}. Pay early to avoid late fees and maintain account active status.</p>
                  <div className="mt-10">
                     <Button 
                      onClick={() => { setSelectedRecord(null); setIsModalOpen(true); }}
                      className="w-full bg-white text-brand-600 hover:bg-brand-50 rounded-2xl h-14 font-bold shadow-soft"
                     >
                        Pay Dues Now
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
         <div className="space-y-8">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
               <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-500">Selected Invoice</p>
                  <p className="text-sm font-bold text-gray-900">{selectedRecord ? selectedRecord.description : 'Academic Fees (Total)'}</p>
               </div>
               <div className="flex items-center justify-between py-4 border-y border-slate-200">
                  <p className="text-lg font-medium text-gray-900">Total Amount Due</p>
                  <p className="text-2xl font-bold text-brand-600">Rs {selectedRecord ? selectedRecord.amount : totalOutstanding}.00</p>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Select Payment Method</p>
               <div className="grid grid-cols-2 gap-4">
                  {[
                     { id: 'esewa', name: 'eSewa ePay', icon: Landmark, color: 'text-success-dark bg-success-light' },
                     { id: 'card', name: 'Credit/Debit Card', icon: CardIcon, color: 'text-brand-600 bg-brand-50' },
                  ].map(method => (
                     <label key={method.id} className="cursor-pointer group">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value={method.id} 
                          className="peer hidden" 
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <div className="p-4 rounded-2xl border border-slate-200 bg-white group-hover:border-brand-500 transition-all flex items-center gap-3 peer-checked:border-brand-500 peer-checked:bg-brand-50">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${method.id === paymentMethod ? method.color : 'bg-slate-50 text-slate-400'}`}>
                              <method.icon size={20} />
                           </div>
                           <span className="text-sm font-bold text-slate-600 group-hover:text-brand-700 transition-all">{method.name}</span>
                        </div>
                     </label>
                  ))}
               </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                 <Input label="Cardholder Name" placeholder="e.g. John Doe" icon={User} required />
                 <div className="grid grid-cols-2 gap-4">
                    <Input label="Card Number" placeholder="**** **** **** ****" icon={CardIcon} required />
                    <div className="grid grid-cols-3 gap-2">
                       <div className="col-span-2">
                          <Input label="Expiry" placeholder="MM/YY" required />
                       </div>
                       <Input label="CVC" placeholder="***" required />
                    </div>
                 </div>
              </div>
            )}

            {paymentMethod === 'esewa' && (
              <div className="p-6 rounded-3xl bg-success-light/30 border border-success/20 flex gap-4 animate-in slide-in-from-top-4 duration-300">
                <div className="w-12 h-12 bg-success text-white rounded-2xl flex items-center justify-center shrink-0 shadow-soft">
                  <Landmark size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-success-dark">Fast & Secure via eSewa</h4>
                  <p className="text-xs text-success-dark/70 mt-1 leading-relaxed">You will be redirected to eSewa's secure portal to complete your transaction. Make sure you have your eSewa credentials ready.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
               <Button 
                onClick={() => handlePayNow(selectedRecord)}
                className="rounded-xl h-12 px-10 shadow-premium bg-brand-500 text-white hover:bg-brand-600"
               >
                Proceed to Pay Rs {selectedRecord ? selectedRecord.amount : totalOutstanding}
               </Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default StudentFees;
