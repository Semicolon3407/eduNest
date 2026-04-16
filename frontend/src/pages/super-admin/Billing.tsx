import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/ui/Button';
import { DollarSign, CreditCard, PieChart, Plus, Download } from 'lucide-react';

const plans = [
  { name: 'Standard Plan', price: '$49', period: 'month', features: ['Up to 500 Students', 'Basic Analytics', 'Standard Support'] },
  { name: 'Professional Plan', price: '$99', period: 'month', features: ['Unlimited Students', 'Advanced Reports', 'Priority Support'] },
];

const Billing: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Subscription & Billing</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage pricing plans and track payments</p>
        </div>
        <Button className="rounded-full shadow-premium"><Plus size={18} /> New Plan</Button>
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
    </div>
  );
};

export default Billing;
