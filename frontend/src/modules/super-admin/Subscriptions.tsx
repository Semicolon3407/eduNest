import { CreditCard, Download, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';

export function Subscriptions() {
  const transactions = [
    { id: 'INV-001', org: 'Westfield College', amount: '$450.00', status: 'Paid', date: 'Oct 01, 2025' },
    { id: 'INV-002', org: 'Green Valley School', amount: '$150.00', status: 'Pending', date: 'Oct 05, 2025' },
    { id: 'INV-003', org: 'St. Mary\'s Academy', amount: '$99.00', status: 'Paid', date: 'Sept 28, 2025' },
    { id: 'INV-004', org: 'Horizon Institute', amount: '$299.00', status: 'Failed', date: 'Sept 25, 2025' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions & Billing</h1>
          <p className="mt-1 text-muted-foreground">Manage pricing plans, track automated invoices, and platform revenue.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Monthly Revenue" value="$42,850" icon={<CreditCard size={24} />} trend={{ value: 12, isUp: true }} />
        <StatCard title="Active Subs" value="98" icon={<CheckCircle2 size={24} />} trend={{ value: 4, isUp: true }} />
        <StatCard title="Overdue Invoices" value="4" icon={<ArrowUpRight size={24} />} className="ring-2 ring-red-500/5" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Pricing Plans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Active Plans</h2>
            <button className="text-sm font-bold text-primary-600 hover:underline">Edit Plans</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
             <PlanCard name="Basic" price="99" features={['Up to 500 Students', '1 Branch', 'Standard Support']} />
             <PlanCard name="Pro" price="299" features={['Up to 2000 Students', '3 Branches', 'Priority Support']} active />
             <PlanCard name="Enterprise" price="Custom" features={['Unlimited Students', 'Unlimited Branches', 'Dedicated Support']} />
          </div>

          <div className="rounded-2xl border bg-background overflow-hidden">
            <div className="border-b bg-muted/50 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold">Recent Invoices</h3>
              <div className="flex items-center gap-2">
                <Search size={16} className="text-muted-foreground" />
                <button className="text-xs font-bold text-primary-600">Export</button>
              </div>
            </div>
            <div className="divide-y">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <Download size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{tx.org}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{tx.id} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{tx.amount}</p>
                    <span className={`text-[10px] font-black uppercase ${
                      tx.status === 'Paid' ? 'text-green-600' : tx.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Analytics Summary */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold mb-6">Revenue Mix</h2>
          <div className="space-y-6 flex-1">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary-600"></div>
                    <span className="text-xs font-bold">Enterprise Plans</span>
                </div>
                <span className="text-sm font-black">64%</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary-400"></div>
                    <span className="text-xs font-bold">Pro Plans</span>
                </div>
                <span className="text-sm font-black">28%</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary-200"></div>
                    <span className="text-xs font-bold">Basic Plans</span>
                </div>
                <span className="text-sm font-black">8%</span>
             </div>
          </div>
          <div className="mt-8 rounded-xl bg-primary-50 p-4 border border-primary-100">
             <p className="text-xs font-bold text-primary-800 ">Net revenue increased by 15% this quarter due to new enterprise onboardings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ name, price, features, active }: { name: string, price: string, features: string[], active?: boolean }) {
    return (
        <div className={`rounded-xl border p-5 transition-all ${active ? 'ring-2 ring-primary-600 border-primary-600 shadow-lg' : 'hover:border-primary-200'}`}>
            <h4 className="font-extrabold text-sm tracking-widest uppercase mb-1">{name}</h4>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-black ">{price === 'Custom' ? '' : '$'}{price}</span>
                {price !== 'Custom' && <span className="text-[10px] font-bold text-muted-foreground uppercase">/mo</span>}
            </div>
            <ul className="space-y-2 mb-6">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-muted-foreground">
                        <CheckCircle2 size={12} className="text-primary-600 shrink-0 mt-0.5" />
                        {f}
                    </li>
                ))}
            </ul>
            <button className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                active ? 'bg-primary-600 text-white' : 'bg-muted text-foreground hover:bg-muted-foreground hover:text-white'
            }`}>
                {active ? 'Current Default' : 'Select Plan'}
            </button>
        </div>
    )
}
