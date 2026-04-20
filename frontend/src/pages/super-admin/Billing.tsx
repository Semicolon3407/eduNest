import React, { useState, useEffect } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/ui/Button';
import { DollarSign, CreditCard, PieChart, Download, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { superAdminService } from '../../services/superAdminService.ts';

const FIXED_PLAN_NAMES = ['Monthly', '3 Months', '6 Months', 'Yearly'];

const Billing: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await superAdminService.getPlans();
      if (response.success) {
        // Ensure we only show fixed plans and sort them logically if needed
        const filteredPlans = response.data.filter((p: any) => FIXED_PLAN_NAMES.includes(p.name));
        setPlans(filteredPlans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPlan) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      monthlyPrice: Number(formData.get('monthlyPrice')),
      yearlyPrice: Number(formData.get('yearlyPrice')),
    };

    try {
      const response = await superAdminService.updatePlan(editingPlan._id, data);
      if (response.success) {
        setIsModalOpen(false);
        fetchPlans();
      }
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Billing & Plans</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage institutional pricing and track revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value="$42,800" icon={DollarSign} trend={{ value: '+12%', isUp: true }} />
        <StatCard title="Active Subs" value="124" icon={CreditCard} trend={{ value: '+5%', isUp: true }} />
        <StatCard title="Pending" value="$1,200" icon={PieChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8">
        <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200">
           <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-tighter">Pricing Plans</h2>
           {isLoading ? (
             <div className="flex justify-center py-10">
               <div className="w-8 h-8 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
             </div>
           ) : (
             <div className="space-y-4">
                {plans.length > 0 ? plans.map(plan => (
                   <div key={plan._id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-brand-500 transition-all">
                      <div>
                         <h4 className="font-medium text-gray-900 tracking-tight">{plan.name}</h4>
                         <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-2xl font-bold text-brand-600">${plan.monthlyPrice}<span className="text-xs text-slate-400 font-medium lowercase"> / mo</span></p>
                            <p className="text-sm font-medium text-slate-400">·</p>
                            <p className="text-lg font-bold text-slate-600">${plan.yearlyPrice}<span className="text-xs text-slate-300 font-medium lowercase"> / yr</span></p>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl px-4" onClick={() => handleEdit(plan)}>Edit Amount</Button>
                   </div>
                )) : (
                  <div className="text-center py-10 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium italic">No fixed plans configured yet.</p>
                  </div>
                )}
             </div>
           )}
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200">
           <h2 className="text-2xl font-medium text-gray-900 mb-8">Recent Payments</h2>
           <div className="space-y-4">
              {[
                { org: 'Green Valley School', amount: '$49.00', date: 'Oct 14, 2023' },
                { org: 'City College', amount: '$99.00', date: 'Oct 12, 2023' },
              ].map((pay, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 group hover:bg-slate-50 transition-all rounded-2xl cursor-pointer">
                    <div>
                       <p className="font-bold text-gray-900 text-sm">{pay.org}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pay.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="font-bold text-gray-900">{pay.amount}</span>
                       <button className="p-2 text-slate-400 hover:text-brand-600"><Download size={18}/></button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${editingPlan?.name} Amount`}
        description="Update the pricing for this subscription tier."
        maxWidth="md"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <Input 
              label="Monthly Price ($)" 
              name="monthlyPrice" 
              defaultValue={editingPlan?.monthlyPrice}
              placeholder="0" 
              type="number" 
              icon={DollarSign}
              required 
            />
            <Input 
              label="Yearly Price ($)" 
              name="yearlyPrice" 
              defaultValue={editingPlan?.yearlyPrice}
              placeholder="0" 
              type="number" 
              icon={CreditCard}
              required 
            />
          </div>
          <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-2xl border border-brand-100">
            <CheckCircle2 size={20} className="text-brand-600" />
            <p className="text-xs font-medium text-brand-700">Price updates will apply to all future organization signups.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium underline-none">Update Amount</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Billing;
