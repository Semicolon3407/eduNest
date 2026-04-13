import { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle2, Plus, X, Calendar, AlertCircle } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { superAdminService } from '../../services/superAdminService';

export function Subscriptions() {
  const [plans, setPlans] = useState<any[]>([]);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    platformRevenue: 0,
    activeSubscriptions: 0,
    overdueInvoices: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    billingCycle: 'MONTHLY',
    features: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, historyRes, renewalsRes, metricsRes] = await Promise.all([
        superAdminService.getSubscriptionPlans(),
        superAdminService.getBillingHistory(),
        superAdminService.getRenewals(),
        superAdminService.getSubscriptionMetrics()
      ]);
      setPlans(plansRes.data);
      setBillingHistory(historyRes.data);
      setRenewals(renewalsRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await superAdminService.createSubscriptionPlan({
        ...newPlan,
        price: parseFloat(newPlan.price),
        features: newPlan.features.split(',').map(f => f.trim())
      });
      setIsModalOpen(false);
      setNewPlan({ name: '', price: '', billingCycle: 'MONTHLY', features: '' });
      fetchData();
    } catch (error) {
      alert("Failed to create plan");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions & Billing</h1>
          <p className="mt-1 text-muted-foreground">Manage pricing plans, track automated invoices, and platform revenue.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95"
        >
          <Plus size={18} />
          Create New Plan
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Platform Revenue" value={`$${metrics.platformRevenue.toLocaleString()}`} icon={<CreditCard size={24} />} trend={{ value: 12, isUp: true }} />
        <StatCard title="Active Subs" value={metrics.activeSubscriptions.toString()} icon={<CheckCircle2 size={24} />} trend={{ value: 4, isUp: true }} />
        <StatCard title="Overdue Invoices" value={metrics.overdueInvoices.toString()} icon={<AlertCircle size={24} />} className={metrics.overdueInvoices > 0 ? "ring-2 ring-red-500/50 bg-red-50/10" : ""} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Pricing Plans & Renewals */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Subscription Plans</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
               {loading ? (
                 <div className="col-span-3 py-12 text-center border rounded-2xl border-dashed">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                 </div>
               ) : plans.length > 0 ? (
                 plans.map((plan) => (
                   <PlanCard 
                    key={plan.id}
                    name={plan.name} 
                    price={plan.price.toString()} 
                    features={Array.isArray(plan.features) ? plan.features : []} 
                  />
                 ))
               ) : (
                 <div className="col-span-3 py-12 text-center border rounded-2xl border-dashed text-muted-foreground">
                    No custom plans created yet.
                 </div>
               )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-primary-600" />
              Upcoming Renewals (30 Days)
            </h2>
            <div className="rounded-2xl border bg-background overflow-hidden shadow-sm">
                <div className="overflow-x-auto text-sm text-left">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground">Institution</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground">Current Plan</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground">Renewal Date</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {renewals.length > 0 ? renewals.map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground">{sub.organization?.name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full font-black text-[10px] uppercase">
                              {sub.plan?.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(sub.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-xs font-bold text-primary-600 hover:underline">Remind</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">No renewals pending in the next 30 days.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Billing History</h2>
              <button className="text-xs font-bold text-primary-600 flex items-center gap-1">
                <Download size={14} /> Export All
              </button>
            </div>
            <div className="rounded-2xl border bg-background overflow-hidden shadow-sm">
              <div className="divide-y">
                {billingHistory.length > 0 ? billingHistory.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-6 py-5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold text-xs">
                        INV
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{inv.organization?.name}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{inv.invoiceNumber} • {new Date(inv.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${inv.amount}</p>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        inv.status === 'PAID' ? 'text-green-600' : inv.status === 'PENDING' ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-muted-foreground italic">No billing records found.</div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Revenue Analytics Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-background p-6 shadow-sm flex flex-col h-fit">
            <h2 className="text-xl font-bold mb-6">Revenue Mix</h2>
            <div className="space-y-6 flex-1">
              {plans.map((plan, i) => (
                <div key={plan.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      i === 0 ? "bg-primary-600" : i === 1 ? "bg-primary-400" : "bg-primary-200"
                    )}></div>
                    <span className="text-xs font-bold">{plan.name}</span>
                  </div>
                  <span className="text-sm font-black text-muted-foreground">{(100 / (i + 1.5)).toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-primary-50 p-4 border border-primary-100">
               <p className="text-xs font-bold text-primary-800 leading-normal">
                 Total collected: <span className="text-primary-600 text-sm">${metrics.platformRevenue.toLocaleString()}</span>
               </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-background p-6 shadow-sm border-amber-100 bg-amber-50/20">
             <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle size={16} /> 
                System Notice
             </h3>
             <p className="text-xs text-amber-700 leading-relaxed font-medium">
                Automatic invoicing is active. Invoices are generated 3 days before the subscription period ends.
             </p>
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-background border rounded-3xl shadow-2xl p-8 space-y-6 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Create Subscription Plan</h2>
              <p className="text-sm text-muted-foreground">Define new pricing tiers for institutional partners.</p>
            </div>
            <form onSubmit={handleCreatePlan} className="space-y-4">
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Plan Name</label>
                 <input 
                  required 
                  className="w-full rounded-xl border bg-muted/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                  placeholder="E.g. Growth Plan"
                  value={newPlan.name}
                  onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Monthly Price ($)</label>
                 <input 
                  required 
                  type="number"
                  className="w-full rounded-xl border bg-muted/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                  placeholder="299"
                  value={newPlan.price}
                  onChange={e => setNewPlan({...newPlan, price: e.target.value})}
                />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Key Features (comma separated)</label>
                 <textarea 
                  required 
                  className="w-full rounded-xl border bg-muted/20 px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                  placeholder="Up to 1000 students, Priority support, Free SSL..."
                  value={newPlan.features}
                  onChange={e => setNewPlan({...newPlan, features: e.target.value})}
                />
               </div>
               <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95 mt-2">
                 Publish New Tier
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanCard({ name, price, features }: { name: string, price: string, features: string[] }) {
    return (
        <div className="rounded-2xl border p-6 bg-background hover:border-primary-200 transition-all hover:shadow-md group">
            <h4 className="font-black text-xs tracking-widest uppercase mb-1 text-primary-600">{name}</h4>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black ">${price}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/month</span>
            </div>
            <ul className="space-y-3 mb-2">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-bold text-muted-foreground">
                        <CheckCircle2 size={14} className="text-primary-600 shrink-0 mt-0.5" />
                        {f}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
