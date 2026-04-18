import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/ui/Button';
import { DollarSign, CreditCard, PieChart, Plus, Download, Package, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const plans = [
  { name: 'Standard Plan', price: '$49', period: 'month', features: ['Up to 500 Students', 'Basic Analytics', 'Standard Support'] },
  { name: 'Professional Plan', price: '$99', period: 'month', features: ['Unlimited Students', 'Advanced Reports', 'Priority Support'] },
];

const Billing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Subscription & Billing</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage pricing plans and track payments</p>
        </div>
        <Button className="rounded-full shadow-premium" onClick={() => setIsModalOpen(true)}><Plus size={18} /> New Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value="$42,800" icon={DollarSign} trend={{ value: '+12%', isUp: true }} />
        <StatCard title="Active Subs" value="124" icon={CreditCard} trend={{ value: '+5%', isUp: true }} />
        <StatCard title="Pending" value="$1,200" icon={PieChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8">
        <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200">
           <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-tighter">Pricing Plans</h2>
           <div className="space-y-4">
              {plans.map(plan => (
                 <div key={plan.name} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-brand-500 transition-all">
                    <div>
                       <h4 className="font-medium text-gray-900 tracking-tight">{plan.name}</h4>
                       <p className="text-2xl font-bold text-brand-600 mt-1">{plan.price}<span className="text-xs text-slate-400 font-medium lowercase"> / {plan.period}</span></p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl px-4">Edit</Button>
                 </div>
              ))}
           </div>
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
        title="Create New Plan"
        description="Define a new subscription tier for organizations."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input label="Plan Name" placeholder="e.g. Starter Plan" icon={Package} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Monthly Price ($)" placeholder="49" type="number" required />
            <Input label="Yearly Price ($)" placeholder="490" type="number" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Included Features</label>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
              placeholder="Enter features separated by new lines..."
            ></textarea>
          </div>
          <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-2xl border border-brand-100">
            <CheckCircle2 size={20} className="text-brand-600" />
            <p className="text-xs font-medium text-brand-700">Plans are activated immediately across the platform upon creation.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium">Create Plan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Billing;
